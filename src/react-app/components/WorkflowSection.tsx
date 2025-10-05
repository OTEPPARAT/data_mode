import { Clipboard, Search, BarChart3, UserCheck, FileText } from 'lucide-react';

interface WorkflowSectionProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate?: (section: string) => void;
}

export default function WorkflowSection({ t, currentLang, onNavigate }: WorkflowSectionProps) {
  const steps = [
    {
      icon: Clipboard,
      title: '1. การรับโจทย์และกำหนดขอบเขต',
      description: 'เริ่มจากการประชุมกับทีมของคุณเพื่อเข้าใจความต้องการและกำหนดขอบเขตงาน Super AI Agent ของเราจะเรียนรู้โจทย์ธุรกิจของคุณอย่างลึกซึ้ง',
      titleEn: '1. Problem Definition & Scope',
      descriptionEn: 'We begin with a meeting with your team to understand your needs and define the project scope. Our Super AI Agent learns your business challenge in depth.'
    },
    {
      icon: Search,
      title: '2. การค้นหาและรวบรวมข้อมูล',
      description: 'Super AI Agent จะค้นหาและรวบรวมข้อมูลจากแหล่งข้อมูลทั่วโลก ทั้งฐานข้อมูลเปิด ฐานข้อมูลเฉพาะทาง รายงานวิจัย และแหล่งข้อมูลอื่นๆ',
      titleEn: '2. Data Discovery & Collection',
      descriptionEn: 'The Super AI Agent discovers and collects data from global sources, including open databases, specialized databases, research reports, and other sources.'
    },
    {
      icon: BarChart3,
      title: '3. การวิเคราะห์และประมวลผล',
      description: 'Super AI Agent วิเคราะห์ข้อมูลด้วยอัลกอริทึมขั้นสูง ค้นหาแนวโน้ม รูปแบบ และความสัมพันธ์ที่ซ่อนอยู่ และประมวลผลข้อมูลเพื่อตอบโจทย์ธุรกิจของคุณ',
      titleEn: '3. Analysis & Processing',
      descriptionEn: 'The Super AI Agent analyzes data with advanced algorithms, uncovering hidden trends, patterns, and relationships, and processes data to solve your business problem.'
    },
    {
      icon: UserCheck,
      title: '4. การตรวจสอบโดยผู้เชี่ยวชาญ',
      description: 'ผู้เชี่ยวชาญในอุตสาหกรรมของเราจะตรวจสอบผลลัพธ์จาก Super AI Agent เพื่อให้มั่นใจถึงความถูกต้อง ความน่าเชื่อถือ และประโยชน์ในการใช้งานจริง',
      titleEn: '4. Expert Review',
      descriptionEn: 'Our industry experts review the results from the Super AI Agent to ensure accuracy, reliability, and practical applicability.'
    },
    {
      icon: FileText,
      title: '5. การนำเสนอผลลัพธ์',
      description: 'ส่งมอบรายงานที่เข้าใจง่าย พร้อมการนำเสนอผลลัพธ์ ข้อเสนอแนะ และแนวทางการนำไปปฏิบัติ พร้อมให้คำปรึกษาเพิ่มเติมเพื่อให้คุณได้ประโยชน์สูงสุด',
      titleEn: '5. Results Presentation',
      descriptionEn: 'We deliver an easy-to-understand report, presenting the results, recommendations, and actionable steps. We also provide additional consultation to help you get the most out of it.'
    }
  ];

  return (
    <div className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {t('workflow-title')}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('workflow-subtitle')}
          </p>
        </div>

        <div className="relative space-y-20">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-1/2 top-24 transform -translate-x-1/2 w-0.5 h-20 bg-gradient-to-b from-cyan-400/30 via-blue-500/30 to-pink-500/30 z-0"></div>
              )}
              
              <div className={`flex flex-col md:flex-row items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} relative z-10`}>
                <div className={`md:w-1/2 mb-8 md:mb-0 ${index % 2 === 1 ? 'md:pl-8' : 'md:pr-8'}`}>
                  <div className="p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-500">
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                      {currentLang === 'th' ? step.title : step.titleEn}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {currentLang === 'th' ? step.description : step.descriptionEn}
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center relative">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-pink-500/30 shadow-xl group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-white/10">
                    <step.icon className="w-12 h-12 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] opacity-30" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-400 mb-6">
            {currentLang === 'th' 
              ? 'พร้อมเริ่มต้นใช้บริการ Super AI Agent แล้วหรือยัง?'
              : 'Ready to start using Super AI Agent services?'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <button 
              onClick={() => onNavigate?.('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-white/30 backdrop-blur-lg saturate-150 text-white/80 font-thin rounded-full border border-white/30 hover:border-pink-400/40 hover:bg-white/40 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20"
            >
              {currentLang === 'th' ? 'เริ่มต้นใช้งาน' : 'Get Started'}
            </button>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="w-full sm:w-auto px-8 py-4 bg-white/30 backdrop-blur-lg saturate-150 border border-white/30 text-white font-thin rounded-full hover:bg-white/40 hover:text-white hover:border-cyan-400/40 hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-cyan-500/40"
            >
              {currentLang === 'th' ? 'ติดต่อเราเลย' : 'Contact Us Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
