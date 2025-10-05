import { X } from 'lucide-react';

interface GlobeImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobeImageModal({ isOpen, onClose }: GlobeImageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-gray-900 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
            ค้นหาข้อมูลทั่วโลก
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-lg saturate-150 border border-white/20 hover:border-red-400/40 hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg shadow-black/20 hover:shadow-red-500/20"
          >
            <X className="w-5 h-5 text-gray-300 opacity-50" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Display */}
          <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
            <img
              src="https://mocha-cdn.com/01998f99-1572-710a-9671-ecb8ea19fbb2/Screenshot-2568-09-23-at-06.29.10.png"
              alt="Global Data Search - Golden Globe"
              className="w-full h-auto max-h-[60vh] object-contain"
            />
          </div>

          {/* Description */}
          <div className="mt-6 text-center">
            <p className="text-gray-300 leading-relaxed">
              Super AI Agent ของเราเข้าถึงและประมวลผลข้อมูลจากแหล่งข้อมูลทั่วโลกและฐานข้อมูลเฉพาะทาง 
              ที่มนุษย์ทั่วไปเข้าถึงได้ยาก ด้วยเทคโนโลยีที่ทันสมัยและการวิเคราะห์ที่แม่นยำ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
