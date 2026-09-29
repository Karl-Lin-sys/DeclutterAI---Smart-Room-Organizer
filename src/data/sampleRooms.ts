export interface SampleRoom {
  id: string;
  name: string;
  roomType: string;
  description: string;
  imageDataUrl: string;
}

// Crisp, high-detail SVG room scenes converted to data URLs for testing
function createSvgDataUrl(svgContent: string): string {
  const encoded = encodeURIComponent(svgContent)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

const officeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
    <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78716C" />
      <stop offset="100%" stop-color="#57534E" />
    </linearGradient>
    <linearGradient id="deskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A16207" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
  </defs>
  <!-- Room Shell -->
  <rect x="0" y="0" width="800" height="420" fill="url(#wallGrad)" />
  <polygon points="0,420 800,420 800,600 0,600" fill="url(#floorGrad)" />
  <!-- Baseboard -->
  <rect x="0" y="410" width="800" height="14" fill="#FFFFFF" opacity="0.9" />

  <!-- Wall Window with Blinds -->
  <rect x="520" y="50" width="220" height="260" fill="#BAE6FD" rx="6" />
  <rect x="520" y="50" width="220" height="260" fill="none" stroke="#64748B" stroke-width="8" />
  <line x1="520" y1="180" x2="740" y2="180" stroke="#64748B" stroke-width="4" />
  <line x1="630" y1="50" x2="630" y2="310" stroke="#64748B" stroke-width="4" />

  <!-- Bookshelf on left, tilting books -->
  <rect x="40" y="60" width="160" height="350" fill="#475569" rx="4" />
  <rect x="46" y="70" width="148" height="60" fill="#334155" />
  <rect x="46" y="140" width="148" height="60" fill="#334155" />
  <rect x="46" y="210" width="148" height="60" fill="#334155" />
  <rect x="46" y="280" width="148" height="120" fill="#334155" />
  <!-- Books cluttered -->
  <rect x="52" y="80" width="16" height="50" fill="#EF4444" />
  <rect x="70" y="85" width="20" height="45" fill="#3B82F6" />
  <rect x="92" y="75" width="14" height="55" fill="#10B981" />
  <polygon points="120,85 140,128 126,128 108,85" fill="#F59E0B" />
  <!-- Loose binders and overflowing papers on shelf -->
  <rect x="52" y="160" width="70" height="38" fill="#F8FAFC" rx="2" />
  <rect x="55" y="152" width="60" height="38" fill="#F1F5F9" rx="2" />
  <rect x="130" y="148" width="45" height="50" fill="#6366F1" />
  <rect x="52" y="235" width="130" height="30" fill="#E2E8F0" />
  <!-- Bottom shelf clutter box -->
  <rect x="56" y="310" width="128" height="75" fill="#D97706" rx="4" />
  <text x="120" y="355" font-family="sans-serif" font-size="12" fill="#78350F" text-anchor="middle">MISC WIRES</text>

  <!-- Main Wooden Office Desk -->
  <polygon points="220,320 620,320 650,470 190,470" fill="url(#deskGrad)" />
  <rect x="200" y="470" width="20" height="110" fill="#58290B" />
  <rect x="620" y="470" width="20" height="110" fill="#58290B" />
  <rect x="230" y="470" width="130" height="90" fill="#78350F" rx="3" />
  <!-- Open Drawer spilling papers -->
  <rect x="235" y="500" width="120" height="40" fill="#9A3412" rx="2" />
  <polygon points="250,495 290,490 300,515 260,515" fill="#FFFFFF" />

  <!-- Dual Monitors & Tangled Cables -->
  <rect x="310" y="220" width="150" height="95" fill="#0F172A" rx="4" />
  <rect x="315" y="225" width="140" height="85" fill="#1E293B" rx="2" />
  <rect x="375" y="315" width="20" height="25" fill="#64748B" />
  <ellipse cx="385" cy="340" rx="30" ry="6" fill="#475569" />

  <rect x="470" y="230" width="130" height="85" fill="#0F172A" rx="4" />
  <rect x="475" y="235" width="120" height="75" fill="#1E293B" rx="2" />
  <rect x="530" y="315" width="15" height="25" fill="#64748B" />

  <!-- Clutter on Desk: Paper Stacks, Mugs, Sticky Notes, Pens -->
  <!-- Left paper pile -->
  <polygon points="230,380 300,375 315,410 240,415" fill="#F8FAFC" stroke="#E2E8F0" />
  <polygon points="225,370 295,365 310,400 235,405" fill="#FFFFFF" stroke="#CBD5E1" />
  <polygon points="228,360 290,358 305,392 238,395" fill="#FEF08A" stroke="#FDE047" />
  <!-- Empty coffee mug -->
  <rect x="320" y="375" width="22" height="28" fill="#EF4444" rx="3" />
  <ellipse cx="331" cy="375" rx="11" ry="4" fill="#B91C1C" />
  <path d="M 342,382 C 350,382 350,395 342,395" fill="none" stroke="#EF4444" stroke-width="4" />
  <!-- Another mug with pen holder -->
  <rect x="290" y="340" width="26" height="32" fill="#0284C7" rx="3" />
  <line x1="298" y1="340" x2="292" y2="315" stroke="#10B981" stroke-width="3" />
  <line x1="305" y1="340" x2="310" y2="310" stroke="#F59E0B" stroke-width="4" />
  <!-- Tangled wires under and across desk -->
  <path d="M 385,340 Q 400,430 420,490 T 470,550" fill="none" stroke="#0F172A" stroke-width="4" />
  <path d="M 535,340 Q 560,400 500,470 T 450,560" fill="none" stroke="#334155" stroke-width="3" />
  <path d="M 420,490 Q 360,520 400,560" fill="none" stroke="#DC2626" stroke-width="3" />
  <path d="M 440,540 Q 480,520 490,570" fill="none" stroke="#2563EB" stroke-width="3" />

  <!-- Ergonomic Chair in front of desk -->
  <rect x="380" y="380" width="90" height="90" fill="#1E293B" rx="12" />
  <ellipse cx="425" cy="485" rx="55" ry="18" fill="#0F172A" />
  <line x1="425" y1="500" x2="425" y2="540" stroke="#64748B" stroke-width="12" />
  <circle cx="390" cy="555" r="8" fill="#334155" />
  <circle cx="460" cy="555" r="8" fill="#334155" />
  <circle cx="425" cy="565" r="8" fill="#334155" />

  <!-- Floor Clutter: Cardboard box, shipping bag, discarded papers -->
  <rect x="520" y="470" width="130" height="90" fill="#D97706" rx="4" />
  <polygon points="520,470 585,450 650,470 585,490" fill="#B45309" />
  <polygon points="630,520 700,505 720,535 650,550" fill="#F1F5F9" stroke="#94A3B8" />
  <polygon points="660,540 730,530 740,565 670,575" fill="#E2E8F0" />
</svg>`;

const livingRoomSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="lrWall" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F1F5F9" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
    <linearGradient id="woodFloor" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#92400E" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
    <linearGradient id="sofaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
  </defs>
  <!-- Room Shell -->
  <rect x="0" y="0" width="800" height="380" fill="url(#lrWall)" />
  <polygon points="0,380 800,380 800,600 0,600" fill="url(#woodFloor)" />
  <rect x="0" y="372" width="800" height="12" fill="#FFFFFF" />

  <!-- Wall Art (Tilted crookedly) -->
  <g transform="rotate(4, 250, 130)">
    <rect x="180" y="70" width="140" height="110" fill="#FFFFFF" stroke="#0F172A" stroke-width="6" />
    <circle cx="230" cy="115" r="25" fill="#F59E0B" />
    <polygon points="190,165 250,125 310,165" fill="#3B82F6" />
  </g>

  <!-- Large Sofa -->
  <rect x="140" y="240" width="520" height="140" fill="url(#sofaGrad)" rx="16" />
  <!-- Sofa Back cushions -->
  <rect x="160" y="190" width="150" height="80" fill="#475569" rx="10" />
  <rect x="325" y="190" width="150" height="80" fill="#475569" rx="10" />
  <rect x="490" y="190" width="150" height="80" fill="#475569" rx="10" />
  <!-- Disordered Throw Blankets & Cushions -->
  <polygon points="170,210 230,195 240,250 180,265" fill="#F97316" rx="4" />
  <path d="M 330,220 C 370,180 430,260 470,230 C 510,290 400,310 330,270 Z" fill="#93C5FD" />
  <polygon points="530,225 580,200 610,250 560,270" fill="#FDE047" />

  <!-- Messy Area Rug -->
  <ellipse cx="400" cy="490" rx="310" ry="90" fill="#E0E7FF" stroke="#C7D2FE" stroke-width="4" />

  <!-- Coffee Table overflowing with clutter -->
  <ellipse cx="400" cy="460" rx="190" ry="50" fill="#713F12" />
  <ellipse cx="400" cy="455" rx="180" ry="44" fill="#854D0E" />
  <!-- Clutter: Magazines, snack plates, 3 remote controls, drink cans -->
  <polygon points="290,440 350,430 365,455 305,465" fill="#F8FAFC" stroke="#94A3B8" />
  <polygon points="295,435 345,428 355,450 305,457" fill="#E2E8F0" />
  <rect x="375" y="440" width="28" height="12" fill="#0F172A" rx="2" />
  <rect x="382" y="455" width="28" height="12" fill="#1E293B" rx="2" />
  <rect x="415" y="435" width="30" height="12" fill="#334155" rx="2" />
  <!-- Soda Can & Cup -->
  <rect x="460" y="430" width="16" height="24" fill="#DC2626" rx="3" />
  <rect x="485" y="432" width="18" height="22" fill="#FFFFFF" rx="2" />

  <!-- Floor Clutter: Scattered Toys, Shoes, Laundry Basket -->
  <!-- Laundry basket -->
  <ellipse cx="140" cy="490" rx="45" ry="25" fill="#94A3B8" />
  <rect x="95" y="490" width="90" height="50" fill="#CBD5E1" rx="4" />
  <path d="M 105,490 Q 140,460 175,490" fill="#EC4899" />
  <!-- Kid's building blocks and toy cars on rug -->
  <rect x="230" y="520" width="22" height="22" fill="#EF4444" rx="2" />
  <rect x="256" y="515" width="20" height="20" fill="#3B82F6" rx="2" />
  <rect x="245" y="495" width="22" height="22" fill="#10B981" rx="2" />
  <ellipse cx="580" cy="520" rx="18" ry="10" fill="#F59E0B" />
  <!-- Pair of shoes kicked off -->
  <ellipse cx="630" cy="480" rx="25" ry="10" fill="#1E293B" />
  <ellipse cx="670" cy="495" rx="25" ry="10" fill="#1E293B" />
</svg>`;

const closetSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="closetWall" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
    <linearGradient id="shelfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="800" height="600" fill="url(#closetWall)" />
  
  <!-- Closet Frame & Shelves -->
  <rect x="60" y="20" width="680" height="560" fill="none" stroke="#64748B" stroke-width="16" rx="6" />
  <!-- Top Wire Shelf -->
  <rect x="70" y="140" width="660" height="12" fill="url(#shelfGrad)" />
  <!-- Middle Dividing Partition -->
  <rect x="390" y="152" width="16" height="420" fill="#94A3B8" />
  <!-- Left Clothes Hanging Bar -->
  <line x1="70" y1="180" x2="390" y2="180" stroke="#64748B" stroke-width="10" />
  <!-- Right Clothes Hanging Bar -->
  <line x1="406" y1="180" x2="730" y2="180" stroke="#64748B" stroke-width="10" />

  <!-- Top Shelf Clutter: Stacks of sweaters, falling bags, mismatched boxes -->
  <rect x="90" y="70" width="90" height="70" fill="#D97706" rx="4" />
  <rect x="190" y="80" width="110" height="60" fill="#3B82F6" rx="4" />
  <polygon points="320,60 410,75 400,140 310,140" fill="#EC4899" />
  <rect x="430" y="55" width="120" height="85" fill="#10B981" rx="4" />
  <rect x="560" y="90" width="150" height="50" fill="#64748B" rx="4" />
  <path d="M 580,70 Q 640,40 680,80 Z" fill="#F59E0B" />

  <!-- Left Hanging Clamored Clothes (Overcrowded) -->
  <g>
    <!-- Repeat dense hangers -->
    <rect x="85" y="185" width="22" height="180" fill="#DC2626" rx="2" />
    <rect x="105" y="185" width="24" height="210" fill="#1D4ED8" rx="2" />
    <rect x="127" y="185" width="18" height="195" fill="#047857" rx="2" />
    <rect x="143" y="185" width="26" height="220" fill="#B45309" rx="2" />
    <rect x="167" y="185" width="20" height="190" fill="#6D28D9" rx="2" />
    <rect x="185" y="185" width="28" height="230" fill="#334155" rx="2" />
    <rect x="211" y="185" width="24" height="175" fill="#BE185D" rx="2" />
    <rect x="233" y="185" width="25" height="205" fill="#0F766E" rx="2" />
    <rect x="256" y="185" width="22" height="215" fill="#1E293B" rx="2" />
    <rect x="276" y="185" width="26" height="190" fill="#E11D48" rx="2" />
    <rect x="300" y="185" width="20" height="225" fill="#4338CA" rx="2" />
    <rect x="318" y="185" width="24" height="185" fill="#65A30D" rx="2" />
    <rect x="340" y="185" width="28" height="210" fill="#D97706" rx="2" />
    <rect x="366" y="185" width="22" height="195" fill="#0F172A" rx="2" />
  </g>

  <!-- Right Side Hanging Clothes & Folded Shelf -->
  <rect x="406" y="320" width="324" height="12" fill="url(#shelfGrad)" />
  <line x1="406" y1="350" x2="730" y2="350" stroke="#64748B" stroke-width="8" />
  <rect x="420" y="185" width="30" height="125" fill="#0284C7" rx="2" />
  <rect x="448" y="185" width="32" height="130" fill="#F43F5E" rx="2" />
  <rect x="478" y="185" width="28" height="120" fill="#10B981" rx="2" />
  <rect x="504" y="185" width="35" height="132" fill="#EAB308" rx="2" />
  <rect x="537" y="185" width="28" height="128" fill="#8B5CF6" rx="2" />

  <!-- Lower Shelving on Right: Unsorted pants & bags -->
  <rect x="420" y="360" width="30" height="170" fill="#1E293B" rx="2" />
  <rect x="448" y="360" width="32" height="165" fill="#3B82F6" rx="2" />
  <rect x="478" y="360" width="30" height="175" fill="#475569" rx="2" />
  <rect x="520" y="370" width="90" height="80" fill="#D97706" rx="6" />
  <rect x="625" y="375" width="85" height="75" fill="#BE185D" rx="6" />

  <!-- Floor Mess: Tumbled shoes, hanger piles, loose socks -->
  <rect x="80" y="440" width="300" height="130" fill="#F1F5F9" opacity="0.6" rx="4" />
  <!-- Piled shoes in disorder -->
  <ellipse cx="120" cy="510" rx="30" ry="12" fill="#0F172A" />
  <ellipse cx="145" cy="530" rx="28" ry="11" fill="#DC2626" />
  <ellipse cx="185" cy="495" rx="32" ry="12" fill="#D97706" />
  <ellipse cx="210" cy="525" rx="28" ry="11" fill="#059669" />
  <ellipse cx="250" cy="505" rx="30" ry="12" fill="#4B5563" />
  <ellipse cx="290" cy="535" rx="28" ry="11" fill="#1D4ED8" />
  <ellipse cx="330" cy="510" rx="30" ry="12" fill="#7C3AED" />
  <ellipse cx="360" cy="530" rx="25" ry="10" fill="#0F172A" />

  <!-- Fallen hangers on the floor -->
  <polygon points="170,555 190,545 200,560" fill="none" stroke="#64748B" stroke-width="3" />
  <polygon points="260,560 280,550 290,565" fill="none" stroke="#64748B" stroke-width="3" />
</svg>`;

export const SAMPLE_ROOMS: SampleRoom[] = [
  {
    id: 'office',
    name: 'Home Office & Workstation',
    roomType: 'Home Office',
    description: 'Desk piled with paperwork, dual monitors with tangled cables, and overloaded bookshelf.',
    imageDataUrl: createSvgDataUrl(officeSvg),
  },
  {
    id: 'living',
    name: 'Family Living Room',
    roomType: 'Living Room',
    description: 'Coffee table covered with cups and remotes, scattered toys, rumpled throws, and shoe pile.',
    imageDataUrl: createSvgDataUrl(livingRoomSvg),
  },
  {
    id: 'closet',
    name: 'Overflowing Bedroom Closet',
    roomType: 'Walk-in Closet',
    description: 'Jammed clothing racks, top wire shelves sagging with bags, and shoes tumbled on the floor.',
    imageDataUrl: createSvgDataUrl(closetSvg),
  },
];
