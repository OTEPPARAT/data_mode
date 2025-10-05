import { useState } from 'react';
import { ArrowLeft, Check, Clock, Database, Zap } from 'lucide-react';
import SystemUpdateButton from './SystemUpdateButton';

interface PackageSelectionProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate: (section: string) => void;
}

interface PackageOption {
  id: string;
  name: string;
  type: 'one_time' | 'monthly';
  priceMin: number;
  priceMax: number;
  duration: string;
  features: string[];
  dataSources: string[];
  recommended?: boolean;
}

export default function PackageSelection({ t, onNavigate }: PackageSelectionProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'one_time' | 'monthly'>('one_time');

  const packages: PackageOption[] = [
    {
      id: 'smart-researcher',
      name: 'Smart Researcher',
      type: 'one_time',
      priceMin: 20000,
      priceMax: 40000,
      duration: '24-48 ชั่วโมง',
      features: [
        'สืบค้นข้อมูลพื้นฐาน',
        'สรุปประเด็นสำคัญ',
        'วิเคราะห์แนวโน้มเบื้องต้น'
      ],
      dataSources: [
        'ข้อมูลสาธารณะทั่วไป',
        'บทความวิชาการเปิดเผย'
      ]
    },
    {
      id: 'data-commander',
      name: 'Data Commander',
      type: 'one_time',
      priceMin: 45000,
      priceMax: 75000,
      duration: '3-5 วัน',
      features: [
        'วิเคราะห์เชิงลึก',
        'สร้างโมเดลทำนาย',
        'เปรียบเทียบคู่แข่ง'
      ],
      dataSources: [
        'ฐานข้อมูลเฉพาะทาง',
        'รายงานอุตสาหกรรม',
        'ข้อมูลคู่แข่ง'
      ]
    },
    {
      id: 'intelligence-prime',
      name: 'Intelligence Prime',
      type: 'one_time',
      priceMin: 75000,
      priceMax: 250000,
      duration: '4-9 วัน',
      features: [
        'วิเคราะห์เชิงยุทธศาสตร์',
        'เจาะลึกระดับผู้เชี่ยวชาญ',
        'สร้างโมเดลผลกระทบ'
      ],
      dataSources: [
        'ฐานข้อมูลทั่วโลก',
        'ข้อมูลไม่เปิดเผย',
        'บทวิเคราะห์ระดับสูง'
      ],
      recommended: true
    },
    {
      id: 'trend-observer',
      name: 'Trend Observer',
      type: 'monthly',
      priceMin: 25000,
      priceMax: 95000,
      duration: '2-3 วัน (รายเดือน)',
      features: [
        'ติดตามแนวโน้มต่อเนื่อง',
        'แจ้งเตือนการเปลี่ยนแปลง',
        'รายงานอัตโนมัติ'
      ],
      dataSources: [
        'ข้อมูลระยะยาว',
        'แนวโน้มอุตสาหกรรม',
        'รายงานประจำ'
      ]
    },
    {
      id: 'visual-insights',
      name: 'Visual Insights',
      type: 'one_time',
      priceMin: 50000,
      priceMax: 150000,
      duration: '1-7 วัน',
      features: [
        'สร้างการวิเคราะห์ภาพ',
        'แดชบอร์ดโต้ตอบ',
        'นำเสนอข้อมูลระดับมืออาชีพ'
      ],
      dataSources: [
        'ข้อมูลเชิงลึก',
        'ภาพและกราฟิก',
        'รายงานโต้ตอบได้'
      ]
    }
  ];

  const filteredPackages = packages.filter(pkg => pkg.type === selectedType);

  const formatCurrency = (amount: number) => {
    // Convert from satang (smallest unit) to THB
    const thbAmount = amount / 100;
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(thbAmount);
  };

  const handleContinue = () => {
    if (selectedPackage) {
      // Store selected package in localStorage for checkout
      localStorage.setItem('selectedPackage', JSON.stringify({
        id: selectedPackage,
        type: selectedType,
        packageData: packages.find(p => p.id === selectedPackage)
      }));
      onNavigate('project-details');
    }
  };

  return (
    <div className="py-20 px-6 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('packages')}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-400 opacity-50" />
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                {t('select-package-title')}
              </h1>
              <p className="text-gray-300 mt-2">
                {t('select-package-subtitle')}
              </p>
            </div>
          </div>
          <SystemUpdateButton variant="small" />
        </div>

        {/* Package Type Selector */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-gray-900/50 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setSelectedType('one_time')}
              className={`px-8 py-3 rounded-md transition-all duration-300 ${
                selectedType === 'one_time'
                  ? 'bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{t('package-one-time')}</div>
                <div className="text-sm opacity-80">{t('select-project-type')}</div>
              </div>
            </button>
            <button
              onClick={() => setSelectedType('monthly')}
              className={`px-8 py-3 rounded-md transition-all duration-300 ${
                selectedType === 'monthly'
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{t('package-monthly')}</div>
                <div className="text-sm opacity-80">{t('select-subscription')}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedPackage === pkg.id
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-xl shadow-cyan-500/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              } ${
                pkg.recommended ? 'ring-2 ring-purple-500/50' : ''
              }`}
            >
              {/* Recommended Badge */}
              {pkg.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    แนะนำ
                  </span>
                </div>
              )}

              {/* Selected Indicator */}
              {selectedPackage === pkg.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white opacity-50" />
                  </div>
                </div>
              )}

              {/* Package Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                  {pkg.name}
                </h3>
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  {formatCurrency(pkg.priceMin)} - {formatCurrency(pkg.priceMax)}
                </div>
                <p className="text-sm text-gray-400">
                  {selectedType === 'monthly' ? 'ต่อเดือน' : 'ต่อโครงการ'}
                </p>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 mb-4 text-gray-300">
                <Clock className="w-4 h-4 text-cyan-400 opacity-50" />
                <span className="text-sm">{pkg.duration}</span>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400 opacity-50" />
                  คุณสมบัติ
                </h4>
                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Sources */}
              <div>
                <h4 className="font-semibold mb-3 text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400 opacity-50" />
                  แหล่งข้อมูล
                </h4>
                <div className="space-y-2">
                  {pkg.dataSources.map((source, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-300">{source}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onNavigate('packages')}
            className="px-8 py-3 border border-gray-600 text-gray-300/80 font-thin rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
          >
            {t('btn-back')}
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedPackage}
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 text-white/80 font-thin rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t('btn-continue')}
          </button>
        </div>
      </div>
    </div>
  );
}
