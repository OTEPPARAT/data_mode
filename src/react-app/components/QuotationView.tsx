import { useState } from 'react';
import { ArrowLeft, Download, Clock, DollarSign, CreditCard, Building2, Smartphone, Check, FileText } from 'lucide-react';

interface QuotationViewProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate: (section: string) => void;
  orderData: any;
}

export default function QuotationView({ currentLang, onNavigate, orderData }: QuotationViewProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Package pricing configuration - using package IDs instead of service types
  const packagePricing = {
    'smart-researcher': { basePrice: 30000, complexity: 1.0, duration: '24-48 ชั่วโมง' },
    'data-commander': { basePrice: 60000, complexity: 1.1, duration: '3-5 วัน' },
    'intelligence-prime': { basePrice: 162500, complexity: 1.2, duration: '4-9 วัน' },
    'trend-observer': { basePrice: 60000, complexity: 1.0, duration: '2-3 วัน (รายเดือน)' },
    'visual-insights': { basePrice: 100000, complexity: 1.4, duration: '1-7 วัน' },
    'competitor-monitoring': { basePrice: 40000, complexity: 1.0, duration: '2-3 วัน (รายเดือน)' }
  };

  // Calculate complexity multiplier based on order requirements
  const calculateComplexityMultiplier = () => {
    let multiplier = 1.0;
    
    // Urgency multiplier
    if (orderData.urgencyLevel === 'priority') multiplier += 0.25;
    if (orderData.urgencyLevel === 'urgent') multiplier += 0.50;
    
    // Complexity based on description length and requirements
    const descriptionComplexity = orderData.projectDescription?.length > 500 ? 0.1 : 0;
    const requirementsComplexity = orderData.specificRequirements?.length > 200 ? 0.1 : 0;
    const scopeComplexity = orderData.geographicScope?.includes('international') || 
                           orderData.geographicScope?.includes('global') ? 0.2 : 0;
    
    multiplier += descriptionComplexity + requirementsComplexity + scopeComplexity;
    
    return Math.min(multiplier, 2.0); // Cap at 2x
  };

  // Use package data if available, otherwise fallback to service type mapping
  const packageId = orderData.selectedPackage || orderData.serviceType;
  const packageData = packagePricing[packageId as keyof typeof packagePricing];
  
  const complexityMultiplier = calculateComplexityMultiplier();
  const basePrice = packageData?.basePrice || orderData.selectedPackageData?.priceMin || 40000;
  const finalPrice = Math.round(basePrice * (packageData?.complexity || 1.0) * complexityMultiplier);
  const downPayment = Math.round(finalPrice * 0.5);
  const vatAmount = Math.round(finalPrice * 0.07);
  const totalWithVat = finalPrice + vatAmount;
  const duration = packageData?.duration || orderData.selectedPackageData?.duration || '5-10 วัน';

  // Generate quotation number
  const quotationNumber = `QUO-${Date.now().toString().slice(-8)}`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'โอนเงินเข้าบัญชีธนาคาร',
      nameEn: 'Bank Transfer',
      icon: Building2,
      description: 'โอนเงินเข้าบัญชีแล้วส่งสลิปให้เรา',
      descriptionEn: 'Transfer to our bank account and send slip',
      details: [
        'ธนาคารกสิกรไทย สาขาวังทองหลาง',
        'ชื่อบัญชี: บริษัท โมด อิมเมจ จำกัด',
        'เลขที่บัญชี: 123-4-56789-0',
        'ส่งสลิปมาที่: admin@modeimage.co.th'
      ]
    },
    {
      id: 'promptpay',
      name: 'พร้อมเพย์',
      nameEn: 'PromptPay',
      icon: Smartphone,
      description: 'สแกน QR Code หรือโอนผ่านพร้อมเพย์',
      descriptionEn: 'Scan QR Code or transfer via PromptPay',
      details: [
        'เลขพร้อมเพย์: 0812983799',
        'ชื่อบัญชี: บริษัท โมด อิมเมจ จำกัด',
        'ส่งสลิปมาที่: admin@modeimage.co.th'
      ]
    },
    {
      id: 'credit_card',
      name: 'บัตรเครดิต/เดบิต',
      nameEn: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'ชำระผ่านระบบบัตรเครดิต',
      descriptionEn: 'Pay via credit card system',
      details: [
        'รองรับ Visa, MasterCard, JCB',
        'ระบบปลอดภัย SSL',
        'ได้ใบเสร็จทันทีผ่านอีเมล'
      ]
    }
  ];

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert(currentLang === 'th' ? 'กรุณาเลือกวิธีการชำระเงิน' : 'Please select payment method');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // TODO: Process payment based on selected method
      console.log('Processing payment:', {
        method: selectedPaymentMethod,
        amount: downPayment,
        quotationNumber
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(currentLang === 'th' 
        ? 'ได้รับคำสั่งซื้อเรียบร้อยแล้ว! ทีมงานจะติดต่อกลับเพื่อยืนยันการชำระเงินภายใน 2 ชั่วโมง'
        : 'Order received successfully! Our team will contact you to confirm payment within 2 hours'
      );

      onNavigate('dashboard');
    } catch (error) {
      console.error('Payment processing error:', error);
      alert(currentLang === 'th' 
        ? 'เกิดข้อผิดพลาดในการดำเนินการ กรุณาลองใหม่อีกครั้ง'
        : 'Processing error. Please try again.'
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const downloadQuotation = () => {
    // TODO: Generate PDF quotation
    alert(currentLang === 'th' 
      ? 'กำลังเตรียมไฟล์ PDF ใบเสนอราคา...'
      : 'Preparing PDF quotation...'
    );
  };

  return (
    <div className="py-20 px-6 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('service-order')}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-400 opacity-50" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {currentLang === 'th' ? 'ใบเสนอราคา' : 'Quotation'}
            </h1>
            <p className="text-gray-300 mt-2">
              {currentLang === 'th' 
                ? `หมายเลขใบเสนอราคา: ${quotationNumber}` 
                : `Quotation Number: ${quotationNumber}`
              }
            </p>
          </div>
          <button
            onClick={downloadQuotation}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 opacity-50" />
            {currentLang === 'th' ? 'ดาวน์โหลด PDF' : 'Download PDF'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quotation Details */}
          <div className="lg:col-span-2">
            {/* Project Information */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-6">
              <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                <FileText className="w-5 h-5 opacity-50" />
                {currentLang === 'th' ? 'ข้อมูลโครงการ' : 'Project Information'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    {currentLang === 'th' ? 'ชื่อโครงการ:' : 'Project Title:'}
                  </label>
                  <p className="text-white">{orderData.projectTitle}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">
                    {currentLang === 'th' ? 'ประเภทบริการ:' : 'Service Type:'}
                  </label>
                  <p className="text-white">{orderData.serviceTypeName || orderData.packageName || 'ไม่ระบุ'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">
                    {currentLang === 'th' ? 'รายละเอียดโครงการ:' : 'Project Description:'}
                  </label>
                  <p className="text-white">{orderData.projectDescription}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">
                    {currentLang === 'th' ? 'วัตถุประสงค์:' : 'Project Goals:'}
                  </label>
                  <p className="text-white">{orderData.projectGoals}</p>
                </div>

                {orderData.specificRequirements && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">
                      {currentLang === 'th' ? 'ความต้องการเฉพาะ:' : 'Specific Requirements:'}
                    </label>
                    <p className="text-white">{orderData.specificRequirements}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-6">
              <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5 opacity-50" />
                {currentLang === 'th' ? 'รายละเอียดราคา' : 'Price Breakdown'}
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">{currentLang === 'th' ? 'ราคาพื้นฐาน:' : 'Base Price:'}</span>
                  <span className="text-white">{formatCurrency(basePrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">{currentLang === 'th' ? 'ความซับซ้อนโครงการ:' : 'Project Complexity:'}</span>
                  <span className="text-white">x{complexityMultiplier.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">{currentLang === 'th' ? 'ค่าบริการก่อน VAT:' : 'Service Fee (before VAT):'}</span>
                  <span className="text-white font-semibold">{formatCurrency(finalPrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">VAT 7%:</span>
                  <span className="text-white">{formatCurrency(vatAmount)}</span>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-white font-bold">{currentLang === 'th' ? 'รวมทั้งสิ้น:' : 'Total Amount:'}</span>
                    <span className="text-cyan-400 font-bold">{formatCurrency(totalWithVat)}</span>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-300 font-semibold">{currentLang === 'th' ? 'เงินมัดจำ 50%:' : 'Down Payment 50%:'}</span>
                    <span className="text-blue-300 font-bold text-xl">{formatCurrency(downPayment)}</span>
                  </div>
                  <p className="text-blue-200 text-sm mt-2">
                    {currentLang === 'th' 
                      ? 'ชำระเงินมัดจำเพื่อเริ่มดำเนินงาน ส่วนที่เหลือชำระเมื่อส่งมอบงาน'
                      : 'Pay down payment to start project. Remaining amount due upon delivery'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline & Delivery */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                <Clock className="w-5 h-5 opacity-50" />
                {currentLang === 'th' ? 'กำหนดเวลา & การส่งมอบ' : 'Timeline & Delivery'}
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">{currentLang === 'th' ? 'ระยะเวลาดำเนินงาน:' : 'Project Duration:'}</span>
                  <span className="text-white">{duration}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">{currentLang === 'th' ? 'ระดับความเร่งด่วน:' : 'Urgency Level:'}</span>
                  <span className="text-white">
                    {orderData.urgencyLevel === 'standard' && (currentLang === 'th' ? 'ปกติ' : 'Standard')}
                    {orderData.urgencyLevel === 'priority' && (currentLang === 'th' ? 'เร่งด่วน (+25%)' : 'Priority (+25%)')}
                    {orderData.urgencyLevel === 'urgent' && (currentLang === 'th' ? 'เร่งด่วนมาก (+50%)' : 'Urgent (+50%)')}
                  </span>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h3 className="text-green-300 font-semibold mb-2">
                    {currentLang === 'th' ? 'รูปแบบการส่งมอบ:' : 'Delivery Format:'}
                  </h3>
                  <div className="space-y-1 text-green-200 text-sm">
                    {orderData.deliverableFormat?.split(',').map((format: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-3 h-3 opacity-50" />
                        <span>{format.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 sticky top-6">
              <h2 className="text-xl font-bold mb-6 text-cyan-400">
                {currentLang === 'th' ? 'ชำระเงินมัดจำ' : 'Pay Down Payment'}
              </h2>

              {/* Payment Amount */}
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-center">
                <p className="text-gray-400 text-sm mb-2">
                  {currentLang === 'th' ? 'จำนวนเงินที่ต้องชำระ' : 'Amount to Pay'}
                </p>
                <p className="text-3xl font-bold text-cyan-400">{formatCurrency(downPayment)}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {currentLang === 'th' ? 'เงินมัดจำ 50%' : 'Down Payment 50%'}
                </p>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {currentLang === 'th' ? 'เลือกวิธีการชำระเงิน' : 'Select Payment Method'}
                </h3>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        selectedPaymentMethod === method.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <method.icon className="w-5 h-5 text-cyan-400" />
                          <span className="font-semibold text-white">
                            {currentLang === 'th' ? method.name : method.nameEn}
                          </span>
                        </div>
                        {selectedPaymentMethod === method.id && (
                          <Check className="w-5 h-5 text-cyan-400 opacity-50" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {currentLang === 'th' ? method.description : method.descriptionEn}
                      </p>

                      {selectedPaymentMethod === method.id && (
                        <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                          <h4 className="text-sm font-semibold text-cyan-300 mb-2">
                            {currentLang === 'th' ? 'รายละเอียดการชำระ:' : 'Payment Details:'}
                          </h4>
                          {method.details.map((detail, index) => (
                            <p key={index} className="text-xs text-gray-300 mb-1">{detail}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || isProcessingPayment}
                className="w-full py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {isProcessingPayment 
                  ? (currentLang === 'th' ? 'กำลังดำเนินการ...' : 'Processing...')
                  : (currentLang === 'th' ? 'ดำเนินการชำระเงิน' : 'Proceed with Payment')
                }
              </button>

              <div className="mt-4 text-xs text-gray-400 text-center">
                {currentLang === 'th' 
                  ? 'การชำระเงินมีความปลอดภัย และข้อมูลของคุณจะถูกเข้ารหัส'
                  : 'Payment is secure and your information is encrypted'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
