import { useState } from 'react';
import { ArrowLeft, CreditCard, Building2, Smartphone, Check, Shield, Clock, Package } from 'lucide-react';

interface PaymentProcessProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate: (section: string) => void;
}

export default function PaymentProcess({ onNavigate }: PaymentProcessProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get order data from localStorage
  const getOrderData = () => {
    try {
      const stored = localStorage.getItem('currentOrderData');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading order data:', error);
    }
    return null;
  };

  const orderData = getOrderData();

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
      popular: true,
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
      popular: true,
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
      description: 'ชำระผ่านระบบบัตรเครดิต (เร็วที่สุด)',
      descriptionEn: 'Pay via credit card system (fastest)',
      details: [
        'รองรับ Visa, MasterCard, JCB',
        'ระบบปลอดภัย SSL',
        'ได้ใบเสร็จทันทีผ่านอีเมล',
        'เริ่มดำเนินงานทันที'
      ]
    }
  ];

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('กรุณาเลือกวิธีการชำระเงิน');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('💾 Starting payment process...');

      // Demo mode - always create/use demo user
      let userData = {
        id: 1,
        email: 'demo@datamode.local',
        firstName: 'ผู้ใช้',
        lastName: 'ทดลอง',
        companyName: 'Demo User'
      };
      
      // Try to get existing user data if available
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr && currentUserStr !== 'null' && currentUserStr.length > 10) {
        try {
          const existingUser = JSON.parse(currentUserStr);
          if (existingUser && existingUser.id) {
            userData = existingUser;
            console.log('✅ Using existing user:', userData.email || userData.id);
          }
        } catch {
          console.warn('❌ Could not parse existing user data, using demo user');
        }
      }
      
      // Always ensure user is stored in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');

      console.log('👤 Using user:', userData.email, 'ID:', userData.id);
      
      // Debug: Show all localStorage data
      console.log('🗂️ All localStorage data:', {
        currentUser: localStorage.getItem('currentUser'),
        currentOrderData: localStorage.getItem('currentOrderData'),
        selectedPackage: localStorage.getItem('selectedPackage'),
        projectData: localStorage.getItem('projectData'),
        isLoggedIn: localStorage.getItem('isLoggedIn')
      });
      
      // Validate order data with detailed logging
      console.log('🔍 Order data details:', {
        orderData: orderData,
        hasOrderData: !!orderData,
        hasPackage: !!(orderData?.package),
        hasProjectData: !!(orderData?.projectData),
        hasOrderNumber: !!(orderData?.orderNumber),
        hasPricing: !!(orderData?.pricing)
      });
      
      if (!orderData) {
        console.error('❌ No order data found in localStorage');
        throw new Error('ไม่พบข้อมูลคำสั่งซื้อ กรุณาเริ่มกระบวนการสั่งซื้อใหม่');
      }
      
      if (!orderData.package) {
        console.error('❌ No package data in order:', orderData);
        throw new Error('ไม่พบข้อมูลแพ็คเกจ กรุณากลับไปเลือกแพ็คเกจใหม่');
      }
      
      if (!orderData.projectData) {
        console.error('❌ No project data in order:', orderData);
        throw new Error('ไม่พบข้อมูลโครงการ กรุณากลับไปกรอกรายละเอียดโครงการใหม่');
      }
      
      if (!orderData.projectData.projectTitle) {
        console.error('❌ No project title:', orderData.projectData);
        throw new Error('ไม่พบชื่อโครงการ กรุณากลับไปกรอกชื่อโครงการ');
      }
      
      if (!orderData.projectData.projectDescription) {
        console.error('❌ No project description:', orderData.projectData);
        throw new Error('ไม่พบรายละเอียดโครงการ กรุณากลับไปกรอกรายละเอียดโครงการ');
      }
      
      console.log('✅ Order data validation passed');
      
      // Create comprehensive order payload
      const orderPayload = {
        userId: userData.id,
        packageId: orderData.package.id || 'smart-researcher',
        orderType: orderData.package.type || 'one_time',
        projectTitle: orderData.projectData.projectTitle || '',
        projectDescription: orderData.projectData.projectDescription || '',
        requirements: orderData.projectData.requirements || '',
        deadlineDate: orderData.projectData.deadlineDate || null,
        paymentMethod: selectedPaymentMethod,
        notes: orderData.projectData.notes || '',
        amount: orderData.pricing?.totalAmount || 0,
        orderNumber: orderData.orderNumber || `ORD-${Date.now()}`
      };

      console.log('📦 Order payload prepared:', {
        userId: orderPayload.userId,
        packageId: orderPayload.packageId,
        amount: orderPayload.amount,
        orderNumber: orderPayload.orderNumber
      });

      // Send request to backend with timeout and better error handling
      console.log('🌐 Sending request to backend...');
      console.log('📦 Request payload:', JSON.stringify(orderPayload, null, 2));
      
      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout
      
      let response;
      try {
        response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderPayload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            throw new Error('การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง');
          }
          if (fetchError.message.includes('Failed to fetch')) {
            throw new Error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
          }
        }
        
        throw fetchError;
      }

      // Handle response
      if (!response.ok) {
        let errorDetails = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          console.error('❌ Backend error response:', errorData);
          
          // Extract error message safely
          if (errorData && typeof errorData === 'object') {
            if (typeof errorData.details === 'string' && errorData.details) {
              errorDetails = errorData.details;
            } else if (typeof errorData.error === 'string' && errorData.error) {
              errorDetails = errorData.error;
            } else if (typeof errorData.message === 'string' && errorData.message) {
              errorDetails = errorData.message;
            }
          }
        } catch (parseError) {
          console.error('❌ Could not parse error response:', parseError);
          
          // Provide user-friendly error messages based on status codes
          switch (response.status) {
            case 400:
              errorDetails = 'ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่';
              break;
            case 401:
              errorDetails = 'ไม่มีสิทธิ์เข้าใช้งาน กรุณาเข้าสู่ระบบใหม่';
              break;
            case 403:
              errorDetails = 'ไม่มีสิทธิ์ดำเนินการนี้';
              break;
            case 404:
              errorDetails = 'ไม่พบข้อมูลที่ต้องการ กรุณาลองใหม่';
              break;
            case 422:
              errorDetails = 'ข้อมูลไม่ถูกต้องตามรูปแบบที่กำหนด';
              break;
            case 429:
              errorDetails = 'มีการส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่';
              break;
            case 500:
              errorDetails = 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ กรุณาลองใหม่ในภายหลัง';
              break;
            case 502:
              errorDetails = 'เซิร์ฟเวอร์ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่';
              break;
            case 503:
              errorDetails = 'เซิร์ฟเวอร์ไม่พร้อมใช้งาน กรุณาลองใหม่ในภายหลัง';
              break;
            case 504:
              errorDetails = 'การเชื่อมต่อหมดเวลา กรุณาลองใหม่';
              break;
            default:
              errorDetails = `เกิดข้อผิดพลาด HTTP ${response.status}: ${response.statusText}`;
          }
        }
        
        throw new Error(errorDetails);
      }

      let backendResult;
      try {
        const responseText = await response.text();
        console.log('📄 Raw response text:', responseText);
        
        if (!responseText) {
          throw new Error('เซิร์ฟเวอร์ส่งกลับข้อมูลเปล่า');
        }
        
        backendResult = JSON.parse(responseText);
        console.log('✅ Order saved successfully:', backendResult);
        
        // Validate response structure
        if (!backendResult.success && !backendResult.orderId) {
          throw new Error(backendResult.error || 'การตอบสนองจากเซิร์ฟเวอร์ไม่ถูกต้อง');
        }
        
      } catch (jsonError) {
        console.error('❌ Failed to parse JSON response:', jsonError);
        if (jsonError instanceof SyntaxError) {
          throw new Error('เซิร์ฟเวอร์ส่งกลับข้อมูลที่ไม่ถูกต้อง');
        }
        throw jsonError;
      }

      // Update local storage
      const updatedOrderData = {
        ...orderData,
        paymentMethod: selectedPaymentMethod,
        status: 'confirmed',
        confirmedAt: new Date().toISOString(),
        backendOrderId: backendResult.orderId
      };

      localStorage.setItem('currentOrderData', JSON.stringify(updatedOrderData));

      // Trigger dashboard refresh
      window.dispatchEvent(new CustomEvent('refreshDashboard'));

      // Clean up temporary data
      localStorage.removeItem('selectedPackage');
      localStorage.removeItem('projectData');

      // Show success message
      const successMessage = [
        '✅ ยืนยันคำสั่งซื้อเรียบร้อยแล้ว!',
        '',
        `📋 หมายเลขคำสั่งซื้อ: ${orderData.orderNumber}`,
        `💰 ยอดชำระ: ${formatCurrency(orderData.pricing?.totalAmount || 0)}`,
        `⏰ ระยะเวลาส่งมอบ: ${orderData.timeline || 'ตามที่ระบุ'}`,
        '',
        selectedPaymentMethod === 'credit_card' 
          ? '💳 การชำระเงินจะดำเนินการในขั้นตอนถัดไป' 
          : '📧 ทีมงานจะติดต่อกลับเพื่อแจ้งรายละเอียดการชำระเงินภายใน 2 ชั่วโมง',
        '',
        '🚀 ทีมงานจะเริ่มดำเนินงานทันทีหลังจากได้รับการชำระเงิน'
      ].join('\n');

      alert(successMessage);

      // Navigate to dashboard
      console.log('🎯 Navigating to dashboard...');
      onNavigate('dashboard');

    } catch (error) {
      console.error('💥 Payment processing failed:', error);
      
      // Enhanced error handling with proper object to string conversion
      let userFriendlyMessage = 'เกิดข้อผิดพลาดในการดำเนินการ';
      let technicalDetails = '';
      
      // Handle Error instances
      if (error instanceof Error) {
        console.log('📝 Error type: Error instance');
        userFriendlyMessage = error.message;
        
        // Handle specific error cases
        if (error.message.includes('authentication') || error.message.includes('ล็อกอิน')) {
          alert('🔒 เซสชันหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
          onNavigate('signup');
          setIsProcessing(false);
          return;
        }
        
        // Handle network errors
        if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
          userFriendlyMessage = 'เกิดปัญหาการเชื่อมต่อเครือข่าย กรุณาตรวจสอบอินเทอร์เน็ตและลองใหม่';
        }
        
        // Handle timeout errors
        if (error.message.includes('timeout')) {
          userFriendlyMessage = 'การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง';
        }
        
      } else if (typeof error === 'string') {
        console.log('📝 Error type: String');
        userFriendlyMessage = error;
        
      } else if (error && typeof error === 'object') {
        console.log('📝 Error type: Object');
        console.log('📄 Error object:', error);
        
        try {
          const errorObj = error as Record<string, unknown>;
          
          // Try different error properties
          if (errorObj.message && typeof errorObj.message === 'string') {
            userFriendlyMessage = errorObj.message;
          } else if (errorObj.error && typeof errorObj.error === 'string') {
            userFriendlyMessage = errorObj.error;
          } else if (errorObj.details && typeof errorObj.details === 'string') {
            userFriendlyMessage = errorObj.details;
          } else if (errorObj.statusText && typeof errorObj.statusText === 'string') {
            userFriendlyMessage = `HTTP Error: ${errorObj.status || 'Unknown'} - ${errorObj.statusText}`;
          } else {
            // Last resort: try to stringify the error safely
            try {
              const errorString = JSON.stringify(error, null, 2);
              if (errorString && errorString !== '{}') {
                technicalDetails = errorString;
                userFriendlyMessage = 'เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้ง';
              } else {
                userFriendlyMessage = 'เกิดข้อผิดพลาดที่ไม่สามารถระบุได้';
              }
            } catch (jsonError) {
              console.error('❌ Could not stringify error object:', jsonError);
              userFriendlyMessage = 'เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้ง';
              technicalDetails = 'Object error that could not be serialized';
            }
          }
        } catch (processError) {
          console.error('❌ Could not process error object:', processError);
          userFriendlyMessage = 'เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้ง';
        }
        
      } else if (error === null) {
        console.log('📝 Error type: null');
        userFriendlyMessage = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ (null error)';
        
      } else if (error === undefined) {
        console.log('📝 Error type: undefined');
        userFriendlyMessage = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ (undefined error)';
        
      } else {
        console.log('📝 Error type: Unknown type -', typeof error);
        userFriendlyMessage = `เกิดข้อผิดพลาดประเภท ${typeof error}: ${String(error)}`;
      }

      // Show comprehensive error message
      const errorMessage = [
        '❌ เกิดข้อผิดพลาดในการสั่งซื้อ',
        '',
        '📋 รายละเอียด:',
        userFriendlyMessage,
        technicalDetails ? `\n🔧 ข้อมูลเทคนิค:\n${technicalDetails}` : '',
        '',
        '💡 วิธีแก้ไข:',
        '• ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
        '• ลองใหม่อีกครั้งในอีกสักครู่',
        '• ลองรีเฟรชหน้าเว็บ',
        '• หากปัญหายังคงมีอยู่ กรุณาติดต่อทีมงาน',
        '',
        '📞 ติดต่อ: admin@modeimage.co.th',
        '📱 โทร: 081-298-3799'
      ].filter(line => line !== '').join('\n');
      
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Simplified authentication check - always allow for demo
  const isAuthenticated = true; // Always allow for demo mode
  
  console.log('✅ Payment Process - Demo Mode: Authentication bypassed for testing');
  
  if (!isAuthenticated) {
    console.log('❌ Authentication failed, redirecting to login');
    return (
      <div className="py-20 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">ต้องเข้าสู่ระบบก่อน</h2>
          <p className="text-gray-300 mb-6">
            คำสั่งซื้อของคุณจะถูกเก็บไว้ กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ
          </p>
          <button
            onClick={() => {
              console.log('🔄 Navigating to signup from payment');
              onNavigate('signup');
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mb-3"
          >
            เข้าสู่ระบบ / สมัครสมาชิก
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
          >
            กลับไปหน้าหลัก
          </button>
        </div>
      </div>
    );
  }
  
  console.log('✅ Authentication passed, proceeding to payment');

  if (!orderData) {
    return (
      <div className="py-20 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">ไม่พบข้อมูลคำสั่งซื้อ</p>
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
            onClick={() => onNavigate('order-summary')}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-400 opacity-50" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              ชำระเงิน
            </h1>
            <p className="text-gray-300 mt-2">
              เลือกวิธีการชำระเงินที่สะดวกสำหรับคุณ
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
            <div className="w-8 h-0.5 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <span className="ml-2 text-green-400 text-sm">ตรวจสอบใบสั่งซื้อ</span>
            </div>
            <div className="w-8 h-0.5 bg-cyan-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                4
              </div>
              <span className="ml-2 text-cyan-400 text-sm font-semibold">ชำระเงิน</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6 text-cyan-400">
                เลือกวิธีการชำระเงิน
              </h2>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedPaymentMethod === method.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <method.icon className="w-6 h-6 text-cyan-400" />
                        <div>
                          <h3 className="font-semibold text-white">{method.name}</h3>
                          <p className="text-sm text-gray-400">{method.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.popular && (
                          <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full font-medium">
                            แนะนำ
                          </span>
                        )}
                        {selectedPaymentMethod === method.id && (
                          <Check className="w-5 h-5 text-cyan-400 opacity-50" />
                        )}
                      </div>
                    </div>

                    {selectedPaymentMethod === method.id && (
                      <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border-l-4 border-cyan-500">
                        <h4 className="text-sm font-semibold text-cyan-300 mb-3">
                          รายละเอียดการชำระเงิน:
                        </h4>
                        <div className="space-y-1">
                          {method.details.map((detail, index) => (
                            <p key={index} className="text-sm text-gray-300">
                              • {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-400 opacity-50" />
                  <span className="font-semibold text-green-300">การชำระเงินปลอดภัย</span>
                </div>
                <p className="text-sm text-green-200">
                  ข้อมูลการชำระเงินของคุณได้รับการเข้ารหัสและปกป้องอย่างสูงสุด เราใช้มาตรฐานความปลอดภัยระดับธนาคาร
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => onNavigate('order-summary')}
                  className="px-8 py-3 border border-gray-600 text-gray-300/80 font-thin rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
                >
                  แก้ไขรายการ
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod || isProcessing}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 text-white/80 font-thin rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      กำลังดำเนินการ...
                    </div>
                  ) : (
                    'ยืนยันการสั่งซื้อ'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 sticky top-6">
              <h2 className="text-xl font-bold mb-6 text-cyan-400">
                สรุปคำสั่งซื้อ
              </h2>

              {/* Order Number */}
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-400">หมายเลขคำสั่งซื้อ</p>
                <p className="text-lg font-bold text-white">{orderData.orderNumber}</p>
              </div>

              {/* Package Info */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-purple-400 opacity-50" />
                  <span className="font-semibold text-white">{orderData.package.name}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{orderData.projectData.projectTitle}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4 opacity-50" />
                  <span>ระยะเวลาส่งมอบ: {orderData.timeline}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-700 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">ราคาก่อน VAT</span>
                    <span className="text-white font-semibold">
                      {formatCurrency(orderData.pricing.finalPrice)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">VAT (7%)</span>
                    <span className="text-gray-400">
                      {formatCurrency(orderData.pricing.vatAmount)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white">ยอดชำระ</span>
                      <span className="text-2xl font-bold text-cyan-400">
                        {formatCurrency(orderData.pricing.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What happens next */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-300 mb-2">🚀 ขั้นตอนถัดไป</h3>
                <div className="space-y-2 text-xs text-blue-200">
                  <p>• ยืนยันการสั่งซื้อและการชำระเงิน</p>
                  <p>• ทีมงานเริ่มดำเนินงานภายใน 24 ชม.</p>
                  <p>• ติดตามความคืบหน้าในแดชบอร์ด</p>
                  <p>• รับผลงานตามกำหนด</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
