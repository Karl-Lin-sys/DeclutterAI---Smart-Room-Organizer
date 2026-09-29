import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { SAMPLE_ROOMS, SampleRoom } from '../data/sampleRooms';

interface ImageUploaderProps {
  onAnalyze: (image: string, mimeType: string, roomType: string, goal: string) => Promise<void>;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalyze, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [roomType, setRoomType] = useState<string>('Auto-Detect Room');
  const [goal, setGoal] = useState<string>('Balanced Functional Organization');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Image size is too large (maximum 20MB). Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setSelectedImage(e.target.result);
        setSelectedMimeType(file.type || 'image/jpeg');
        setActiveSampleId(null);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleRoom) => {
    setSelectedImage(sample.imageDataUrl);
    setSelectedMimeType('image/svg+xml');
    setRoomType(sample.roomType);
    setActiveSampleId(sample.id);
    setUploadError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      setUploadError('Please upload a photo of your room or pick a sample preset.');
      return;
    }
    setUploadError(null);
    await onAnalyze(selectedImage, selectedMimeType, roomType, goal);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title & Value proposition */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display mb-3">
          AI Room Decluttering & Organization
        </h1>
        <p className="text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Upload a photo of your cluttered desk, messy closet, or living room. Powered by
          <span className="font-semibold text-neutral-900"> Gemini 3.1 Pro</span>, we identify clutter hotspots,
          generate a custom 3-phase action plan, and recommend sustainable storage systems.
        </p>
      </div>

      {uploadError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-sm text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Main Upload Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropzone or Image Preview */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              Room Photograph
            </label>

            {!selectedImage ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-neutral-900 bg-neutral-100'
                    : 'border-neutral-300 hover:border-neutral-500 bg-neutral-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />

                <div className="mx-auto w-14 h-14 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 mb-4 shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-base font-medium text-neutral-900 mb-1">
                  Drag and drop your room photo here, or browse
                </p>
                <p className="text-xs text-neutral-500 mb-3">
                  Supports JPEG, PNG, WEBP (camera photos or screenshots up to 20MB)
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-neutral-200 text-xs font-medium text-neutral-800 shadow-2xs">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Select File from Computer / Phone
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900">
                <img
                  src={selectedImage}
                  alt="Room to analyze"
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[380px] object-contain mx-auto"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setActiveSampleId(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-900 text-white text-xs font-medium backdrop-blur-sm border border-white/20 transition-colors shadow-sm"
                  >
                    Replace Image
                  </button>
                </div>
                {activeSampleId && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-black/70 text-white text-xs font-medium backdrop-blur-xs">
                    Sample Room: {SAMPLE_ROOMS.find((s) => s.id === activeSampleId)?.name}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preset Sample Rooms for Quick 1-Click Evaluation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Or test instantly with a sample messy space:
              </span>
              <span className="text-xs text-neutral-400">1-click preview</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_ROOMS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    activeSampleId === sample.id
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                      : 'border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 text-neutral-800'
                  }`}
                >
                  <div className="mb-2">
                    <p className={`text-xs font-bold font-display ${activeSampleId === sample.id ? 'text-white' : 'text-neutral-900'}`}>
                      {sample.name}
                    </p>
                    <p className={`text-[11px] line-clamp-2 mt-1 ${activeSampleId === sample.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {sample.description}
                    </p>
                  </div>
                  <div className={`text-[11px] font-medium flex items-center gap-1 ${activeSampleId === sample.id ? 'text-amber-300' : 'text-neutral-600'}`}>
                    Use this room photo &rarr;
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Room Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
              >
                <option value="Auto-Detect Room">Auto-Detect from Photo</option>
                <option value="Home Office">Home Office & Desk</option>
                <option value="Living Room">Living Room & Lounge</option>
                <option value="Walk-in Closet">Walk-in Closet / Wardrobe</option>
                <option value="Kitchen & Pantry">Kitchen & Pantry</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Garage / Storage Room">Garage & Storage Room</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Organization Priority
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
              >
                <option value="Balanced Functional Organization">Balanced Functional Organization</option>
                <option value="Ruthless Minimalism & Purging">Ruthless Minimalism (Purge & Reset)</option>
                <option value="Quick 15-Minute Blitz">Speed Blitz (Fastest Visual Wins)</option>
                <option value="Budget-Friendly / Zero-Cost Repurposing">Budget-Friendly DIY Storage</option>
                <option value="Ergonomic Workstation & Cable Management">Ergonomics & Tech Management</option>
              </select>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !selectedImage}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                isLoading || !selectedImage
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm hover:shadow active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Gemini 3.1 Pro Analyzing Room Spatial Dynamics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Analyze Room Photo with Gemini 3.1 Pro</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-neutral-400 mt-2">
              Analyzed via Gemini 3.1 Pro multimodal vision · Fast, private, and secure
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
