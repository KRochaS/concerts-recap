import React, { useState, useRef } from 'react';
import { ImagePlus, X } from 'lucide-react'; // Instale lucide-react para os ícones
import Image from 'next/image';

const TicketUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-2 flex gap-1 flex-col">
      <label className="">CONCERT TICKET</label>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative cursor-pointer group
          h-48 w-full rounded-2xl border-2 border-dashed
          flex flex-col items-center justify-center transition-all duration-300
          ${
            preview
              ? 'border-[#4b2dbb]/50'
              : 'border-white/10 hover:border-white/20 hover:bg-white/5'
          }
          bg-[#0a0b14] overflow-hidden
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {preview ? (
          <>
            <Image
              src={preview}
              alt="Ticket Preview"
              fill
              className="w-full h-full object-contain p-2"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-purple-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">
                Upload Ticket Stub
              </p>
              <p className="text-gray-500 text-xs tracking-widest uppercase mt-1">
                Digital or Physical Scan
              </p>
            </div>
          </div>
        )}

        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#05060b] rounded-full border-r border-white/10" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#05060b] rounded-full border-l border-white/10" />
      </div>
    </div>
  );
};

export default TicketUpload;
