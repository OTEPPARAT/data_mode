import { useState, useEffect } from 'react';
import Header from '@/react-app/components/Header';
import HeroSection from '@/react-app/components/HeroSection';
import ServicesSection from '@/react-app/components/ServicesSection';
import WorkflowSection from '@/react-app/components/WorkflowSection';
import CaseStudiesSection from '@/react-app/components/CaseStudiesSection';
import PackagesSection from '@/react-app/components/PackagesSection';
import FAQSection from '@/react-app/components/FAQSection';
import ContactSection from '@/react-app/components/ContactSection';
import VideoUploadSection from '@/react-app/components/VideoUploadSection';
import AboutSection from '@/react-app/components/AboutSection';
import WhyDataModeSection from '@/react-app/components/WhyDataModeSection';
import AdminDashboard from '@/react-app/components/AdminDashboard';
import OrderManagement from '@/react-app/components/OrderManagement';
import AuthSection from '@/react-app/components/AuthSection';
import MemberDashboard from '@/react-app/components/MemberDashboard';
import PackageSelection from '@/react-app/components/PackageSelection';
import ProjectDetailsForm from '@/react-app/components/ProjectDetailsForm';
import OrderSummary from '@/react-app/components/OrderSummary';
import PaymentProcess from '@/react-app/components/PaymentProcess';
import QuotationView from '@/react-app/components/QuotationView';
import { useTranslations } from '@/react-app/hooks/useTranslations';

export default function Home() {
  const [activeSection, setActiveSection] = useState(() => {
    // Check URL parameters for direct navigation to admin
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    return section || 'home';
  });
  const { currentLang, setCurrentLang, t, translations } = useTranslations();

  useEffect(() => {
    const font = document.createElement('link');
    font.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap';
    font.rel = 'stylesheet';
    document.head.appendChild(font);
    
    return () => {
      document.head.removeChild(font);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-['Poppins'] relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <Header 
        activeSection={activeSection}
        currentLang={currentLang}
        onSectionChange={setActiveSection}
        onLanguageChange={setCurrentLang}
        translations={translations}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {activeSection === 'home' && <HeroSection onNavigate={setActiveSection} t={t} currentLang={currentLang} />}
        {activeSection === 'about' && <AboutSection t={t} currentLang={currentLang} onNavigate={setActiveSection} />}
        {activeSection === 'why' && <WhyDataModeSection t={t} currentLang={currentLang} onNavigate={setActiveSection} />}
        {activeSection === 'services' && <ServicesSection t={t} currentLang={currentLang} onNavigate={setActiveSection} />}
        {activeSection === 'workflow' && <WorkflowSection t={t} currentLang={currentLang} onNavigate={setActiveSection} />}
        {activeSection === 'cases' && <CaseStudiesSection t={t} currentLang={currentLang} onNavigate={setActiveSection} />}
        {activeSection === 'packages' && <PackagesSection t={t} currentLang={currentLang} onNavigate={setActiveSection} />}
        {activeSection === 'faq' && <FAQSection t={t} currentLang={currentLang} onNavigate={setActiveSection} />}
        {activeSection === 'videos' && <VideoUploadSection t={t} />}
        {activeSection === 'admin' && <AdminDashboard />}
        {activeSection === 'order-management' && <OrderManagement />}
        {activeSection === 'contact' && <ContactSection t={t} />}
        {activeSection === 'signup' && <AuthSection t={t} currentLang={currentLang} onNavigate={setActiveSection} />}
        {activeSection === 'dashboard' && <MemberDashboard t={t} currentLang={currentLang} onNavigate={setActiveSection} />}
        {activeSection === 'package-selection' && <PackageSelection t={t} currentLang={currentLang} onNavigate={setActiveSection} />}
        {activeSection === 'project-details' && <ProjectDetailsForm t={t} currentLang={currentLang} onNavigate={setActiveSection} onNext={() => setActiveSection('order-summary')} />}
        {activeSection === 'order-summary' && <OrderSummary t={t} currentLang={currentLang} onNavigate={setActiveSection} onNext={() => setActiveSection('payment')} />}
        {activeSection === 'payment' && <PaymentProcess t={t} currentLang={currentLang} onNavigate={setActiveSection} />}
        
        {activeSection === 'quotation' && <QuotationView t={t} currentLang={currentLang} onNavigate={setActiveSection} orderData={JSON.parse(localStorage.getItem('currentOrderData') || '{}')} />}
      </main>
    </div>
  );
}
