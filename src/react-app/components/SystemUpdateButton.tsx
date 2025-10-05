import { RefreshCw } from 'lucide-react';

interface SystemUpdateButtonProps {
  variant?: 'default' | 'small' | 'large';
  className?: string;
  showText?: boolean;
}

export default function SystemUpdateButton({ 
  variant = 'default', 
  className = '',
  showText = true 
}: SystemUpdateButtonProps) {
  const handleUpdate = () => {
    // Clear all localStorage cache
    const keysToKeep = ['selectedPackage', 'projectData', 'currentOrderData', 'isLoggedIn', 'currentUser'];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Clear session storage
    sessionStorage.clear();
    
    // Force reload to get fresh data
    window.location.reload();
  };

  const baseClasses = "flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg saturate-150 border border-white/20 hover:border-green-400/40 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-black/20 hover:shadow-green-500/20";
  
  const variantClasses = {
    small: "px-3 py-2 text-sm",
    default: "px-4 py-2",
    large: "px-6 py-3 text-lg"
  };

  const iconSizes = {
    small: 14,
    default: 16,
    large: 20
  };

  return (
    <button
      onClick={handleUpdate}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      title="อัพเดทข้อมูลและล้าง Cache ทั้งหมด"
    >
      <RefreshCw size={iconSizes[variant]} className="opacity-50" />
      {showText && (
        <span>
          {variant === 'small' ? 'อัพเดท' : 'อัพเดทระบบ'}
        </span>
      )}
    </button>
  );
}
