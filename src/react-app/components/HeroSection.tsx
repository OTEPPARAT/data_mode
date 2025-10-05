import { Globe, BarChart3, FileText, Download } from 'lucide-react';
import { useState } from 'react';
import BrochureModal from './BrochureModal';
import GlobeImageModal from './GlobeImageModal';
import VideoSection from './VideoSection';
interface HeroSectionProps {
  onNavigate: (section: string) => void;
  t: (key: string) => string;
  currentLang: 'th' | 'en';
}
export default function HeroSection({
  onNavigate,
  t,
  currentLang
}: HeroSectionProps) {
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [isGlobeImageModalOpen, setIsGlobeImageModalOpen] = useState(false);
  return <div className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          {/* Background circles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-cyan-500/7 to-purple-500/7 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-br from-pink-500/7 to-blue-500/7 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-br from-indigo-500/3.5 to-cyan-500/3.5 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          {/* Hero Image - Moved to top */}
          <div className="relative z-10 flex justify-center mb-12">
            <div className="relative group">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/14 via-purple-500/14 to-pink-500/14 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse"></div>
              
              {/* 3D Hexagonal Box Container */}
              <div className="hexagonal-3d-container">
                {/* Multiple Blue Hexagons in different planes around logo center */}
                <div className="hexagon-face hexagon-sphere-main">
                  <div className="hexagon-pattern"></div>
                </div>
                
                <div className="hexagon-face hexagon-sphere-orbit2">
                  <div className="hexagon-pattern"></div>
                </div>
                
                <div className="hexagon-face hexagon-sphere-orbit3">
                  <div className="hexagon-pattern"></div>
                </div>
                
                <div className="hexagon-face hexagon-sphere-orbit4">
                  <div className="hexagon-pattern"></div>
                </div>
                
                <div className="hexagon-face hexagon-sphere-orbit5">
                  <div className="hexagon-pattern"></div>
                </div>
                
                <div className="hexagon-face hexagon-sphere-orbit6">
                  <div className="hexagon-pattern"></div>
                </div>
                
                <div className="hexagon-face hexagon-sphere-orbit7">
                  <div className="hexagon-pattern"></div>
                </div>
                
                <div className="hexagon-face hexagon-sphere-orbit8">
                  <div className="hexagon-pattern"></div>
                </div>
                
                {/* Logo inside the hexagonal box */}
                <img src="https://mocha-cdn.com/01998f99-1572-710a-9671-ecb8ea19fbb2/458.png" alt="DATA MODE - Super AI Agent" className="w-[210px] h-[210px] xs:w-[270px] xs:h-[270px] sm:w-[330px] sm:h-[330px] md:w-[435px] md:h-[435px] lg:w-[548px] lg:h-[548px] object-contain logo-in-box relative z-20" />
              </div>
            </div>
          </div>

          {/* Hero Content - Text centered below image */}
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl mb-8 leading-relaxed relative z-10">
              <div className="text-gray-300 mb-6 space-y-2 font-thin">
                <div className="mb-2">{t('home-hero-title-line1')}</div>
                <div className="mb-2">{t('home-hero-title-line2')}</div>
                <div className="mb-2">{t('home-hero-title-line3')}</div>
              </div>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent text-shadow-lg font-thin">
                {t('home-hero-super')}
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed relative z-10 max-w-3xl mx-auto">
              {t('home-hero-subtitle')}
            </p>
            <div className="flex flex-col gap-4 justify-center relative z-10 max-w-md mx-auto">
              <button onClick={() => onNavigate('services')} className="w-full px-6 py-3 bg-white/10 backdrop-blur-lg saturate-150 text-white font-thin rounded-full border border-white/20 hover:border-cyan-400/40 hover:bg-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl shadow-black/30 hover:shadow-cyan-500/50">
                {t('home-btn-services')}
              </button>
              <button onClick={() => setIsBrochureModalOpen(true)} className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-lg saturate-150 text-white font-thin rounded-full border border-white/20 hover:border-cyan-400/40 hover:bg-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl shadow-black/30 hover:shadow-cyan-500/50">
                <Download className="w-4 h-4 opacity-60" />
                <span>{t('home-btn-brochure')}</span>
              </button>
              <button onClick={() => onNavigate('contact')} className="w-full px-6 py-3 border border-white/20 text-gray-100 font-thin rounded-full bg-white/5 backdrop-blur-lg saturate-150 hover:bg-white/15 hover:text-gray-100 hover:border-cyan-400/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-cyan-500/40">
                {t('home-btn-contact')}
              </button>
            </div>
          </div>
          
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div onClick={() => setIsGlobeImageModalOpen(true)} className="group p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-lg saturate-150 border border-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20 group-hover:shadow-cyan-500/30">
              <Globe className="w-8 h-8 text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-50" />
            </div>
            <h3 className="text-xl font-thin mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {t('feature-title-1')}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {t('feature-text-1')}
            </p>
          </div>

          <div className="group p-6 bg-gray-600/30 backdrop-blur-xl saturate-150 rounded-3xl border border-gray-500/40 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer hover:bg-gray-500/40">
            <div className="w-14 h-14 bg-white/15 backdrop-blur-lg saturate-150 border border-white/25 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20 group-hover:shadow-purple-500/30">
              <BarChart3 className="w-7 h-7 text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-50" />
            </div>
            <h3 className="text-xl font-thin mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {t('feature-title-2')}
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {t('feature-text-2')}
            </p>
          </div>

          <div className="group p-6 bg-gray-600/30 backdrop-blur-xl saturate-150 rounded-3xl border border-gray-500/40 hover:border-pink-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20 cursor-pointer hover:bg-gray-500/40">
            <div className="w-14 h-14 bg-white/15 backdrop-blur-lg saturate-150 border border-white/25 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20 group-hover:shadow-pink-500/30">
              <FileText className="w-7 h-7 text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-50" />
            </div>
            <h3 className="text-xl font-thin mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {t('feature-title-3')}
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {t('feature-text-3')}
            </p>
          </div>
        </div>

        {/* Video Section */}
        <VideoSection targetVideoTitle="TEST1 EX" t={t} currentLang={currentLang} />

        {/* Technology Section */}
        <div className="py-16 mt-16">
          <h2 className="text-4xl font-thin mb-12 text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent leading-relaxed py-4">
            {t('tech-title')}
          </h2>
          <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h3 className="text-2xl font-thin mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent leading-relaxed py-2">
                  {t('tech-subtitle')}
                </h3>
                <p className="mb-4 text-gray-400" dangerouslySetInnerHTML={{
                __html: t('tech-description')
              }}>
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 mr-3 shadow-[0_0_8px_rgba(255,255,255,0.56)]"></div>
                    <span className="text-gray-400">{t('tech-feature-1')}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 shadow-[0_0_8px_rgba(255,255,255,0.56)]"></div>
                    <span className="text-gray-400">{t('tech-feature-2')}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                    <span className="text-gray-400">{t('tech-feature-3')}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                    <span className="text-gray-400">{t('tech-feature-4')}</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-2/5 relative">
                <div className="border-2 border-gray-600 rounded-lg p-6 bg-gray-900/50 backdrop-blur-sm">
                  <div className="text-center p-3 rounded-t-lg bg-gradient-to-r from-stone-200 to-stone-100 mb-4">
                    <h4 className="font-thin text-gray-800">{t('traditional-title')}</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-400 text-sm">{t('traditional-1')}</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-400 text-sm">{t('traditional-2')}</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-400 text-sm">{t('traditional-3')}</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-400 text-sm">{t('traditional-4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action at Bottom */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-700 p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-thin mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">พร้อมเริ่มโครงการของคุณแล้วหรือยัง?</h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed font-thin">สมัครสมาชิกวันนี้(ไม่มีค่าสมาชิก) แล้วเลือกบริการตามความต้องการของธุรกิจคุณ</p>
            <button onClick={() => onNavigate('signup')} className="px-8 py-4 bg-white/10 backdrop-blur-lg saturate-150 text-white/80 font-thin rounded-full border border-white/20 hover:border-pink-400/40 hover:bg-white/20 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20">
              เริ่มต้นเลย
            </button>
          </div>
        </div>
      </div>

      {/* Brochure Modal */}
      <BrochureModal isOpen={isBrochureModalOpen} onClose={() => setIsBrochureModalOpen(false)} />

      {/* Globe Image Modal */}
      <GlobeImageModal isOpen={isGlobeImageModalOpen} onClose={() => setIsGlobeImageModalOpen(false)} />
    </div>;
}
