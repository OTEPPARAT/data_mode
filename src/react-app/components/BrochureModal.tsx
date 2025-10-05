import { useState } from 'react';
import { X, Download } from 'lucide-react';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrochureModal({ isOpen, onClose }: BrochureModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const brochureImages = [
    {
      url: 'https://mocha-cdn.com/01998f99-1572-710a-9671-ecb8ea19fbb2/Screenshot-2568-09-28-at-16.01.54.png',
      title: 'DATA MODE Brochure - Page 1'
    }
  ];

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllPages = () => {
    brochureImages.forEach((image, index) => {
      setTimeout(() => {
        handleDownload(image.url, `DATA_MODE_Brochure_Page_${index + 1}.png`);
      }, index * 500);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-gray-900 rounded-2xl border border-gray-700 max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
            โบรชัว <span className="font-black">DATA MODE</span>
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadAllPages}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-lg saturate-150 text-white font-semibold rounded-lg border border-white/20 hover:border-cyan-400/40 hover:bg-white/20 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
            >
              <Download className="w-4 h-4 opacity-50" />
              <span>ดาวน์โหลดทั้งหมด</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-lg saturate-150 border border-white/20 hover:border-red-400/40 hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg shadow-black/20 hover:shadow-red-500/20"
            >
              <X className="w-5 h-5 text-gray-300 opacity-50" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Page Navigation */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {brochureImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-lg saturate-150 border transform hover:scale-105 ${
                  currentPage === index
                    ? 'bg-white/20 text-white border-white/40 shadow-xl shadow-cyan-500/40'
                    : 'bg-white/5 text-gray-300 border-white/20 hover:bg-white/15 hover:text-white hover:border-cyan-400/40 shadow-lg shadow-black/20 hover:shadow-cyan-500/20'
                }`}
              >
                หน้า {index + 1}
              </button>
            ))}
          </div>

          {/* Image Display */}
          <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
            <img
              src={brochureImages[currentPage].url}
              alt={brochureImages[currentPage].title}
              className="w-full h-auto max-h-[60vh] object-contain"
            />
            
            {/* Download Button Overlay */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => handleDownload(brochureImages[currentPage].url, `DATA_MODE_Brochure_Page_${currentPage + 1}.png`)}
                className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-lg saturate-150 text-white rounded-lg border border-white/20 hover:border-cyan-400/40 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-cyan-500/20"
              >
                <Download className="w-4 h-4 opacity-50" />
                <span className="text-sm">ดาวน์โหลด</span>
              </button>
            </div>
          </div>

          {/* Page Info */}
          <div className="text-center mt-4">
            <p className="text-gray-400">
              หน้า {currentPage + 1} จาก {brochureImages.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
