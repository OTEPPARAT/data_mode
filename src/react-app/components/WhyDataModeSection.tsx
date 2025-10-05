interface WhyDataModeSectionProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate?: (section: string) => void;
}

export default function WhyDataModeSection({ t, currentLang, onNavigate }: WhyDataModeSectionProps) {
  const features = [
    {
      image: 'https://mocha-cdn.com/01998f99-1572-710a-9671-ecb8ea19fbb2/9966.png',
      titleKey: 'why-feature-1-title'
    },
    {
      image: 'https://mocha-cdn.com/01998f99-1572-710a-9671-ecb8ea19fbb2/10.png',
      titleKey: 'why-feature-2-title'
    },
    {
      image: 'https://mocha-cdn.com/01998f99-1572-710a-9671-ecb8ea19fbb2/11.png',
      titleKey: 'why-feature-3-title'
    },
    {
      image: 'https://mocha-cdn.com/01998f99-1572-710a-9671-ecb8ea19fbb2/12.png',
      titleKey: 'why-feature-4-title'
    }
  ];

  return (
    <div className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          
          <h2 className="text-4xl lg:text-5xl font-thin mb-6 text-white leading-loose py-2">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {t('why-title')}
            </span>
          </h2>
          <p className="text-xl text-gray-400 font-thin leading-relaxed max-w-4xl mx-auto mb-8 pt-2">
            {t('why-subtitle')}
          </p>
          <p className="text-gray-400 font-thin leading-relaxed max-w-5xl mx-auto pt-1" style={{ fontSize: '0.9rem' }}>
            {t('why-description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              {/* Feature Card */}
              <div className={`p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 
                hover:border-cyan-500/50 transition-all duration-500 text-center
                shadow-lg shadow-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/40
                animate-float-card hover:scale-105
                ${index === 0 ? 'card-float-1' : index === 1 ? 'card-float-2' : index === 2 ? 'card-float-3' : 'card-float-4'}`}>
                {/* Feature Image */}
                <div className="mb-8">
                  <img 
                    src={feature.image} 
                    alt={t(feature.titleKey)} 
                    className="w-56 h-56 mx-auto object-contain"
                  />
                </div>
                {/* Feature Title */}
                <h3 className="text-lg font-thin bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent leading-relaxed whitespace-pre-line opacity-80">
                  {t(feature.titleKey)}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-400 font-thin mb-6">
            {currentLang === 'th' 
              ? 'พร้อมที่จะยกระดับธุรกิจของคุณด้วย DATA MODE แล้วหรือยัง?'
              : 'Ready to elevate your business with DATA MODE?'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <button 
              onClick={() => onNavigate?.('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-lg saturate-150 text-white/80 font-thin rounded-full border border-white/20 hover:border-pink-400/40 hover:bg-white/20 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20"
            >
              {currentLang === 'th' ? 'เริ่มต้นเลย' : 'Get Started'}
            </button>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-lg saturate-150 border border-white/20 text-cyan-300/80 font-thin rounded-full hover:bg-white/15 hover:text-white hover:border-cyan-400/40 hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-cyan-500/40"
            >
              {currentLang === 'th' ? 'ติดต่อเราเลย' : 'Contact Us Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
