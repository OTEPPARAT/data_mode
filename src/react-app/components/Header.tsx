import { useState } from 'react';
import { Menu, X, Video, Settings, RefreshCw } from 'lucide-react';
interface HeaderProps {
  activeSection: string;
  currentLang: 'th' | 'en';
  onSectionChange: (section: string) => void;
  onLanguageChange: (lang: 'th' | 'en') => void;
  translations: Record<'th' | 'en', Record<string, string>>;
}
export default function Header({
  activeSection,
  currentLang,
  onSectionChange,
  onLanguageChange,
  translations
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = (key: string): string => {
    return translations[currentLang][key] || key;
  };
  const navigation = ['home', 'about', 'why', 'services', 'workflow', 'cases', 'packages', 'faq', 'videos', 'admin', 'order-management', 'contact', 'signup', 'dashboard'];
  
  // Filter out admin-only sections from public navigation
  const publicNavigation = navigation.filter(section => 
    !['videos', 'admin', 'order-management'].includes(section)
  );
  const switchSection = (section: string) => {
    onSectionChange(section);
    setMobileMenuOpen(false);
  };
  return <div className="sticky top-0 z-50">
      <header className="bg-black border-b border-gray-800">
        <div className="w-full px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <button onClick={() => switchSection('home')} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              {/* Logo */}
              <div className="w-10 h-10 md:w-16 md:h-16 flex-shrink-0">
                <img src="https://mocha-cdn.com/01998f99-1572-710a-9671-ecb8ea19fbb2/Screenshot-2568-09-28-at-16.28.10.png" alt="DATA MODE Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              {/* Brand Text - Always visible but responsive size */}
              <div className="min-w-0 flex-1">
                <h1 className="text-sm md:text-lg lg:text-xl xl:text-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent leading-tight data-mode-logo" style={{ fontFamily: '"Poppins", sans-serif' }}>DATA M❂DE</h1>
                <p className="text-xs md:text-sm text-gray-400 leading-tight hidden sm:block">
                  {t('tagline')}
                </p>
              </div>
            </button>

            {/* Desktop Navigation - Show on medium screens and up */}
            <nav className="hidden md:flex items-center flex-1 justify-center mx-4 overflow-x-auto">
              <div className="flex items-center space-x-1 min-w-max px-2">
                {publicNavigation.map(section => <button key={section} onClick={() => {
                console.log(`🔄 Switching to section: ${section}`);
                switchSection(section);
              }} className={`px-3 py-2 rounded-lg text-xs transition-all duration-300 flex items-center gap-1 whitespace-nowrap min-w-fit backdrop-blur-lg saturate-150 transform hover:scale-105 hover:-translate-y-1 ${activeSection === section ? 'bg-black text-gray-300 shadow-lg shadow-white/40' : 'text-gray-300 hover:text-gray-300 bg-black hover:bg-black shadow-lg shadow-white/30 hover:shadow-white/50'}`}>
                    {section === 'videos' && <Video size={12} className="opacity-50" />}
                    {section === 'admin' && <Settings size={12} className="opacity-50" />}
                    <span className="text-xs">
                      {t(`nav-${section}`)}
                    </span>
                  </button>)}
              </div>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Logout Button - Show if user is logged in */}
              {localStorage.getItem('isLoggedIn') === 'true' && (
                <button
                  onClick={() => {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('isLoggedIn');
                    switchSection('home');
                    alert('ออกจากระบบเรียบร้อยแล้ว');
                  }}
                  className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-400/40 text-red-300 text-xs transition-all duration-300"
                  title="ออกจากระบบ"
                >
                  ออกจากระบบ
                </button>
              )}
              {/* System Update Button - Only show for admin */}
              {activeSection === 'admin' && <button onClick={() => {
              window.location.reload();
            }} className="p-2 rounded-lg bg-green-600 hover:bg-green-700 border border-green-500 transition-all duration-300 text-gray-300" title="อัพเดทระบบทั้งหมด">
                  <RefreshCw className="w-4 h-4 opacity-50" />
                </button>}
              
              {/* Language Switcher */}
              <div className="flex space-x-1">
                <button onClick={() => onLanguageChange('th')} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 backdrop-blur-lg saturate-150 ${currentLang === 'th' ? 'bg-white/40 text-gray-300 border border-white/20 shadow-lg shadow-white/20' : 'bg-black text-gray-300 hover:bg-black/80 hover:text-gray-300 border border-white/10 hover:border-cyan-400/40 shadow-lg shadow-white/20'}`}>
                  TH
                </button>
                <button onClick={() => onLanguageChange('en')} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 backdrop-blur-lg saturate-150 ${currentLang === 'en' ? 'bg-white/40 text-gray-300 border border-white/20 shadow-lg shadow-white/20' : 'bg-black text-gray-300 hover:bg-black/80 hover:text-gray-300 border border-white/10 hover:border-cyan-400/40 shadow-lg shadow-white/20'}`}>
                  EN
                </button>
              </div>

              {/* Mobile Menu Button - Show on mobile only */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-3 rounded-lg bg-white/10 backdrop-blur-lg saturate-150 border border-white/20 hover:bg-white/20 hover:border-cyan-400/40 transition-all duration-300 text-gray-300 shadow-lg shadow-black/20 hover:shadow-cyan-500/20">
                {mobileMenuOpen ? <X className="w-6 h-6 opacity-50" /> : <Menu className="w-6 h-6 opacity-50" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay with Backdrop */}
      {mobileMenuOpen && <>
          {/* Backdrop */}
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)} />
          
          {/* Mobile Menu */}
          <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-700 shadow-2xl max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-cyan-400">
                {currentLang === 'th' ? 'เมนูหลัก' : 'Main Menu'}
              </h3>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-white/10 backdrop-blur-lg saturate-150 border border-white/20 hover:bg-white/20 hover:border-cyan-400/40 transition-all duration-300 text-gray-300 shadow-lg shadow-black/20 hover:shadow-cyan-500/20">
                <X className="w-5 h-5 opacity-50" />
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="px-4 py-4 space-y-2 max-h-96 overflow-y-auto">
              {publicNavigation.map(section => <button key={section} onClick={() => switchSection(section)} className={`w-full text-left px-4 py-4 rounded-lg transition-all duration-300 flex items-center gap-3 text-base font-medium touch-manipulation backdrop-blur-lg saturate-150 transform hover:scale-105 hover:-translate-y-1 ${activeSection === section ? 'bg-black text-gray-300 shadow-lg shadow-white/40' : 'text-gray-300 hover:text-gray-300 bg-black hover:bg-black shadow-lg shadow-white/30 hover:shadow-white/50'}`}>
                  {section === 'videos' && <Video size={20} className="opacity-50" />}
                  {section === 'admin' && <Settings size={20} className="opacity-50" />}
                  <span>{t(`nav-${section}`)}</span>
                </button>)}
            </nav>
            
            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-700 bg-gray-900/50">
              <button onClick={() => setMobileMenuOpen(false)} className="w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-lg saturate-150 border border-white/10 text-red-300/80 font-thin hover:bg-white/10 hover:text-white hover:border-red-400/40 transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation shadow-lg shadow-black/20 hover:shadow-red-500/20">
                <X size={18} className="opacity-50" />
                {currentLang === 'th' ? 'ปิดเมนู' : 'Close Menu'}
              </button>
            </div>
          </div>
        </>}
    </div>;
}
