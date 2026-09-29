import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsers with generous limits for room photo uploads
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Shared Gemini client initialization with mandatory User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to strip data URL prefix if present
function extractBase64Data(raw: string): { data: string; mimeType: string } {
  if (raw.startsWith('data:')) {
    const matches = raw.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return { mimeType: matches[1], data: matches[2] };
    }
  }
  return { mimeType: 'image/jpeg', data: raw };
}

/**
 * POST /api/analyze-room
 * Feature: "Analyze images" using model "gemini-3.1-pro-preview"
 */
app.post('/api/analyze-room', async (req, res) => {
  try {
    const { image, mimeType: providedMimeType, roomType, goal } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Please provide an image of the room.' });
    }

    const { data: base64Data, mimeType: detectedMimeType } = extractBase64Data(image);
    const mimeType = providedMimeType || detectedMimeType || 'image/jpeg';

    const promptText = `
You are an expert interior spatial architect and master decluttering consultant.
Carefully examine the provided room photo.

Target room category: ${roomType || 'Auto-detect from photo'}
User's decluttering priority: ${goal || 'Balance functionality, visual peace, and practical organization'}

Analyze this space thoroughly and return a well-structured JSON assessment containing:
1. roomType: The detected room type (e.g., "Home Office", "Living Room", "Master Closet", "Kitchen", etc.)
2. overallClutterLevel: One of "Low", "Moderate", "High", or "Severe"
3. summary: A 2-sentence encouraging, precise summary of the current space and its latent potential.
4. hotspots: A list of 3-5 specific cluttered zones visible in the photo. For each hotspot:
   - id: unique slug (e.g. "desk-surface", "floor-corner")
   - title: concise title
   - severity: "High" | "Medium" | "Low"
   - issue: clear description of the friction/disorganization
   - immediateAction: a 5-minute quick win
   - permanentSolution: sustainable system or storage habit
   - suggestedItems: array of 1-3 specific organizing tools or containers
   - estimatedMinutes: number of minutes needed
5. actionPlanPhases: A structured 3-phase decluttering workflow:
   - Phase 1: Rapid Clearing & Triage (Trash, Recycle, Relocate out of room)
   - Phase 2: Category Sorting & Decision Making (Keep, Donate, Discard)
   - Phase 3: Spatial Zoning & Container Placement
   Each phase must include:
   - phaseNumber: integer (1, 2, 3)
   - phaseTitle: title
   - estimatedTime: e.g. "20 mins"
   - steps: array of checklist tasks with:
     - id: unique string
     - title: concise task title
     - description: specific instruction referencing items in the photo
     - category: "Triage" | "Sort" | "Donate" | "Contain" | "Deep Clean"
6. recommendedStorageTools: 3-4 storage or furniture additions with:
   - name: name of organizer
   - purpose: where and why to use it in this specific room
   - budgetLevel: "$" | "$$" | "$$$"
   - diyAlternative: zero-cost household item alternative (e.g. shoe box, jar, binder clips)
7. maintenanceRitual: 3 golden rules for keeping this room clean long-term (e.g. "Nightly 3-minute desk clear", "The 1-in-1-out book policy").
`;

    // MUST use gemini-3.1-pro-preview for image understanding as strictly required
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roomType: { type: Type.STRING },
            overallClutterLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            hotspots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  immediateAction: { type: Type.STRING },
                  permanentSolution: { type: Type.STRING },
                  suggestedItems: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  estimatedMinutes: { type: Type.NUMBER },
                },
                required: ['id', 'title', 'severity', 'issue', 'immediateAction', 'permanentSolution', 'suggestedItems', 'estimatedMinutes'],
              },
            },
            actionPlanPhases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.INTEGER },
                  phaseTitle: { type: Type.STRING },
                  estimatedTime: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        category: { type: Type.STRING },
                      },
                      required: ['id', 'title', 'description', 'category'],
                    },
                  },
                },
                required: ['phaseNumber', 'phaseTitle', 'estimatedTime', 'steps'],
              },
            },
            recommendedStorageTools: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  budgetLevel: { type: Type.STRING },
                  diyAlternative: { type: Type.STRING },
                },
                required: ['name', 'purpose', 'budgetLevel', 'diyAlternative'],
              },
            },
            maintenanceRitual: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'roomType',
            'overallClutterLevel',
            'summary',
            'hotspots',
            'actionPlanPhases',
            'recommendedStorageTools',
            'maintenanceRitual',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No analysis text generated from Gemini.');
    }

    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      modelUsed: 'gemini-3.1-pro-preview',
      data: parsed,
    });
  } catch (error: any) {
    console.error('Room analysis error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to analyze room photo. Please try again.',
    });
  }
});

