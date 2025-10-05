import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQSectionProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate?: (section: string) => void;
}

export default function FAQSection({ t, currentLang, onNavigate }: FAQSectionProps) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: 'faq1',
      question: 'Super AI Agent แตกต่างจาก AI ทั่วไปอย่างไร?',
      answer: 'Super AI Agent ของเราได้รับการฝึกฝนและปรับแต่งพิเศษสำหรับการค้นหาและวิเคราะห์ข้อมูลเฉพาะทาง สามารถเข้าถึงฐานข้อมูลเฉพาะทางที่ AI ทั่วไปเข้าถึงไม่ได้ มีความสามารถในการวิเคราะห์ความสัมพันธ์ของข้อมูลที่ซับซ้อน และมีการตรวจสอบความถูกต้องของข้อมูลโดยผู้เชี่ยวชาญ',
      questionEn: 'How is a Super AI Agent different from general AI?',
      answerEn: 'Our Super AI Agent is specially trained and customized for specialized data discovery and analysis. It can access niche databases that general AI cannot, has the ability to analyze complex data relationships, and all results are verified by domain experts.'
    },
    {
      id: 'faq2',
      question: 'ข้อมูลของบริษัทฉันจะปลอดภัยหรือไม่?',
      answer: 'เรายึดมั่นในมาตรฐานความปลอดภัยข้อมูลสูงสุด ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัยและเป็นความลับ เราไม่นำข้อมูลของลูกค้าไปใช้เพื่อวัตถุประสงค์อื่นนอกเหนือจากที่ได้รับอนุญาต และเรามีการลงนามในข้อตกลงการไม่เปิดเผยข้อมูล (NDA) กับลูกค้าทุกราย',
      questionEn: 'Is my company\'s data secure?',
      answerEn: 'We adhere to the highest data security standards. Your data is stored securely and confidentially. We do not use client data for any unauthorized purposes, and we sign a Non-Disclosure Agreement (NDA) with every client.'
    },
    {
      id: 'faq3',
      question: 'ใช้เวลานานเท่าไรในการได้รับผลลัพธ์?',
      answer: 'ระยะเวลาขึ้นอยู่กับความซับซ้อนของโจทย์และขอบเขตของข้อมูลที่ต้องการ โดยทั่วไปบริการของเราใช้เวลา 2-6 สัปดาห์ ขึ้นอยู่กับประเภทของบริการ อย่างไรก็ตาม เรามักส่งมอบผลลัพธ์ได้เร็วกว่าการค้นคว้าแบบดั้งเดิมถึง 300%',
      questionEn: 'How long does it take to get results?',
      answerEn: 'The duration depends on the complexity of the task and the data scope. Generally, our services take 2-6 weeks depending on the service type. However, we typically deliver results up to 300% faster than traditional research methods.'
    },
    {
      id: 'faq4',
      question: 'Super AI Agent สามารถค้นหาข้อมูลจากแหล่งข้อมูลใดได้บ้าง?',
      answer: 'Super AI Agent ของเราสามารถค้นหาข้อมูลจากแหล่งข้อมูลหลากหลายประเภท รวมถึงฐานข้อมูลเปิด ฐานข้อมูลเชิงวิชาการ รายงานทางการเงิน บทวิเคราะห์อุตสาหกรรม บทความวิจัย ข่าวสารและสื่อ ข้อมูลจากหน่วยงานรัฐบาล และข้อมูลจากสื่อสังคมออนไลน์ โดยครอบคลุมหลากหลายภาษาและภูมิภาคทั่วโลก',
      questionEn: 'What data sources can the Super AI Agent search?',
      answerEn: 'Our Super AI Agent can search a wide variety of data sources, including open databases, academic databases, financial reports, industry analyses, research articles, news and media, government data, and social media data, covering various languages and regions worldwide.'
    },
    {
      id: 'faq5',
      question: 'ผลลัพธ์ที่ได้จะมีความน่าเชื่อถือแค่ไหน?',
      answer: 'เรามุ่งมั่นในการส่งมอบข้อมูลที่มีความถูกต้องและน่าเชื่อถือสูงสุด Super AI Agent ของเราใช้แหล่งข้อมูลที่น่าเชื่อถือ และผลลัพธ์ทั้งหมดจะผ่านการตรวจสอบโดยผู้เชี่ยวชาญในอุตสาหกรรมนั้นๆ ก่อนส่งมอบให้ลูกค้า เรายังให้ข้อมูลอ้างอิงที่ครบถ้วนเพื่อให้คุณสามารถตรวจสอบแหล่งที่มาของข้อมูลได้',
      questionEn: 'How reliable are the results?',
      answerEn: 'We are committed to delivering highly accurate and reliable data. Our Super AI Agent uses credible sources, and all results are reviewed by industry experts before delivery. We also provide complete references so you can verify the data sources.'
    },
    {
      id: 'faq6',
      question: 'DATA MODE มีบริการสำหรับธุรกิจขนาดเล็กหรือไม่?',
      answer: 'ใช่ เรามีบริการสำหรับธุรกิจทุกขนาด ตั้งแต่ธุรกิจขนาดเล็กไปจนถึงองค์กรขนาดใหญ่ เราสามารถปรับแต่งแพ็คเกจและบริการให้เหมาะสมกับขนาดและงบประมาณของธุรกิจคุณได้ Smart Researcher แพ็คเกจของเราเป็นจุดเริ่มต้นที่ดีสำหรับธุรกิจขนาดเล็กที่ต้องการข้อมูลเชิงลึกเพื่อการตัดสินใจ',
      questionEn: 'Does DATA MODE offer services for small businesses?',
      answerEn: 'Yes, we offer services for businesses of all sizes, from small enterprises to large corporations. We can customize packages and services to fit your business size and budget. Our Smart Researcher package is an excellent starting point for small businesses needing data-driven insights for decision-making.'
    }
  ];

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {t('faq-title')}
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            {t('faq-subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-gray-800/10 backdrop-blur-sm rounded-2xl border border-gray-700/10 overflow-hidden">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left p-6 flex items-center justify-between bg-gradient-to-b from-black/10 to-white/10 backdrop-blur-md border border-white/10 hover:bg-gradient-to-b hover:from-black/10 hover:to-white/10 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-r before:from-white/30 before:via-white/15 before:to-transparent before:mask-composite:exclude before:-z-10 after:content-[''] after:absolute after:top-0 after:left-1/6 after:w-2/3 after:h-1/3 after:bg-gradient-to-br after:from-white/45 after:to-transparent after:rounded-full after:blur-lg after:-translate-y-2 shadow-inner"
              >
                <span className="font-bold text-lg pr-4 text-black/80">{currentLang === 'th' ? faq.question : faq.questionEn}</span>
                {openFaq === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-black/60 drop-shadow-[0_0_8px_rgba(0,0,0,0.3)] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-black/60 drop-shadow-[0_0_8px_rgba(0,0,0,0.3)] flex-shrink-0" />
                )}
              </button>
              {openFaq === faq.id && (
                <div className="px-6 pb-6">
                  <p className="text-black/60 leading-relaxed">{currentLang === 'th' ? faq.answer : faq.answerEn}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-500 mb-6">
            {currentLang === 'th' 
              ? 'ยังมีคำถามอื่นๆ อีกหรือไม่?'
              : 'Still have more questions?'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <button 
              onClick={() => onNavigate?.('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-white/80 font-thin rounded-full backdrop-blur-md border-2 border-white/40 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 shadow-lg shadow-pink-500/30 hover:bg-pink-500/10"
            >
              {currentLang === 'th' ? 'เริ่มต้นเลย' : 'Get Started'}
            </button>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="w-full sm:w-auto px-8 py-4 border-2 border-white/40 text-white font-thin rounded-full bg-gray-800/50 backdrop-blur-md hover:bg-cyan-300/30 hover:text-white hover:border-cyan-200 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-cyan-300/40"
            >
              {currentLang === 'th' ? 'ติดต่อเราเลย' : 'Contact Us Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
