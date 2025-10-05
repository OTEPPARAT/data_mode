import { useState, useEffect } from 'react';
import { 
  Package, User, Calendar, Mail, Building, 
  Clock, CheckCircle, AlertCircle, ExternalLink,
  X, RefreshCw, Search, DollarSign, Truck
} from 'lucide-react';

interface Order {
  id: number;
  order_number: string;
  order_type: string;
  status: string;
  amount: number;
  project_title: string;
  project_description: string;
  requirements?: string;
  deadline_date?: string;
  created_at: string;
  updated_at: string;
  // User information
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  user_company_name?: string;
  user_phone?: string;
  // Package information
  package_name: string;
  // Project information
  project_id: number;
  project_status: string;
  progress_percentage: number;
  delivered_at?: string;
  result_files?: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deliveryLink, setDeliveryLink] = useState('');
  const [isDelivering, setIsDelivering] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Load orders
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders/all');
      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
        // Update selectedOrder if it exists
        if (selectedOrder) {
          const updatedOrder = data.orders.find((order: Order) => order.id === selectedOrder.id);
          if (updatedOrder) {
            setSelectedOrder(updatedOrder);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      showNotification('error', 'ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้');
    } finally {
      setIsLoading(false);
    }
  };

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: 'bg-yellow-600', icon: Clock, text: 'รอดำเนินการ' };
      case 'paid':
        return { color: 'bg-green-600', icon: CheckCircle, text: 'ชำระแล้ว' };
      case 'processing':
        return { color: 'bg-blue-600', icon: RefreshCw, text: 'กำลังดำเนินการ' };
      case 'in_progress':
        return { color: 'bg-blue-600', icon: RefreshCw, text: 'กำลังดำเนินการ' };
      case 'completed':
        return { color: 'bg-purple-600', icon: CheckCircle, text: 'เสร็จสิ้น' };
      case 'delivered':
        return { color: 'bg-green-700', icon: Truck, text: 'ส่งมอบแล้ว' };
      case 'cancelled':
        return { color: 'bg-red-600', icon: X, text: 'ยกเลิก' };
      default:
        return { color: 'bg-gray-600', icon: AlertCircle, text: status };
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        showNotification('success', `อัพเดทสถานะคำสั่งซื้อเป็น "${getStatusDisplay(status).text}" แล้ว`);
        loadOrders(); // Refresh orders
      } else {
        showNotification('error', 'ไม่สามารถอัพเดทสถานะได้');
      }
    } catch (error) {
      console.error('Update order status error:', error);
      showNotification('error', 'เกิดข้อผิดพลาดในการอัพเดทสถานะ');
    }
  };

  // Update project status
  const updateProjectStatus = async (projectId: number, status: string, progressPercentage?: number) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status, 
          progressPercentage: progressPercentage || (status === 'completed' ? 100 : undefined)
        }),
      });

      if (response.ok) {
        showNotification('success', `อัพเดทสถานะโครงการเป็น "${getStatusDisplay(status).text}" แล้ว`);
        loadOrders(); // Refresh orders
      } else {
        showNotification('error', 'ไม่สามารถอัพเดทสถานะได้');
      }
    } catch (error) {
      console.error('Update project status error:', error);
      showNotification('error', 'เกิดข้อผิดพลาดในการอัพเดทสถานะ');
    }
  };

  // Update progress percentage only
  const updateProgressPercentage = async (projectId: number, progressPercentage: number) => {
    if (progressPercentage < 0 || progressPercentage > 100) {
      showNotification('error', 'เปอร์เซ็นต์ความคืบหน้าต้องอยู่ระหว่าง 0-100');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: selectedOrder?.project_status,
          progressPercentage
        }),
      });

      if (response.ok) {
        // Update local state immediately for better UX
        if (selectedOrder) {
          setSelectedOrder({
            ...selectedOrder,
            progress_percentage: progressPercentage
          });
          setOrders(orders.map(order => 
            order.id === selectedOrder.id 
              ? { ...order, progress_percentage: progressPercentage }
              : order
          ));
        }
        showNotification('success', `อัพเดทความคืบหน้าเป็น ${progressPercentage}% แล้ว`);
      } else {
        showNotification('error', 'ไม่สามารถอัพเดทความคืบหน้าได้');
      }
    } catch (error) {
      console.error('Update progress error:', error);
      showNotification('error', 'เกิดข้อผิดพลาดในการอัพเดทความคืบหน้า');
    }
  };

  // Deliver project
  const deliverProject = async () => {
    if (!selectedOrder || !deliveryLink.trim()) {
      showNotification('error', 'กรุณาใส่ลิงค์งานส่งมอบ');
      return;
    }

    setIsDelivering(true);
    try {
      const response = await fetch(`/api/projects/${selectedOrder.project_id}/deliver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryLink: deliveryLink,
          deliveredAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        showNotification('success', 'ส่งมอบงานเรียบร้อยแล้ว');
        setDeliveryLink('');
        setSelectedOrder(null);
        loadOrders(); // Refresh orders
      } else {
        showNotification('error', 'ไม่สามารถส่งมอบงานได้');
      }
    } catch (error) {
      console.error('Delivery error:', error);
      showNotification('error', 'เกิดข้อผิดพลาดในการส่งมอบงาน');
    } finally {
      setIsDelivering(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user_company_name && order.user_company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter || order.project_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              บริหารคำสั่งซื้อ
            </h1>
            <p className="text-gray-300 mt-2">จัดการคำสั่งซื้อและการส่งมอบงานทั้งหมด</p>
          </div>
          <button
            onClick={loadOrders}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            รีเฟรช
          </button>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Orders List */}
        <div className={`${selectedOrder ? 'w-2/3' : 'w-full'} border-r border-gray-800 transition-all duration-300`}>
          <div className="p-6">
            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="ค้นหาคำสั่งซื้อ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="pending">รอดำเนินการ</option>
                  <option value="paid">ชำระแล้ว</option>
                  <option value="processing">กำลังดำเนินการ</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="delivered">ส่งมอบแล้ว</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>
              <p className="text-sm text-gray-400">
                พบ {filteredOrders.length} คำสั่งซื้อจากทั้งหมด {orders.length} รายการ
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw size={32} className="animate-spin text-cyan-400" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Package size={48} className="mx-auto mb-4" />
                <p>ไม่พบคำสั่งซื้อ</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const orderStatusDisplay = getStatusDisplay(order.status);
                  const projectStatusDisplay = getStatusDisplay(order.project_status);
                  const OrderStatusIcon = orderStatusDisplay.icon;
                  const ProjectStatusIcon = projectStatusDisplay.icon;
                  
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        selectedOrder?.id === order.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-cyan-400">{order.order_number}</h3>
                          <p className="text-sm text-gray-300 mt-1">{order.project_title}</p>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs mb-1 ${orderStatusDisplay.color}`}>
                            <OrderStatusIcon size={12} />
                            <span>{orderStatusDisplay.text}</span>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${projectStatusDisplay.color}`}>
                            <ProjectStatusIcon size={12} />
                            <span>{projectStatusDisplay.text}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <User size={12} />
                            <span>{order.user_first_name} {order.user_last_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Mail size={12} />
                            <span>{order.user_email}</span>
                          </div>
                          {order.user_company_name && (
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                              <Building size={12} />
                              <span>{order.user_company_name}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <DollarSign size={12} />
                            <span>{formatCurrency(order.amount)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Package size={12} />
                            <span>{order.package_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar size={12} />
                            <span>{formatDate(order.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">ความคืบหน้า</span>
                          <span className="text-xs text-cyan-400">{order.progress_percentage}%</span>
                        </div>
                        <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                            style={{ width: `${order.progress_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Order Detail & Delivery */}
        {selectedOrder && (
          <div className="w-1/3 flex flex-col">
            {/* Order Details */}
            <div className="p-6 border-b border-gray-800 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-cyan-400">รายละเอียดคำสั่งซื้อ</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Order Info */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-purple-400">ข้อมูลคำสั่งซื้อ</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>หมายเลขคำสั่งซื้อ:</strong> {selectedOrder.order_number}</div>
                    <div><strong>ประเภท:</strong> {selectedOrder.order_type === 'one_time' ? 'โครงการเดียว' : 'รายเดือน'}</div>
                    <div><strong>จำนวนเงิน:</strong> <span className="text-green-400">{formatCurrency(selectedOrder.amount)}</span></div>
                    <div><strong>แพ็คเกจ:</strong> {selectedOrder.package_name}</div>
                    <div className="flex items-center gap-2">
                      <strong>สถานะคำสั่งซื้อ:</strong>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                        className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs focus:outline-none focus:border-cyan-500"
                      >
                        <option value="pending">รอดำเนินการ</option>
                        <option value="paid">ชำระแล้ว</option>
                        <option value="processing">กำลังดำเนินการ</option>
                        <option value="completed">เสร็จสิ้น</option>
                        <option value="cancelled">ยกเลิก</option>
                      </select>
                    </div>
                    <div><strong>สร้างเมื่อ:</strong> {formatDate(selectedOrder.created_at)}</div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-cyan-400">ข้อมูลลูกค้า</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>ชื่อ:</strong> {selectedOrder.user_first_name} {selectedOrder.user_last_name}</div>
                    <div><strong>อีเมล:</strong> {selectedOrder.user_email}</div>
                    {selectedOrder.user_phone && <div><strong>โทรศัพท์:</strong> {selectedOrder.user_phone}</div>}
                    {selectedOrder.user_company_name && <div><strong>บริษัท:</strong> {selectedOrder.user_company_name}</div>}
                  </div>
                </div>

                {/* Project Info */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-green-400">ข้อมูลโครงการ</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>ชื่อโครงการ:</strong> {selectedOrder.project_title}</div>
                    <div><strong>รายละเอียด:</strong></div>
                    <div className="bg-gray-700 p-3 rounded text-gray-300 whitespace-pre-wrap">
                      {selectedOrder.project_description}
                    </div>
                    {selectedOrder.requirements && (
                      <>
                        <div><strong>ความต้องการเพิ่มเติม:</strong></div>
                        <div className="bg-gray-700 p-3 rounded text-gray-300 whitespace-pre-wrap">
                          {selectedOrder.requirements}
                        </div>
                      </>
                    )}
                    {selectedOrder.deadline_date && (
                      <div><strong>วันที่ต้องการผลลัพธ์:</strong> {formatDate(selectedOrder.deadline_date)}</div>
                    )}
                    <div className="flex items-center gap-2">
                      <strong>ความคืบหน้า:</strong>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={selectedOrder.progress_percentage}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            updateProgressPercentage(selectedOrder.project_id, value);
                          }
                        }}
                        onBlur={(e) => {
                          const value = parseInt(e.target.value);
                          if (isNaN(value) || value < 0 || value > 100) {
                            // Reset to current value if invalid
                            if (selectedOrder) {
                              setSelectedOrder({
                                ...selectedOrder,
                                progress_percentage: selectedOrder.progress_percentage
                              });
                            }
                          }
                        }}
                        className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <span className="text-cyan-400">%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>สถานะโครงการ:</strong>
                      <select
                        value={selectedOrder.project_status}
                        onChange={(e) => updateProjectStatus(selectedOrder.project_id, e.target.value)}
                        className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs focus:outline-none focus:border-cyan-500"
                      >
                        <option value="pending">รอดำเนินการ</option>
                        <option value="in_progress">กำลังดำเนินการ</option>
                        <option value="review">ตรวจสอบ</option>
                        <option value="completed">เสร็จสิ้น</option>
                        <option value="delivered">ส่งมอบแล้ว</option>
                        <option value="cancelled">ยกเลิก</option>
                      </select>
                    </div>
                    {selectedOrder.delivered_at && (
                      <div><strong>ส่งมอบเมื่อ:</strong> {formatDate(selectedOrder.delivered_at)}</div>
                    )}
                  </div>
                </div>

                {/* Delivery Info */}
                {selectedOrder.result_files && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-yellow-400">งานส่งมอบ</h4>
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <ExternalLink size={16} className="text-cyan-400" />
                        <a 
                          href={selectedOrder.result_files} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline"
                        >
                          ดูงานส่งมอบ
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Section */}
            {selectedOrder.project_status !== 'delivered' && (
              <div className="p-6 border-t border-gray-800">
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-green-400">
                  <Truck size={20} />
                  ส่งมอบงาน
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">ลิงค์งานส่งมอบ:</label>
                    <input
                      type="url"
                      value={deliveryLink}
                      onChange={(e) => setDeliveryLink(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500"
                      placeholder="https://..."
                    />
                  </div>

                  <button
                    onClick={deliverProject}
                    disabled={isDelivering || !deliveryLink.trim()}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {isDelivering ? <RefreshCw size={16} className="animate-spin" /> : <Truck size={16} />}
                    {isDelivering ? 'กำลังส่งมอบ...' : 'ส่งมอบงานเสร็จสิ้น'}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    วันที่ส่งมอบจะถูกบันทึกอัตโนมัติเมื่อกดปุ่มส่งมอบ
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