/**
 * POST /api/chat
 * Feature: "Add a Gemini chatbot"
 * Multi-turn chat interface.
 * Models:
 * - gemini-3.1-pro-preview for particularly complex tasks
 * - gemini-3.5-flash for general tasks
 * - gemini-3.1-flash-lite for tasks that should happen fast
 */
app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages,
      roomContext,
      persona = 'organizer',
      taskComplexity = 'general',
      requestedModel,
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required.' });
    }

    // Determine model based on prompt rule:
    // "Use gemini-3.1-pro-preview for particularly complex tasks, gemini-3.5-flash for general tasks, and gemini-3.1-flash-lite for tasks that should happen fast."
    let model = 'gemini-3.5-flash';
    if (requestedModel) {
      model = requestedModel;
    } else if (taskComplexity === 'complex') {
      model = 'gemini-3.1-pro-preview';
    } else if (taskComplexity === 'fast') {
      model = 'gemini-3.1-flash-lite';
    } else {
      model = 'gemini-3.5-flash';
    }

    // Define persona system instructions
    let roleInstruction = '';
    if (persona === 'minimalist') {
      roleInstruction = `
You are "The Joyful Minimalist" decluttering coach (inspired by Marie Kondo & The Minimalists).
Role:
- Ruthlessly yet gently question the utility and emotional value of cluttered objects.
- Guide the user through the psychology of letting go of items kept out of guilt or sunk cost.
- Emphasize categorization over room-by-room chaos: Clothes, Books, Papers, Miscellaneous (Komono), Sentimental.
- Advise on clean vertical storage and empty counter space to cultivate visual calm.
- Speak in a calm, encouraging, clarity-inducing tone.
`;
    } else if (persona === 'spatial_architect') {
      roleInstruction = `
You are "The Spatial Ergonomics Architect" (specialist in interior architecture, small-space efficiency, and ergonomic flow).
Role:
- Focus on spatial geometry, traffic lanes, floor-to-ceiling vertical clearance, and ergonomic zones (Primary reach: arms length; Secondary: standing reach; Tertiary: step-stool).
- Recommend modular furniture, floating shelving, cable routing, door-back storage, and zoning division.
- Emphasize measurements, container-to-shelf ratios, and visual line-of-sight decluttering.
- Speak with structural precision, practical spatial insight, and architectural flair.
`;
    } else if (persona === 'fast_budget') {
      roleInstruction = `
You are "The Blitz & Budget Organizer" (specialist in 10-minute speed decluttering and zero-dollar hacks).
Role:
- Focus on high-velocity micro-sprints (10-15 minutes max per session to prevent overwhelm).
- Prioritize zero-cost DIY organizing solutions (repurposing shoe boxes, egg cartons, mason jars, tension rods, cardboard dividers).
- Provide immediate, high-impact tactical advice: what to throw in the recycling bin right now in 60 seconds.
- Speak with upbeat, motivating, no-nonsense energy.
`;
    } else {
      roleInstruction = `
You are "DeclutterAI Lead Organizing Consultant", a certified professional organizer and compassionate lifestyle coach.
Role:
- Balance practical spatial organization with realistic daily habits tailored to the user's home life.
- Provide actionable, structured steps with zero judgment and plenty of momentum.
- Break down daunting tasks into simple 1-2-3 actions.
- Offer storage and containment suggestions that are easy to maintain long-term.
`;
    }

    const contextInstruction = roomContext
      ? `\nActive Room Context from photo analysis:\n${typeof roomContext === 'string' ? roomContext : JSON.stringify(roomContext, null, 2)}\nUse this room context to ground your recommendations in their actual space.\n`
      : '';

    const systemInstruction = `${roleInstruction}\n${contextInstruction}\nFormat your responses with clean Markdown, bullet points, and practical steps. Avoid overwhelming the user with long walls of unformatted text.`;

    // Map conversation history to Gemini contents format
    // Ensure all turns have valid role: 'user' | 'model' and parts
    const contents = messages.map((m: any) => {
      const role = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';
      let parts: any[] = [];
      if (typeof m.content === 'string') {
        parts = [{ text: m.content }];
      } else if (Array.isArray(m.parts)) {
        parts = m.parts;
      } else if (typeof m.text === 'string') {
        parts = [{ text: m.text }];
      } else {
        parts = [{ text: String(m.content || '') }];
      }
      return { role, parts };
    });

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || '';

    return res.json({
      success: true,
      modelUsed: model,
      text,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: error?.message || 'Chat service error. Please try again.',
    });
  }
});

// Vite middleware or static serving
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (env: ${isProd ? 'production' : 'development'})`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
