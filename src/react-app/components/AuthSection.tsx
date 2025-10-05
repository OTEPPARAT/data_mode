import { useState } from 'react';
import { User, Mail, Lock, Phone, Building, MapPin, FileText, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';

interface AuthSectionProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate: (section: string) => void;
}

export default function AuthSection({ t, onNavigate }: AuthSectionProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { redirectToLogin } = useAuth();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    companyAddress: '',
    taxId: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Bypass authentication for testing - allow any email/password
      if (loginForm.email && loginForm.password) {
        // Mock successful login - store user data
        const mockUser = {
          id: 1,
          email: loginForm.email,
          firstName: 'สมาชิก',
          lastName: 'ทดสอบ',
          companyName: 'บริษัททดสอบ จำกัด'
        };
        
        console.log('🧪 Mock login successful, storing user data:', mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Verify storage immediately
        const storedUser = localStorage.getItem('currentUser');
        const storedLogin = localStorage.getItem('isLoggedIn');
        console.log('📝 Verification after mock login storage:', {
          storedUser: !!storedUser,
          storedLogin: storedLogin,
          userDataLength: storedUser?.length || 0
        });
        
        // Check if user was in the middle of ordering
        const currentOrderData = localStorage.getItem('currentOrderData');
        if (currentOrderData) {
          console.log('🛒 Mock user has pending order, redirecting to payment');
          alert(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${mockUser.firstName}\nกำลังนำคุณกลับไปยังหน้าชำระเงิน`);
          // Longer delay to ensure localStorage is properly set
          setTimeout(() => {
            onNavigate('payment');
          }, 300);
        } else {
          console.log('👤 Mock user without pending order, redirecting to dashboard');
          alert(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${mockUser.firstName}`);
          setTimeout(() => {
            onNavigate('dashboard');
          }, 300);
        }
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const result = await response.json();

      if (result.success) {
        // Store user data properly with detailed logging
        console.log('✅ Login successful, storing user data:', result.user);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Verify storage immediately
        const storedUser = localStorage.getItem('currentUser');
        const storedLogin = localStorage.getItem('isLoggedIn');
        console.log('📝 Verification after storage:', {
          storedUser: !!storedUser,
          storedLogin: storedLogin,
          userDataLength: storedUser?.length || 0
        });
        
        // Check if user was in the middle of ordering
        const currentOrderData = localStorage.getItem('currentOrderData');
        if (currentOrderData) {
          console.log('🛒 User has pending order, redirecting to payment');
          alert(`เข้าสู่ระบบสำเร็จ! หมายเลขสมาชิก: ${result.user.memberId}\nกำลังนำคุณกลับไปยังหน้าชำระเงิน`);
          // Small delay to ensure localStorage is properly set
          setTimeout(() => {
            onNavigate('payment');
          }, 100);
        } else {
          console.log('👤 No pending order, redirecting to dashboard');
          alert(`เข้าสู่ระบบสำเร็จ! หมายเลขสมาชิก: ${result.user.memberId}`);
          setTimeout(() => {
            onNavigate('dashboard');
          }, 100);
        }
      } else {
        alert(result.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (signupForm.password !== signupForm.confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน');
      setIsLoading(false);
      return;
    }

    try {
      // Bypass authentication for testing - allow any valid signup data
      if (signupForm.email && signupForm.firstName && signupForm.lastName && signupForm.password) {
        // Mock successful signup - store user data
        const mockMemberId = `DM${Date.now().toString().slice(-8)}`;
        const mockUser = {
          id: Date.now(),
          email: signupForm.email,
          firstName: signupForm.firstName,
          lastName: signupForm.lastName,
          companyName: signupForm.companyName,
          memberId: mockMemberId
        };
        
        console.log('🧪 Mock signup successful, storing user data:', mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Verify storage immediately
        const storedUser = localStorage.getItem('currentUser');
        const storedLogin = localStorage.getItem('isLoggedIn');
        console.log('📝 Verification after mock signup storage:', {
          storedUser: !!storedUser,
          storedLogin: storedLogin,
          userDataLength: storedUser?.length || 0
        });
        
        // Check if user was in the middle of ordering
        const currentOrderData = localStorage.getItem('currentOrderData');
        if (currentOrderData) {
          console.log('🛒 Mock signup user has pending order, redirecting to payment');
          alert(`สมัครสมาชิกสำเร็จ! หมายเลขสมาชิก: ${mockMemberId}\nยินดีต้อนรับ ${mockUser.firstName}\nกำลังนำคุณกลับไปยังหน้าชำระเงิน`);
          // Small delay to ensure localStorage is properly set
          setTimeout(() => {
            onNavigate('payment');
          }, 100);
        } else {
          console.log('👤 Mock signup user without pending order, redirecting to dashboard');
          alert(`สมัครสมาชิกสำเร็จ! หมายเลขสมาชิก: ${mockMemberId} ยินดีต้อนรับ ${mockUser.firstName}`);
          setTimeout(() => {
            onNavigate('dashboard');
          }, 100);
        }
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupForm),
      });

      const result = await response.json();

      if (result.success) {
        // Store user data properly with detailed logging 
        const newUser = {
          id: result.userId,
          email: signupForm.email,
          firstName: signupForm.firstName,
          lastName: signupForm.lastName,
          companyName: signupForm.companyName,
          memberId: result.memberId
        };
        
        console.log('✅ Signup successful, storing user data:', newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Verify storage immediately
        const storedUser = localStorage.getItem('currentUser');
        const storedLogin = localStorage.getItem('isLoggedIn');
        console.log('📝 Verification after signup storage:', {
          storedUser: !!storedUser,
          storedLogin: storedLogin,
          userDataLength: storedUser?.length || 0
        });
        
        // Check if user was in the middle of ordering
        const currentOrderData = localStorage.getItem('currentOrderData');
        if (currentOrderData) {
          console.log('🛒 New user has pending order, redirecting to payment');
          alert(`สมัครสมาชิกสำเร็จ! หมายเลขสมาชิกของคุณคือ: ${result.memberId}\nกำลังนำคุณกลับไปยังหน้าชำระเงิน`);
          // Small delay to ensure localStorage is properly set
          setTimeout(() => {
            onNavigate('payment');
          }, 100);
        } else {
          console.log('👤 New user without pending order, redirecting to dashboard');
          alert(`สมัครสมาชิกสำเร็จ! หมายเลขสมาชิกของคุณคือ: ${result.memberId}`);
          setTimeout(() => {
            onNavigate('dashboard');
          }, 100);
        }
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      await redirectToLogin();
    } catch (error) {
      console.error('Google auth error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 px-6 min-h-screen flex items-center justify-center">
      <div className="container mx-auto max-w-lg">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {isLogin ? t('login-title') : t('signup-title')}
              </span>
            </h2>
            <p className="text-gray-300">
              {isLogin ? t('login-subtitle') : t('signup-subtitle')}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex mb-8 bg-gray-900/50 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                isLogin 
                  ? 'bg-transparent border-2 border-white text-white/80 font-thin shadow-lg shadow-white/30' 
                  : 'text-gray-400/80 font-thin hover:text-white'
              }`}
            >
              {t('btn-login')}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                !isLogin 
                  ? 'bg-transparent border-2 border-white text-white/80 font-thin shadow-lg shadow-white/30' 
                  : 'text-gray-400/80 font-thin hover:text-white'
              }`}
            >
              {t('btn-signup')}
            </button>
          </div>

          {/* Demo Access Button - For Testing */}
          <button
            onClick={() => {
              // Create demo user for testing
              const demoUser = {
                id: 999,
                email: 'demo@datamode.com',
                firstName: 'Demo',
                lastName: 'User',
                companyName: 'บริษัท Demo จำกัด',
                memberId: 'DM99999999'
              };
              
              console.log('🎮 Demo login, storing user data:', demoUser);
              localStorage.setItem('currentUser', JSON.stringify(demoUser));
              localStorage.setItem('isLoggedIn', 'true');
              
              // Verify storage immediately
              const storedUser = localStorage.getItem('currentUser');
              const storedLogin = localStorage.getItem('isLoggedIn');
              console.log('📝 Verification after demo login storage:', {
                storedUser: !!storedUser,
                storedLogin: storedLogin,
                userDataLength: storedUser?.length || 0
              });
              
              // Check if user was in the middle of ordering
              const currentOrderData = localStorage.getItem('currentOrderData');
              if (currentOrderData) {
                console.log('🛒 Demo user has pending order, redirecting to payment');
                alert('เข้าสู่ระบบสำเร็จ! (โหมดทดสอบ)\nกำลังนำคุณกลับไปยังหน้าชำระเงิน');
                // Small delay to ensure localStorage is properly set
                setTimeout(() => {
                  onNavigate('payment');
                }, 100);
              } else {
                console.log('👤 Demo user without pending order, redirecting to dashboard');
                alert('เข้าสู่ระบบสำเร็จ! (โหมดทดสอบ)');
                setTimeout(() => {
                  onNavigate('dashboard');
                }, 100);
              }
            }}
            className="w-full mb-4 py-3 px-4 bg-transparent border-2 border-white text-white/80 font-thin rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg shadow-white/30 hover:bg-white/10 hover:shadow-white/50"
          >
            <span>เข้าใช้งานระบบ (โหมดทดสอบ)</span>
          </button>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full mb-6 py-3 px-4 bg-white hover:bg-gray-50 text-gray-900/80 font-thin rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>
              {isLogin ? 
                (isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google') : 
                (isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิกด้วย Google')
              }
            </span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-gray-400">หรือ</span>
            </div>
          </div>

          {/* Login Form */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  อีเมลหรือหมายเลขโทรศัพท์
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    placeholder="example@email.com หรือ 081-234-5678"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-300 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  {t('form-password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-transparent border-2 border-white text-white/80 font-thin rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-white/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-white/30 hover:bg-white/10"
              >
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : t('btn-login')}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {!isLogin && (
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t('form-first-name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={signupForm.firstName}
                      onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-300"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t('form-last-name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={signupForm.lastName}
                      onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-300"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  {t('form-email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  {t('form-phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t('form-password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                      className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t('form-confirm-password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                      className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="border-t border-gray-600 pt-6">
                <h3 className="text-lg font-medium mb-4 text-cyan-400">ข้อมูลบริษัท (ถ้ามี)</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    {t('form-company-name')}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={signupForm.companyName}
                      onChange={(e) => setSignupForm({...signupForm, companyName: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t('form-company-address')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      value={signupForm.companyAddress}
                      onChange={(e) => setSignupForm({...signupForm, companyAddress: e.target.value})}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-300 resize-none"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t('form-tax-id')}
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={signupForm.taxId}
                      onChange={(e) => setSignupForm({...signupForm, taxId: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-transparent border-2 border-white text-white/80 font-thin rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-white/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-white/30 hover:bg-white/10"
              >
                {isLoading ? 'กำลังสมัครสมาชิก...' : t('btn-signup')}
              </button>
            </form>
          )}

          {/* Toggle Link */}
          <div className="mt-6 text-center text-gray-400">
            {isLogin ? (
              <p>
                {t('not-member')}{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {t('click-signup')}
                </button>
              </p>
            ) : (
              <p>
                {t('already-member')}{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {t('click-login')}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
