import { useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';

export default function AuthCallbackPage() {
  const { exchangeCodeForSessionToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        // Redirect to dashboard or home after successful authentication
        window.location.href = '/?section=dashboard';
      } catch (error) {
        console.error('Authentication callback error:', error);
        // Redirect to signup page on error
        window.location.href = '/?section=signup';
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">กำลังประมวลผล...</h2>
        <p className="text-gray-400">กรุณารอสักครู่ เรากำลังเข้าสู่ระบบ</p>
      </div>
    </div>
  );
}
