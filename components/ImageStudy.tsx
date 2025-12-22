
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

const ImageStudy: React.FC<{ onEarnPoints: () => void }> = ({ onEarnPoints }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setIsProcessing(true);
    try {
      const base64 = image.split(',')[1];
      const mime = image.split(';')[0].split(':')[1];
      const edited = await geminiService.editStudyImage(prompt, base64, mime);
      if (edited) {
        setResultImage(edited);
        onEarnPoints();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">चित्र अध्ययन (Visual Study Helper)</h3>
        <p className="text-slate-500 mb-8">ऐतिहासिक मानचित्रों या दस्तावेजों को संपादित करें और गहराई से समझें।</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
              {image ? (
                <img src={image} className="w-full h-full object-cover" alt="Source" />
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <i className="fas fa-cloud-upload-alt text-slate-300 text-4xl mb-2"></i>
                  <span className="text-slate-400 text-sm">फोटो अपलोड करें</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              )}
            </div>
            {image && (
              <button onClick={() => setImage(null)} className="text-xs text-rose-500 font-bold uppercase hover:underline">हटाएं</button>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="जैसे: 'इस मानचित्र में ऐतिहासिक सिल्क रोड मार्ग को उजागर करें' या 'पृष्ठभूमि से आधुनिक इमारतों को हटाएं'"
              className="flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={handleEdit}
              disabled={!image || !prompt || isProcessing}
              className="bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {isProcessing ? 'संपादित हो रहा है...' : 'AI संपादन शुरू करें'}
            </button>
          </div>
        </div>
      </div>

      {resultImage && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-indigo-100 animate-fadeIn">
          <h4 className="font-bold text-slate-800 mb-4">AI द्वारा निर्मित परिणाम:</h4>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img src={resultImage} className="w-full" alt="Result" />
          </div>
          <a
            href={resultImage}
            download="study_image.png"
            className="mt-6 inline-flex items-center space-x-2 text-indigo-600 font-bold hover:underline"
          >
            <i className="fas fa-download"></i>
            <span>डाउनलोड करें</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageStudy;
