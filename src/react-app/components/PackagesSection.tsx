interface PackagesSectionProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate?: (section: string) => void;
}

export default function PackagesSection({ t, currentLang, onNavigate }: PackagesSectionProps) {
  const packages = [
    {
      name: 'Smart Researcher',
      price: '฿20,000 - 40,000',
      duration: 'ระยะเวลาการวิเคราะห์: 1-2 วัน',
      data: 'ข้อมูลที่เข้าถึงได้: ข้อมูลสาธารณะทั่วไป, บทความวิชาการเปิดเผย',
      features: [
        'สืบค้นข้อมูลพื้นฐาน',
        'สรุปประเด็นสำคัญ',
        'วิเคราะห์แนวโน้มเบื้องต้น'
      ],
      priceEn: '฿20,000 - 40,000',
      durationEn: 'Analysis Duration: 1-2 Days',
      dataEn: 'Accessible Data: General public data, open academic articles',
      featuresEn: [
        'Basic data retrieval',
        'Key point summary',
        'Basic trend analysis'
      ],
      id: 'smart-researcher',
      type: 'one_time'
    },
    {
      name: 'Data Commander',
      price: '฿45,000 - 75,000',
      duration: 'ระยะเวลาการวิเคราะห์: 3-5 วัน',
      data: 'ข้อมูลที่เข้าถึงได้: ฐานข้อมูลเฉพาะทาง, รายงานอุตสาหกรรม, ข้อมูลคู่แข่ง',
      features: [
        'วิเคราะห์เชิงลึก',
        'สร้างโมเดลทำนาย',
        'เปรียบเทียบคู่แข่ง'
      ],
      priceEn: '฿45,000 - 75,000',
      durationEn: 'Analysis Duration: 3-5 Days',
      dataEn: 'Accessible Data: Specialized databases, industry reports, competitor data',
      featuresEn: [
        'In-depth analysis',
        'Predictive modeling',
        'Competitor comparison'
      ],
      id: 'data-commander',
      type: 'one_time'
    },
    {
      name: 'Intelligence Prime',
      price: '฿75,000 - 250,000',
      duration: 'ระยะเวลาการวิเคราะห์: 4-9 วัน',
      data: 'ข้อมูลที่เข้าถึงได้: ฐานข้อมูลทั่วโลก, ข้อมูลไม่เปิดเผย, บทวิเคราะห์ระดับสูง',
      features: [
        'วิเคราะห์เชิงยุทธศาสตร์',
        'เจาะลึกระดับผู้เชี่ยวชาญ',
        'สร้างโมเดลผลกระทบ'
      ],
      recommended: true,
      priceEn: '฿75,000 - 250,000',
      durationEn: 'Analysis Duration: 4-9 Days',
      dataEn: 'Accessible Data: Global databases, non-public data, high-level analysis',
      featuresEn: [
        'Strategic analysis',
        'Expert-level insights',
        'Impact modeling'
      ],
      id: 'intelligence-prime',
      type: 'one_time'
    },
    {
      name: 'Trend Observer',
      price: '฿30,000',
      duration: 'ระยะเวลาการวิเคราะห์: 2-3 วัน (รายงานประจำ เดือนละ 1 ครั้ง)',
      data: 'ข้อมูลที่เข้าถึงได้: ข้อมูลระยะยาว, แนวโน้มอุตสาหกรรม, รายงานประจำ',
      features: [
        'ติดตามแนวโน้มต่อเนื่อง',
        'แจ้งเตือนการเปลี่ยนแปลง',
        'รายงานอัตโนมัติ'
      ],
      monthly: true,
      priceEn: '฿30,000',
      durationEn: 'Analysis Duration: 2-3 Days (Monthly report)',
      dataEn: 'Accessible Data: Long-term data, industry trends, regular reports',
      featuresEn: [
        'Continuous trend tracking',
        'Change alerts',
        'Automated reports'
      ],
      id: 'trend-observer',
      type: 'monthly'
    },
    {
      name: 'Visual Insights',
      price: '฿50,000 - 150,000',
      duration: 'ระยะเวลาการวิเคราะห์: 1-7 วัน',
      data: 'ข้อมูลที่เข้าถึงได้: ข้อมูลเชิงลึก, ภาพและกราฟิก, รายงานโต้ตอบได้',
      features: [
        'สร้างการวิเคราะห์ภาพ',
        'แดชบอร์ดโต้ตอบ',
        'นำเสนอข้อมูลระดับมืออาชีพ'
      ],
      priceEn: '฿50,000 - 150,000',
      durationEn: 'Analysis Duration: 1-7 days',
      dataEn: 'Accessible Data: Deep insights, visuals and graphics, interactive reports',
      featuresEn: [
        'Create visual analysis',
        'Interactive dashboards',
        'Professional data presentation'
      ],
      id: 'visual-insights',
      type: 'one_time'
    },
    {
      name: 'Competitor Monitoring',
      price: '฿40,000',
      duration: 'ระยะเวลาการวิเคราะห์: 2-3 วัน (รายงานประจำ เดือนละ 1 ครั้ง)',
      data: 'ข้อมูลที่เข้าถึงได้: ข้อมูลราคาแข่งขัน, แคมเปญโฆษณา, กลยุทธ์การตลาด',
      features: [
        'ติดตามราคาผลิตภัณฑ์',
        'วิเคราะห์แคมเปญโฆษณา',
        'รายงานกลยุทธ์คู่แข่ง'
      ],
      monthly: true,
      priceEn: '฿40,000',
      durationEn: 'Analysis Duration: 2-3 Days (Monthly report)',
      dataEn: 'Accessible Data: Competitive pricing data, advertising campaigns, marketing strategies',
      featuresEn: [
        'Product pricing tracking',
        'Advertising campaign analysis',
        'Competitor strategy reports'
      ],
      id: 'competitor-monitoring',
      type: 'monthly'
    }
  ];

  const handlePackageSelect = (packageId: string) => {
    // Store selected package in localStorage for checkout process
    localStorage.setItem('selectedPackageId', packageId);
    
    // Check if user is already logged in (you can implement proper auth check here)
    const isLoggedIn = false; // TODO: Replace with actual auth check
    
    if (isLoggedIn) {
      // If user is logged in, go directly to package selection
      onNavigate?.('package-selection');
    } else {
      // If user is not logged in, go to signup first
      onNavigate?.('signup');
    }
  };

  return (
    <div className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {t('packages-title')}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-8">
            {t('packages-subtitle')}
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 max-w-3xl mx-auto">
            <p className="text-blue-200 text-lg">
              {currentLang === 'th' 
                ? 'เลือกแพ็คเกจที่เหมาะกับคุณ และเริ่มต้นโครงการวิเคราะห์ข้อมูลระดับมืออาชีพ'
                : 'Choose the perfect package for you and start your professional data analysis project'
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {packages.map((pkg, index) => (
            <div key={index} className={`relative p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border transition-all duration-500 hover:shadow-xl hover:scale-105 cursor-pointer ${pkg.recommended ? 'border-cyan-500/50 shadow-cyan-500/20' : 'border-gray-700 hover:border-purple-500/50'}`}>
              {pkg.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    ⭐ แนะนำ
                  </span>
                </div>
              )}

              {/* Package Type Badge */}
              <div className="absolute top-4 right-4">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  pkg.monthly 
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                }`}>
                  {pkg.monthly ? (currentLang === 'th' ? 'รายเดือน' : 'Monthly') : (currentLang === 'th' ? 'โครงการเดียว' : 'One-time')}
                </span>
              </div>
              
              <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent pr-16">
                {pkg.name}
              </h3>
              
              <p className="text-2xl font-bold text-white mb-1">{currentLang === 'th' ? pkg.price : pkg.priceEn}</p>
              <p className="text-sm text-gray-400 mb-6">
                {currentLang === 'th' 
                  ? (pkg.monthly ? 'ต่อเดือน' : 'ต่อโครงการ')
                  : (pkg.monthly ? 'Per Month' : 'Per Project')
                }
              </p>
              
              <div className="space-y-3 mb-6">
                {(currentLang === 'th' ? pkg.features : pkg.featuresEn).map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 mr-3 flex-shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                    <p className="text-sm text-gray-400">{feature}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
                <p className="text-xs text-gray-400 mb-2">{currentLang === 'th' ? pkg.duration : pkg.durationEn}</p>
                <p className="text-xs text-gray-400">{currentLang === 'th' ? pkg.data : pkg.dataEn}</p>
              </div>
              
              <button 
                onClick={() => handlePackageSelect(pkg.id)}
                className="w-full py-3 bg-white/10 backdrop-blur-lg saturate-150 text-white/80 font-thin rounded-lg border border-white/20 hover:border-pink-400/40 hover:bg-white/20 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
              >
                {currentLang === 'th' ? 'เริ่มโครงการ' : 'Start Project'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-400 mb-6">
            {currentLang === 'th' 
              ? 'ไม่พบรูปแบบบริการที่ตรงกับความต้องการของคุณ?'
              : "Can't find a service format that matches your needs?"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <button 
              onClick={() => onNavigate?.('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-lg saturate-150 text-white/80 font-thin rounded-full border border-white/20 hover:border-pink-400/40 hover:bg-white/20 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20"
            >
              {currentLang === 'th' 
                ? 'สมัครสมาชิกและสั่งซื้อ'
                : 'Sign Up & Order'
              }
            </button>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-lg saturate-150 text-white font-thin rounded-full border border-white/20 hover:border-pink-400/40 hover:bg-white/20 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20"
            >
              {currentLang === 'th' 
                ? 'ติดต่อเพื่อรับบริการที่ปรับแต่งเฉพาะคุณ'
                : 'Contact for Customized Service'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
