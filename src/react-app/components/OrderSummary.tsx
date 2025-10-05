import { ArrowLeft, ArrowRight, FileText, Package, Clock, DollarSign, Check } from 'lucide-react';
import { ProjectFormData } from './ProjectDetailsForm';

interface OrderSummaryProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate: (section: string) => void;
  onNext: () => void;
}

export default function OrderSummary({ onNavigate, onNext }: OrderSummaryProps) {
  // Get data from localStorage
  const getSelectedPackage = () => {
    try {
      const stored = localStorage.getItem('selectedPackage');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.packageData;
      }
    } catch (error) {
      console.error('Error loading selected package:', error);
    }
    return null;
  };

  const getProjectData = (): ProjectFormData => {
    try {
      const stored = localStorage.getItem('projectData');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading project data:', error);
    }
    return {
      projectTitle: '',
      projectDescription: '',
      requirements: '',
      urgencyLevel: 'standard',
      notes: ''
    };
  };

  const selectedPackage = getSelectedPackage();
  const projectData = getProjectData();

  // AI Price Calculation
  const calculateFinalPrice = () => {
    if (!selectedPackage) return 0;
    
    let basePrice = selectedPackage.priceMin;
    
    // Content complexity factor
    const descriptionLength = projectData.projectDescription.length;
    const requirementsLength = projectData.requirements.length;
    
    let complexityMultiplier = 1.0;
    
    // Description complexity
    if (descriptionLength > 500) complexityMultiplier += 0.3;
    else if (descriptionLength > 200) complexityMultiplier += 0.15;
    
    // Requirements complexity
    if (requirementsLength > 300) complexityMultiplier += 0.2;
    else if (requirementsLength > 100) complexityMultiplier += 0.1;
    
    // Urgency multiplier
    const urgencyMultipliers = {
      'standard': 1.0,
      'priority': 1.25,
      'urgent': 1.5
    };
    
    const urgencyMultiplier = urgencyMultipliers[projectData.urgencyLevel] || 1.0;
    
    // Package type multiplier
    const packageMultipliers: { [key: string]: number } = {
      'smart-researcher': 1.0,
      'data-commander': 1.2,
      'intelligence-prime': 1.5,
      'trend-observer': 1.1,
      'visual-insights': 1.3,
      'competitor-monitoring': 1.1
    };
    
    const packageMultiplier = packageMultipliers[selectedPackage.id] || 1.0;
    
    // Calculate final price
    const calculatedPrice = Math.round(basePrice * complexityMultiplier * urgencyMultiplier * packageMultiplier);
    
    // Ensure it's within the package range
    const minPrice = selectedPackage.priceMin;
    const maxPrice = selectedPackage.priceMax;
    
    return Math.min(Math.max(calculatedPrice, minPrice), maxPrice);
  };

  const finalPrice = calculateFinalPrice();
  const vatAmount = Math.round(finalPrice * 0.07);
  const totalWithVat = finalPrice + vatAmount;

  // Calculate estimated timeline
  const getEstimatedTimeline = () => {
    if (!selectedPackage) return '';
    
    const baseDuration = selectedPackage.duration;
    const urgencyReduction = {
      'standard': ' (ระยะเวลาพื้นฐาน)',
      'priority': ' (เร็วขึ้น 30-50% จากระยะเวลาปกติ)',
      'urgent': ' (เร็วที่สุด - ลดระยะเวลามากที่สุด)'
    };
    
    return baseDuration + (urgencyReduction[projectData.urgencyLevel] || '');
  };

  const formatCurrency = (amount: number) => {
    // Convert from satang (smallest unit) to THB
    const thbAmount = amount / 100;
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(thbAmount);
  };

  const handleConfirmOrder = () => {
    // Store complete order data
    const orderData = {
      package: selectedPackage,
      projectData: projectData,
      orderNumber: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending_payment',
      pricing: {
        basePrice: selectedPackage?.priceMin || 0,
        finalPrice: finalPrice,
        vatAmount: vatAmount,
        totalAmount: totalWithVat
      },
      timeline: getEstimatedTimeline()
    };
    
    // Debug: Log current state
    console.log('🔍 Before adding new order:');
    const existingOrdersJson = localStorage.getItem('allOrders');
    console.log('📦 Existing orders JSON:', existingOrdersJson);
    
    // Get existing orders or initialize empty array
    let existingOrders = [];
    try {
      if (existingOrdersJson) {
        existingOrders = JSON.parse(existingOrdersJson);
        console.log('📝 Parsed existing orders:', existingOrders.length, 'orders found');
      } else {
        console.log('📝 No existing orders found, creating new array');
      }
    } catch (error) {
      console.error('❌ Error parsing existing orders:', error);
      existingOrders = [];
    }
    
    // Check if order with same orderNumber exists
    const orderExists = existingOrders.find((order: any) => order.orderNumber === orderData.orderNumber);
    if (!orderExists) {
      // Add new order to the beginning of array
      existingOrders.unshift(orderData);
      console.log('✅ New order added. Total orders:', existingOrders.length);
    } else {
      console.log('⚠️ Order already exists, not adding duplicate');
    }
    
    // Store updated orders array
    localStorage.setItem('allOrders', JSON.stringify(existingOrders));
    localStorage.setItem('currentOrderData', JSON.stringify(orderData));
    
    // Debug: Verify storage
    const savedOrders = localStorage.getItem('allOrders');
    console.log('💾 Orders saved to localStorage:', savedOrders);
    
    onNext();
  };

  if (!selectedPackage) {
    return (
      <div className="py-20 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">ไม่พบข้อมูลแพ็คเกจที่เลือก</p>
          <button
            onClick={() => onNavigate('package-selection')}
            className="px-6 py-3 bg-cyan-500 text-white/80 font-thin rounded-lg hover:bg-cyan-600 transition-colors"
          >
            กลับไปเลือกแพ็คเกจ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('project-details')}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-400 opacity-50" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              ตรวจสอบใบสั่งซื้อ
            </h1>
            <p className="text-gray-300 mt-2">
              ตรวจสอบรายละเอียดก่อนดำเนินการชำระเงิน
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <span className="ml-2 text-green-400 text-sm">เลือกแพ็คเกจ</span>
            </div>
            <div className="w-8 h-0.5 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <span className="ml-2 text-green-400 text-sm">รายละเอียดโครงการ</span>
            </div>
            <div className="w-8 h-0.5 bg-cyan-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <span className="ml-2 text-cyan-400 text-sm font-semibold">ตรวจสอบใบสั่งซื้อ</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-sm font-bold">
                4
              </div>
              <span className="ml-2 text-gray-400 text-sm">ชำระเงิน</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Information */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
                <Package className="w-5 h-5 opacity-50" />
                ข้อมูลแพ็คเกจ
              </h2>

              <div className="bg-gray-900/50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedPackage.name}</h3>
                    <p className="text-gray-400">
                      ประเภท: {selectedPackage.type === 'one_time' ? 'โครงการเดียว' : 'รายเดือน'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">
                      {formatCurrency(finalPrice)}
                    </p>
                    <p className="text-sm text-gray-400">ราคาก่อน VAT</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">คุณสมบัติ</h4>
                    <div className="space-y-2">
                      {selectedPackage.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0 opacity-50" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">แหล่งข้อมูล</h4>
                    <div className="space-y-2">
                      {selectedPackage.dataSources?.map((source: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0 opacity-50" />
                          <span className="text-sm text-gray-300">{source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6 text-purple-400 flex items-center gap-2">
                <FileText className="w-5 h-5 opacity-50" />
                รายละเอียดโครงการ
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">ชื่อโครงการ</h3>
                  <p className="text-gray-300 bg-gray-900/50 p-3 rounded-lg">
                    {projectData.projectTitle}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">รายละเอียดโครงการ</h3>
                  <p className="text-gray-300 bg-gray-900/50 p-3 rounded-lg whitespace-pre-line">
                    {projectData.projectDescription}
                  </p>
                </div>

                {projectData.requirements && (
                  <div>
                    <h3 className="font-semibold text-white mb-2">ความต้องการเฉพาะ</h3>
                    <p className="text-gray-300 bg-gray-900/50 p-3 rounded-lg whitespace-pre-line">
                      {projectData.requirements}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 opacity-50" />
                    ระดับความเร่งด่วน
                  </h3>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-white">
                        {projectData.urgencyLevel === 'standard' && 'ปกติ'}
                        {projectData.urgencyLevel === 'priority' && 'เร่งด่วน (+25%)'}
                        {projectData.urgencyLevel === 'urgent' && 'เร่งด่วนมาก (+50%)'}
                      </span>
                      {projectData.urgencyLevel !== 'standard' && (
                        <span className="bg-orange-500/20 text-orange-300 text-xs px-2 py-1 rounded-full">
                          {projectData.urgencyLevel === 'priority' && '+25% ค่าบริการ'}
                          {projectData.urgencyLevel === 'urgent' && '+50% ค่าบริการ'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      ระยะเวลาส่งมอบ: {getEstimatedTimeline()}
                    </p>
                  </div>
                </div>

                {projectData.notes && (
                  <div>
                    <h3 className="font-semibold text-white mb-2">หมายเหตุเพิ่มเติม</h3>
                    <p className="text-gray-300 bg-gray-900/50 p-3 rounded-lg whitespace-pre-line">
                      {projectData.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => onNavigate('project-details')}
                className="px-8 py-3 border border-gray-600 text-gray-300/80 font-thin rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
              >
                แก้ไขรายละเอียด
              </button>
              <button
                onClick={handleConfirmOrder}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 text-white/80 font-thin rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                ยืนยันรายการสั่งซื้อ
                <ArrowRight className="w-5 h-5 opacity-50" />
              </button>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 sticky top-6">
              <h2 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5 opacity-50" />
                สรุปราคา
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">ราคาฐาน ({selectedPackage.name})</span>
                  <span className="text-white">
                    {formatCurrency(selectedPackage.priceMin)}
                  </span>
                </div>

                {projectData.urgencyLevel !== 'standard' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">ค่าเร่งด่วน</span>
                    <span className="text-orange-400">
                      +{formatCurrency(Math.round(selectedPackage.priceMin * (
                        projectData.urgencyLevel === 'priority' ? 0.25 : 0.5
                      )))}
                    </span>
                  </div>
                )}

                {finalPrice > selectedPackage.priceMin && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">ค่าความซับซ้อน (AI)</span>
                    <span className="text-purple-400">
                      {finalPrice > selectedPackage.priceMin ? '+' : ''}{formatCurrency(finalPrice - selectedPackage.priceMin)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">ราคาก่อน VAT</span>
                    <span className="text-white font-semibold">
                      {formatCurrency(finalPrice)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">VAT (7%)</span>
                    <span className="text-gray-400">
                      {formatCurrency(vatAmount)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white">ราคาสุดท้าย</span>
                      <span className="text-2xl font-bold text-cyan-400">
                        {formatCurrency(totalWithVat)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Calculation Note */}
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-300">
                  🤖 <strong>ราคาคำนวณโดย AI</strong><br />
                  ราคานี้เป็นราคาแน่นอน ไม่มีค่าใช้จ่ายเพิ่มเติม
                </p>
              </div>

              {/* Timeline */}
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  ⏱️ <strong>ระยะเวลาส่งมอบ</strong><br />
                  {getEstimatedTimeline()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
