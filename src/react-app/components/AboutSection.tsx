import { Building2, Target, Users, Lightbulb } from 'lucide-react';

interface AboutSectionProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate?: (section: string) => void;
}

export default function AboutSection({ t, currentLang, onNavigate }: AboutSectionProps) {
  return (
    <div className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
            {t('about-title')}
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-4xl mx-auto">
            {t('about-subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Company Description */}
          <div className="space-y-8">
            <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <Building2 className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                  DATA MODE
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                {t('about-description')}
              </p>
            </div>

            {/* Mission Statement */}
            <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                  {t('about-mission-title')}
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                {t('about-mission-text')}
              </p>
            </div>
          </div>

          {/* Visual Elements */}
          <div className="relative">
            <div className="relative group">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-pink-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse"></div>
              
              {/* Logo container */}
              <div className="relative bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105 shadow-2xl">
                <div className="flex flex-col items-center space-y-6">
                  <img
                    src="https://mocha-cdn.com/01998f99-1572-710a-9671-ecb8ea19fbb2/Screenshot-2568-09-28-at-16.28.10.png"
                    alt="DATA MODE Logo"
                    className="w-52 h-52 object-contain rounded-2xl"
                  />
                  <div className="text-center">
                    <h3 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent mb-2">
                      DATA M❂DE
                    </h3>
                    <p className="text-gray-400">
                      {t('tagline')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Journey */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
            {currentLang === 'th' ? 'เส้นทางการเปลี่ยนแปลง' : 'Our Transformation Journey'}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Traditional Business */}
            <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-600">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-300">
                {currentLang === 'th' ? 'ธุรกิจดั้งเดิม' : 'Traditional Business'}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {currentLang === 'th' 
                  ? 'สื่อสารการตลาดและกิจกรรมทางการตลาดมากกว่า 30 ปี' 
                  : 'Marketing communications and events for over 30 years'
                }
              </p>
            </div>

            {/* Transformation Arrow */}
            <div className="flex items-center justify-center">
              <div className="text-4xl text-cyan-400">→</div>
            </div>

            {/* AI-Driven Future */}
            <div className="text-center p-6 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-xl border border-cyan-500/30">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-gray-300" />
              </div>
              <h4 className="text-xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                {currentLang === 'th' ? 'อนาคตด้วย AI' : 'AI-Driven Future'}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {currentLang === 'th' 
                  ? 'โครงการ Revolutia และ DATA MODE นำร่องการเปลี่ยนแปลง' 
                  : 'Revolutia initiative with DATA MODE as the pilot unit'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-400 mb-6">
            {currentLang === 'th' 
              ? 'พร้อมที่จะร่วมงานกับเราแล้วหรือยัง?'
              : 'Ready to work with us?'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <button 
              onClick={() => onNavigate?.('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-white/80 font-thin rounded-full backdrop-blur-md border-2 border-pink-500 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 shadow-lg shadow-pink-500/30 hover:bg-pink-500/10"
            >
              {currentLang === 'th' ? 'เริ่มต้นเลย' : 'Get Started'}
            </button>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="w-full sm:w-auto px-8 py-4 border-2 border-cyan-500/60 text-white font-thin rounded-full bg-gray-800/50 backdrop-blur-md hover:bg-cyan-500/30 hover:text-white hover:border-cyan-300 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-cyan-500/40"
            >
              {currentLang === 'th' ? 'ติดต่อเราเลย' : 'Contact Us Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
