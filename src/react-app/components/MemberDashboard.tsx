import { useState, useEffect } from 'react';
import { 
  User, Package, ShoppingCart, FolderOpen, CreditCard, 
  Plus, Clock, CheckCircle, AlertCircle, 
  DollarSign, Activity
} from 'lucide-react';
import SystemUpdateButton from './SystemUpdateButton';

interface MemberDashboardProps {
  t: (key: string) => string;
  currentLang: 'th' | 'en';
  onNavigate: (section: string) => void;
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
}

interface Package {
  id: number;
  name: string;
  type: 'one_time' | 'monthly';
  status: 'active' | 'expired' | 'paused';
  endDate?: string;
  nextBilling?: string;
}

interface Order {
  id: number;
  orderNumber: string;
  packageName: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface Project {
  id: number;
  title: string;
  status: string;
  progress: number;
  createdAt: string;
  completedAt?: string;
}

export default function MemberDashboard({ t, onNavigate }: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize with empty user data - will be loaded after authentication check
  const [userData, setUserData] = useState<UserData>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    companyName: undefined
  });

  const [packages, setPackages] = useState<Package[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  const [projects, setProjects] = useState<Project[]>([]);

  // Function to load orders from backend API
  const loadOrders = async () => {
    try {
      console.log('🔄 Loading orders from backend API...');
      const response = await fetch('/api/user/1/orders'); // Mock user ID = 1
      
      if (!response.ok) {
        console.error('❌ Failed to fetch orders from backend');
        return;
      }
      
      const data = await response.json();
      console.log('📦 Orders from backend:', data);
      
      if (data.orders && Array.isArray(data.orders)) {
        const mappedOrders = data.orders.map((order: {
          id: number;
          order_number: string;
          package_name: string;
          amount: number;
          status: string;
          created_at: string;
        }) => ({
          id: order.id,
          orderNumber: order.order_number,
          packageName: order.package_name,
          amount: order.amount,
          status: order.status,
          createdAt: new Date(order.created_at).toISOString().split('T')[0]
        }));
        
        console.log('✅ Mapped orders:', mappedOrders);
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error('❌ Error loading orders from backend:', error);
      // Fallback: Try to load from localStorage if backend fails
      loadOrdersFromLocalStorage();
    }
  };

  // Fallback function to load orders from localStorage
  const loadOrdersFromLocalStorage = () => {
    try {
      console.log('🔄 Fallback: Loading orders from localStorage...');
      const currentOrderData = localStorage.getItem('currentOrderData');
      
      if (currentOrderData) {
        const orderData = JSON.parse(currentOrderData);
        const fallbackOrders = [{
          id: 1,
          orderNumber: orderData.orderNumber || `ORD-${Date.now()}`,
          packageName: orderData.package?.name || 'แพ็คเกจที่สั่งซื้อ',
          amount: orderData.pricing?.totalAmount || 0,
          status: orderData.status || 'confirmed',
          createdAt: orderData.timestamp ? new Date(orderData.timestamp).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }];
        
        console.log('✅ Fallback orders loaded:', fallbackOrders);
        setOrders(fallbackOrders);
      }
    } catch (error) {
      console.error('❌ Error loading fallback orders:', error);
    }
  };

  // Check authentication status
  const checkAuthentication = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      
      // First check if user is stored in localStorage (for demo/testing)
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('✅ Found stored user:', user);
        setUserData({
          id: user.id || 1,
          firstName: user.firstName || user.name || 'ผู้ใช้',
          lastName: user.lastName || '',
          email: user.email || 'user@example.com',
          companyName: user.companyName
        });
        setIsAuthenticated(true);
        return;
      }

      // Try to get user from Mocha auth system
      const response = await fetch('/api/users/me');
      if (response.ok) {
        const user = await response.json();
        console.log('✅ Authenticated user from API:', user);
        setUserData({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          companyName: user.companyName
        });
        setIsAuthenticated(true);
        return;
      }

      console.log('❌ No valid authentication found');
      setIsAuthenticated(false);
      
    } catch (error) {
      console.error('❌ Authentication check failed:', error);
      setIsAuthenticated(false);
    }
  };

  // Load user's data from backend
  const loadUserData = async (userId: number) => {
    try {
      // Load user packages
      const packagesResponse = await fetch(`/api/user/${userId}/packages`);
      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json();
        setPackages(packagesData.packages || []);
      }

      // Load user projects
      const projectsResponse = await fetch(`/api/user/${userId}/projects`);
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects || []);
      }

      // Load orders
      await loadOrders();
      
    } catch (error) {
      console.error('❌ Error loading user data:', error);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);
      
      // Check authentication first
      await checkAuthentication();
      
      setIsLoading(false);
    };

    initializeDashboard();
    
    // Listen for storage changes (when new orders are added)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentOrderData' || e.key === 'currentUser') {
        console.log('📢 Storage changed, reloading data...');
        if (e.key === 'currentUser') {
          checkAuthentication();
        } else {
          loadOrders();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from within the same tab
    const handleCustomRefresh = () => {
      console.log('📢 Custom refresh event received, reloading data...');
      loadOrders();
    };
    
    window.addEventListener('refreshDashboard', handleCustomRefresh);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('refreshDashboard', handleCustomRefresh);
    };
  }, []);

  // Load user data when authentication is confirmed
  useEffect(() => {
    if (isAuthenticated && userData.id) {
      loadUserData(userData.id);
    }
  }, [isAuthenticated, userData.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      case 'expired': return 'text-red-400';
      case 'paused': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">กำลังตรวจสอบสิทธิ์การเข้าใช้...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-400">ไม่สามารถเข้าใช้งานได้</h2>
          <p className="text-gray-300 mb-6">
            คุณต้องเข้าสู่ระบบก่อนเพื่อเข้าใช้แดชบอร์ดสมาชิก
          </p>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('signup')}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {t('dashboard-title')}
            </h1>
            <p className="text-gray-300 mt-2">
              {t('dashboard-welcome')}, {userData.firstName}{userData.lastName ? ' ' + userData.lastName : ''}
              {userData.companyName && (
                <span className="text-gray-400 text-sm block mt-1">
                  {userData.companyName}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SystemUpdateButton variant="default" />
            <button
              onClick={() => onNavigate('package-selection')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-gray-300 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5 opacity-50" />
              {t('order-package')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900/50 border-r border-gray-800 p-6">
          <nav className="space-y-2">
            {[
              { id: 'overview', icon: Activity, label: 'ภาพรวม' },
              { id: 'packages', icon: Package, label: t('dashboard-packages') },
              { id: 'orders', icon: ShoppingCart, label: t('dashboard-orders') },
              { id: 'projects', icon: FolderOpen, label: t('dashboard-projects') },
              { id: 'billing', icon: CreditCard, label: t('dashboard-billing') },
              { id: 'profile', icon: User, label: t('dashboard-profile') }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <item.icon className="w-5 h-5 opacity-50" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">แพ็คเกจที่ใช้งาน</p>
                      <p className="text-2xl font-bold text-cyan-400">{packages.filter(p => p.status === 'active').length}</p>
                    </div>
                    <Package className="w-8 h-8 text-cyan-400 opacity-50" />
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">โครงการ</p>
                      <p className="text-2xl font-bold text-purple-400">{projects.length}</p>
                    </div>
                    <FolderOpen className="w-8 h-8 text-purple-400 opacity-50" />
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">คำสั่งซื้อ</p>
                      <p className="text-2xl font-bold text-green-400">{orders.length}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-green-400 opacity-50" />
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">ยอดใช้จ่าย</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {formatCurrency(orders.reduce((sum, order) => sum + order.amount, 0))}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-yellow-400 opacity-50" />
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-cyan-400">โครงการล่าสุด</h3>
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.slice(0, 3).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-300">{project.title}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className={`flex items-center gap-1 ${getStatusColor(project.status)}`}>
                                <span className="opacity-50"><span className="opacity-50">{getStatusIcon(project.status)}</span></span>
                                <span className="text-sm">{project.status}</span>
                              </div>
                              <span className="text-gray-400 text-sm">•</span>
                              <span className="text-gray-400 text-sm">{project.progress}%</span>
                            </div>
                          </div>
                          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">{t('no-projects')}</p>
                  )}
                </div>

                {/* Active Packages */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-purple-400">แพ็คเกจที่ใช้งาน</h3>
                  {packages.filter(p => p.status === 'active').length > 0 ? (
                    <div className="space-y-4">
                      {packages.filter(p => p.status === 'active').map((pkg) => (
                        <div key={pkg.id} className="p-4 bg-gray-900/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-300">{pkg.name}</p>
                            <div className={`flex items-center gap-1 ${getStatusColor(pkg.status)}`}>
                              <span className="opacity-50">{getStatusIcon(pkg.status)}</span>
                              <span className="text-sm">{pkg.status}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>ประเภท: {pkg.type === 'monthly' ? 'รายเดือน' : 'โครงการเดียว'}</span>
                            {pkg.nextBilling && (
                              <>
                                <span>•</span>
                                <span>ต่ออายุ: {formatDate(pkg.nextBilling)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">{t('no-packages')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-cyan-400">{t('dashboard-packages')}</h2>
              {packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-300">{pkg.name}</h3>
                        <div className={`flex items-center gap-1 ${getStatusColor(pkg.status)}`}>
                          {getStatusIcon(pkg.status)}
                          <span className="text-sm">{pkg.status}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-400">ประเภท: {pkg.type === 'monthly' ? 'รายเดือน' : 'โครงการเดียว'}</p>
                        {pkg.endDate && (
                          <p className="text-gray-400">สิ้นสุด: {formatDate(pkg.endDate)}</p>
                        )}
                        {pkg.nextBilling && (
                          <p className="text-gray-400">ต่ออายุ: {formatDate(pkg.nextBilling)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-400 mb-6">{t('no-packages')}</p>
                  <button
                    onClick={() => onNavigate('package-selection')}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    {t('order-package')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-cyan-400">{t('dashboard-orders')}</h2>
              {orders.length > 0 ? (
                <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-gray-400 font-medium">หมายเลขคำสั่งซื้อ</th>
                          <th className="px-6 py-4 text-left text-gray-400 font-medium">แพ็คเกจ</th>
                          <th className="px-6 py-4 text-left text-gray-400 font-medium">จำนวนเงิน</th>
                          <th className="px-6 py-4 text-left text-gray-400 font-medium">สถานะ</th>
                          <th className="px-6 py-4 text-left text-gray-400 font-medium">วันที่</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-t border-gray-700">
                            <td className="px-6 py-4 text-gray-300 font-medium">{order.orderNumber}</td>
                            <td className="px-6 py-4 text-gray-300">{order.packageName}</td>
                            <td className="px-6 py-4 text-green-400 font-medium">{formatCurrency(order.amount)}</td>
                            <td className="px-6 py-4">
                              <div className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                <span className="opacity-50">{getStatusIcon(order.status)}</span>
                                <span className="text-sm">{order.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-400">{formatDate(order.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-400">{t('no-orders')}</p>
                </div>
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-cyan-400">{t('dashboard-projects')}</h2>
              {projects.length > 0 ? (
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-300">{project.title}</h3>
                        <div className={`flex items-center gap-1 ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          <span className="text-sm">{project.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">ความคืบหน้า</span>
                            <span className="text-cyan-400 font-medium">{project.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>เริ่ม: {formatDate(project.createdAt)}</span>
                        {project.completedAt && (
                          <>
                            <span>•</span>
                            <span>เสร็จ: {formatDate(project.completedAt)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-400">{t('no-projects')}</p>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-cyan-400">{t('dashboard-profile')}</h2>
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">ชื่อ</label>
                    <input
                      type="text"
                      value={userData.firstName}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">นามสกุล</label>
                    <input
                      type="text"
                      value={userData.lastName}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-gray-300">อีเมล</label>
                    <input
                      type="email"
                      value={userData.email}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  {userData.companyName && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-gray-300">ชื่อบริษัท</label>
                      <input
                        type="text"
                        value={userData.companyName}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        readOnly
                      />
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-gray-300 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    แก้ไขข้อมูล
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
