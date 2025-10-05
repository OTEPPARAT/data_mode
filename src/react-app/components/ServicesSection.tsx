import { useState } from 'react';
import { X, TrendingUp, Building2, Users, Eye, BarChart3, Activity } from 'lucide-react';

interface ServicesSectionProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate?: (section: string) => void;
}

export default function ServicesSection({ t, currentLang, onNavigate }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    {
      id: 'market-research',
      title: 'Market Research',
      icon: TrendingUp,
      description: 'การวิเคราะห์ตลาดเฉพาะทางพร้อมรายงานสรุปแนวโน้มตลาด คู่แข่ง และโอกาสทางธุรกิจ ด้วย Super AI Agent ที่วิเคราะห์ข้อมูลจากหลายแหล่ง',
      duration: 'ระยะเวลา: 2-3 วัน',
      price: 'เริ่มต้นที่ 25,000 บาท',
      descriptionEn: 'Specialized market analysis with market trends, competitors, and business opportunities reports. Our Super AI Agent analyzes data from multiple sources.',
      durationEn: 'Duration: 2-3 Days',
      priceEn: 'Starting from ฿25,000',
      detailsSteps: [
        'กำหนดกรอบวิจัยตลาดเฉพาะทาง',
        'เก็บข้อมูลจากหลายแหล่ง (ตลาด, คู่แข่ง, ลูกค้า)',
        'วิเคราะห์และสรุปโอกาสทางธุรกิจ',
        'ส่งรายงานฉบับสมบูรณ์ภายใน 2–3 วัน'
      ],
      detailsResults: [
        'เข้าใจตลาดเป้าหมายชัดเจน',
        'ลดความเสี่ยงก่อนลงทุนหรือออกสินค้าใหม่'
      ],
      detailsStepsEn: [
        'Define specialized market research framework',
        'Collect data from multiple sources (market, competitors, customers)',
        'Analyze and summarize business opportunities',
        'Deliver complete report within 2-3 days'
      ],
      detailsResultsEn: [
        'Clear understanding of target market',
        'Reduce risks before investment or new product launch'
      ]
    },
    {
      id: 'industry-analysis',
      title: 'Industry Analysis',
      icon: Building2,
      description: 'การวิเคราะห์อุตสาหกรรมเชิงลึกพร้อมข้อมูลสถิติ แนวโน้ม และปัจจัยที่มีผลต่อการเติบโต โดย Super AI Agent ที่เชี่ยวชาญด้านการวิเคราะห์อุตสาหกรรม',
      duration: 'ระยะเวลา: 4-9 วัน',
      price: 'เริ่มต้นที่ 35,000 บาท',
      descriptionEn: 'In-depth industry analysis with statistics, trends, and growth factors. Our Super AI Agent specializes in industry analysis.',
      durationEn: 'Duration: 4-9 Days',
      priceEn: 'Starting from ฿35,000',
      detailsSteps: [
        'วิเคราะห์ข้อมูลเชิงสถิติของอุตสาหกรรม',
        'ประเมินแนวโน้มและปัจจัยที่มีผลต่อการเติบโต',
        'ให้ข้อเสนอเชิงกลยุทธ์สำหรับธุรกิจในอุตสาหกรรม'
      ],
      detailsResults: [
        'มองเห็นทิศทางและความเสี่ยงของอุตสาหกรรม',
        'ใช้ในการวางแผนระยะยาว'
      ],
      detailsStepsEn: [
        'Analyze industry statistical data',
        'Assess trends and growth factors',
        'Provide strategic recommendations for industry businesses'
      ],
      detailsResultsEn: [
        'See industry direction and risks clearly',
        'Use for long-term planning'
      ]
    },
    {
      id: 'competitor-intelligence',
      title: 'Competitor Intelligence',
      icon: Eye,
      description: 'การวิเคราะห์คู่แข่งแบบเจาะลึกพร้อมกลยุทธ์ จุดแข็ง จุดอ่อน และส่วนแบ่งตลาด ด้วย Super AI Agent ที่ติดตามความเคลื่อนไหวของคู่แข่ง',
      duration: 'ระยะเวลา: 3-5 วัน',
      price: 'เริ่มต้นที่ 30,000 บาท',
      descriptionEn: 'In-depth competitor analysis with strategies, strengths, weaknesses, and market share. Our Super AI Agent monitors competitor movements.',
      durationEn: 'Duration: 3-5 Days',
      priceEn: 'Starting from ฿30,000',
      detailsSteps: [
        'วิเคราะห์คู่แข่งเชิงลึก (จุดแข็ง, จุดอ่อน, ส่วนแบ่งตลาด)',
        'AI ติดตามการเปลี่ยนแปลงและพฤติกรรมการแข่งขัน',
        'จัดทำรายงานเชิงกลยุทธ์'
      ],
      detailsResults: [
        'ข้อมูลเปรียบเทียบคู่แข่งครบถ้วน',
        'มีข้อมูลช่วยกำหนดกลยุทธ์ชนะคู่แข่ง'
      ],
      detailsStepsEn: [
        'In-depth competitor analysis (strengths, weaknesses, market share)',
        'AI tracks competitive changes and behaviors',
        'Create strategic reports'
      ],
      detailsResultsEn: [
        'Complete competitor comparison data',
        'Strategic insights to outperform competitors'
      ]
    },
    {
      id: 'consumer-insights',
      title: 'Consumer Insights',
      icon: Users,
      description: 'การวิจัยพฤติกรรมผู้บริโภคและความต้องการของตลาดเป้าหมายพร้อมข้อเสนอแนะ ด้วย Super AI Agent ที่วิเคราะห์พฤติกรรมผู้บริโภคจากหลากหลายแหล่งข้อมูล',
      duration: 'ระยะเวลา: 4-9 วัน',
      price: 'เริ่มต้นที่ 28,000 บาท',
      descriptionEn: 'Consumer behavior and target market needs research with recommendations. Our Super AI Agent analyzes consumer behavior from various data sources.',
      durationEn: 'Duration: 4-9 Days',
      priceEn: 'Starting from ฿28,000',
      detailsSteps: [
        'รวบรวมข้อมูลพฤติกรรมผู้บริโภคจากหลายแหล่ง (ออนไลน์–ออฟไลน์)',
        'วิเคราะห์ความต้องการ/ความคาดหวังของลูกค้า',
        'สรุปเป็นข้อเสนอแนะเพื่อวางกลยุทธ์การตลาด'
      ],
      detailsResults: [
        'เข้าใจลูกค้าลึกกว่าข้อมูลทั่วไป',
        'ใช้ในการออกแบบสินค้า/บริการได้ตรงใจ'
      ],
      detailsStepsEn: [
        'Collect consumer behavior data from multiple sources (online-offline)',
        'Analyze customer needs and expectations',
        'Summarize recommendations for marketing strategies'
      ],
      detailsResultsEn: [
        'Understand customers deeper than general data',
        'Design products/services that truly resonate'
      ]
    },
    {
      id: 'data-analytics',
      title: 'Data Analytics',
      icon: BarChart3,
      description: 'การวิเคราะห์ข้อมูลเชิงลึกพร้อมการนำเสนอในรูปแบบ Dashboard ที่เข้าใจง่าย โดย Super AI Agent ที่มีความสามารถในการประมวลผลข้อมูลขนาดใหญ่',
      duration: 'ระยะเวลา: 1-7 วัน',
      price: 'เริ่มต้นที่ 40,000 บาท',
      descriptionEn: 'In-depth data analysis with easy-to-understand dashboard presentations. Our Super AI Agent is capable of processing large-scale data.',
      durationEn: 'Duration: 1-7 Days',
      priceEn: 'Starting from ฿40,000',
      detailsSteps: [
        'ดึงและประมวลผลข้อมูลดิบขนาดใหญ่ (เช่น ยอดขาย, CRM, โซเชียลมีเดีย)',
        'ทำความสะอาด/จัดโครงสร้างข้อมูล',
        'วิเคราะห์เชิงลึกและสร้าง Dashboard อินเทอร์แอคทีฟ',
        'ส่งรายงานเชิงสรุปที่เข้าใจง่าย'
      ],
      detailsResults: [
        'เห็นภาพรวมธุรกิจแบบเรียลไทม์',
        'มีข้อมูลพร้อมตัดสินใจทันที'
      ],
      detailsStepsEn: [
        'Extract and process large raw data (sales, CRM, social media)',
        'Clean and structure data',
        'Deep analysis and create interactive dashboards',
        'Deliver easy-to-understand summary reports'
      ],
      detailsResultsEn: [
        'See real-time business overview',
        'Data-ready for immediate decisions'
      ]
    },
    {
      id: 'trend-monitoring',
      title: 'Trend Monitoring',
      icon: Activity,
      description: 'บริการติดตามแนวโน้มตลาดและอุตสาหกรรมแบบต่อเนื่องพร้อมรายงานประจำเดือน ด้วย Super AI Agent ที่คอยติดตามแนวโน้มและการเปลี่ยนแปลงแบบเรียลไทม์',
      duration: 'ระยะเวลา: 2-3 วัน (รายเดือน)',
      price: '30,000 บาท/เดือน',
      descriptionEn: 'Continuous market and industry trend monitoring service with monthly reports. Our Super AI Agent tracks trends and changes in real-time.',
      durationEn: 'Duration: 2-3 Days (Monthly)',
      priceEn: '฿30,000/month',
      detailsSteps: [
        'รวบรวมข้อมูลเทรนด์ในอุตสาหกรรมและตลาดที่เกี่ยวข้อง',
        'AI วิเคราะห์ความต่อเนื่องและความแรงของเทรนด์',
        'ส่งรายงานสรุปเทรนด์ใหม่ ๆ แบบรายเดือน'
      ],
      detailsResults: [
        'มองเห็นทิศทางตลาดล่วงหน้า',
        'เตรียมกลยุทธ์เชิงรุกก่อนคู่แข่ง'
      ],
      detailsStepsEn: [
        'Collect trend data in relevant industries and markets',
        'AI analyzes trend continuity and strength',
        'Send monthly new trend summary reports'
      ],
      detailsResultsEn: [
        'See market direction in advance',
        'Prepare proactive strategies before competitors'
      ]
    },
    {
      id: 'competitor-monitoring',
      title: 'Competitor Monitoring',
      icon: Eye,
      description: 'บริการติดตามความเคลื่อนไหวของคู่แข่งแบบเรียลไทม์ อาทิเช่น ราคาผลิตภัณฑ์ แคมเปญโฆษณาประชาสัมพันธ์ และกลยุทธ์การตลาด ด้วย Super AI Agent ที่คอยจับตาดูการเปลี่ยนแปลงสำคัญ',
      duration: 'ระยะเวลา: 2-3 วัน (รายเดือน)',
      price: '40,000 บาท/เดือน',
      descriptionEn: 'Real-time competitor movement monitoring service including product pricing, advertising campaigns, and marketing strategies. Our Super AI Agent tracks important competitive changes.',
      durationEn: 'Duration: 2-3 Days (Monthly)',
      priceEn: '฿40,000/month',
      detailsSteps: [
        'เก็บข้อมูลความเคลื่อนไหวของคู่แข่ง (ราคา, โปรโมชั่น, แคมเปญโฆษณา, PR)',
        'ใช้ Super AI Agent ตรวจจับ "สัญญาณสำคัญ" ที่บ่งบอกการเปลี่ยนแปลง',
        'สรุปรายงานทุก 2–3 วัน พร้อมแจ้งเตือนหากมีการเปลี่ยนกลยุทธ์'
      ],
      detailsResults: [
        'รู้ความเคลื่อนไหวคู่แข่งแบบรวดเร็ว',
        'ปรับกลยุทธ์การตลาดได้ทันท่วงที'
      ],
      detailsStepsEn: [
        'Collect competitor movement data (pricing, promotions, campaigns, PR)',
        'Use Super AI Agent to detect "key signals" indicating changes',
        'Report every 2-3 days with alerts for strategy changes'
      ],
      detailsResultsEn: [
        'Know competitor movements quickly',
        'Adjust marketing strategies in time'
      ]
    }
  ];

  const openServiceDetails = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
  };

  const selectedServiceData = services.find(service => service.id === selectedService);

  return (
    <div className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {t('services-title')}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('services-subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10">
              {/* Service Icon */}
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-pink-500/30 flex items-center justify-center shadow-lg">
                  <service.icon className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent text-center">
                {service.title}
              </h3>
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                {currentLang === 'th' ? service.description : service.descriptionEn}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{currentLang === 'th' ? service.duration : service.durationEn}</p>
                  <p className="text-white font-semibold">{currentLang === 'th' ? service.price : service.priceEn}</p>
                </div>
                <button 
                  onClick={() => openServiceDetails(service.id)}
                  className="px-4 py-2 bg-white/3 backdrop-blur-lg saturate-150 text-white/30 text-sm font-thin rounded-lg border border-white/20 hover:border-pink-400/40 hover:bg-white/8 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                >
                  {currentLang === 'th' ? 'ดูรายละเอียด' : 'Get Details'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-700 p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {currentLang === 'th' 
                ? 'พร้อมเริ่มโครงการของคุณแล้วหรือยัง?'
                : 'Ready to Start Your Project?'
              }
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              {currentLang === 'th' 
                ? 'สมัครสมาชิกวันนี้ แล้วเลือกบริการที่ตรงกับความต้องการของธุรกิจคุณ'
                : 'Sign up today and choose the service that matches your business needs'
              }
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              {/* Sign Up Button */}
              <button 
                onClick={() => onNavigate?.('signup')}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-lg saturate-150 text-white/80 font-thin rounded-full border border-white/20 hover:border-cyan-400/40 hover:bg-white/20 hover:shadow-2xl hover:scale-110 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-cyan-500/50 touch-manipulation"
              >
                {currentLang === 'th' 
                  ? 'สมัครสมาชิกและสั่งซื้อ'
                  : 'Sign Up & Order'
                }
              </button>
            </div>

            {/* Additional Options */}
            <div className="mt-8 pt-6 border-t border-gray-600">
              <p className="text-gray-400 mb-4">
                {currentLang === 'th' 
                  ? 'หรือเลือกดูแพ็คเกจและราคาทั้งหมด'
                  : 'Or view all packages and pricing'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button 
                  onClick={() => onNavigate?.('packages')}
                  className="px-6 py-3 bg-white/5 backdrop-blur-lg saturate-150 border border-white/20 text-cyan-300/80 font-thin rounded-full hover:bg-white/15 hover:text-white hover:border-cyan-400/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-cyan-500/40 touch-manipulation"
                >
                  {currentLang === 'th' ? 'ดูแพ็คเกจทั้งหมด' : 'View All Packages'}
                </button>
                <button 
                  onClick={() => onNavigate?.('contact')}
                  className="px-6 py-3 bg-white/5 backdrop-blur-lg saturate-150 border border-white/20 text-purple-300/80 font-thin rounded-full hover:bg-white/15 hover:text-white hover:border-purple-400/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-purple-500/40 touch-manipulation"
                >
                  {currentLang === 'th' ? 'ปรึกษาฟรี' : 'Free Consultation'}
                </button>
              </div>
            </div>

            
          </div>
        </div>

        {/* Service Details Modal */}
        {selectedService && selectedServiceData && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                  {selectedServiceData.title}
                </h3>
                <button
                  onClick={closeServiceDetails}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400 opacity-50" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Overview */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-cyan-400">
                    {currentLang === 'th' ? 'ภาพรวมบริการ' : 'Service Overview'}
                  </h4>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    {currentLang === 'th' ? selectedServiceData.description : selectedServiceData.descriptionEn}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-400">
                      {currentLang === 'th' ? selectedServiceData.duration : selectedServiceData.durationEn}
                    </span>
                    <span className="text-cyan-400 font-semibold">
                      {currentLang === 'th' ? selectedServiceData.price : selectedServiceData.priceEn}
                    </span>
                  </div>
                </div>

                {/* Process Steps */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-purple-400">
                    {currentLang === 'th' ? 'ขั้นตอนปฏิบัติ' : 'Process Steps'}
                  </h4>
                  <div className="space-y-3">
                    {(currentLang === 'th' ? selectedServiceData.detailsSteps : selectedServiceData.detailsStepsEn).map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-400 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-pink-400">
                    {currentLang === 'th' ? 'ผลลัพธ์ที่ลูกค้าได้รับ' : 'Results You Get'}
                  </h4>
                  <div className="space-y-3">
                    {(currentLang === 'th' ? selectedServiceData.detailsResults : selectedServiceData.detailsResultsEn).map((result, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-400 leading-relaxed">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action in Modal */}
                <div className="pt-6 border-t border-gray-700">
                  <div className="text-center">
                    <p className="text-gray-400 mb-6">
                      {currentLang === 'th' 
                        ? 'สนใจบริการนี้? เลือกวิธีที่สะดวกสำหรับคุณ'
                        : 'Interested in this service? Choose what works best for you'
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button 
                        onClick={() => {
                          // Store selected service for order flow
                          localStorage.setItem('selectedServiceType', selectedServiceData.id);
                          setSelectedService(null);
                          // Check if user is logged in (mock check for now)
                          const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                          if (isLoggedIn) {
                            onNavigate?.('package-selection');
                          } else {
                            onNavigate?.('signup');
                          }
                        }}
                        className="px-6 py-3 bg-white/10 backdrop-blur-lg saturate-150 text-white/80 font-thin rounded-lg border border-white/20 hover:border-pink-400/40 hover:bg-white/20 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                      >
                        {currentLang === 'th' ? 'สมัครสมาชิกและสั่งซื้อ' : 'Sign Up & Order'}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedService(null);
                          onNavigate?.('contact');
                        }}
                        className="px-6 py-3 bg-white/5 backdrop-blur-lg saturate-150 border border-white/20 text-cyan-300/80 font-thin rounded-lg hover:bg-white/15 hover:text-white hover:border-cyan-400/40 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-cyan-500/20"
                      >
                        {currentLang === 'th' ? 'ปรึกษาเพิ่มเติม' : 'Ask Questions'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
