import { useState, useEffect } from 'react';
import { Mail, User, Calendar, Building, MessageSquare, Send, ArrowLeft, Clock, CheckCircle, X, RefreshCw, Paperclip, Download, FileText, Image } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  attachments?: string; // JSON string of attachment info
  created_at: string;
  updated_at: string;
}

interface AttachmentInfo {
  originalName: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  r2Key: string;
}

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Load contacts
  const loadContacts = async () => {
    try {
      console.log('🔄 Loading contacts from API...');
      setIsLoading(true);
      const response = await fetch('/api/contacts');
      console.log('📥 API Response status:', response.status);
      const data = await response.json();
      console.log('📄 API Response data:', data);
      if (data.contacts) {
        console.log('✅ Contacts loaded successfully:', data.contacts.length, 'contacts');
        
        // Check for new contacts since last load
        const previousContactIds = contacts.map(c => c.id);
        const newContacts = data.contacts.filter((contact: Contact) => !previousContactIds.includes(contact.id));
        
        if (newContacts.length > 0 && contacts.length > 0) {
          console.log('🆕 Found new contacts:', newContacts.length);
          showNotification('success', `พบข้อความติดต่อใหม่ ${newContacts.length} รายการ`);
          
          // Highlight newest contact for 10 seconds
          if (newContacts[0]) {
            setTimeout(() => {
              setSelectedContact(newContacts[0]);
            }, 1000);
          }
        }
        
        setContacts(data.contacts);
        setLastSyncTime(new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }));
      } else {
        console.warn('⚠️ No contacts found in response');
        setContacts([]);
        setLastSyncTime(new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }));
      }
    } catch (error) {
      console.error('❌ Failed to load contacts:', error);
      showNotification('error', 'ไม่สามารถโหลดรายชื่อผู้ติดต่อได้');
    } finally {
      setIsLoading(false);
    }
  };

  // Update contact status
  const updateContactStatus = async (contactId: number, status: string) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setContacts(prev => 
          prev.map(contact => 
            contact.id === contactId 
              ? { ...contact, status: status as Contact['status'], updated_at: new Date().toISOString() }
              : contact
          )
        );
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact(prev => prev ? { ...prev, status: status as Contact['status'] } : null);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Send reply email
  const sendReply = async () => {
    if (!selectedContact || !replyText.trim() || !replySubject.trim()) {
      showNotification('error', 'กรุณาใส่หัวข้อและข้อความตอบกลับ');
      return;
    }

    setIsReplying(true);
    console.log('🔄 Starting reply process for contact:', selectedContact.id);
    
    try {
      const requestBody = {
        contactId: selectedContact.id,
        to: selectedContact.email,
        subject: replySubject,
        message: replyText,
      };
      
      console.log('📤 Sending reply request:', requestBody);

      const response = await fetch('/api/contacts/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📄 Response data:', result);

      if (response.ok && result.success) {
        showNotification('success', result.details || 'ส่งอีเมลตอบกลับสำเร็จ');
        setReplyText('');
        setReplySubject(`Re: ข้อความจาก ${selectedContact.name} - DATA MODE`);
        updateContactStatus(selectedContact.id, 'replied');
        console.log('✅ Reply sent successfully, email ID:', result.emailId);
      } else {
        const errorMessage = result.details || result.error || 'ไม่สามารถส่งอีเมลได้';
        console.error('❌ Reply failed:', errorMessage);
        showNotification('error', errorMessage);
        
        // Show additional technical details if available
        if (result.resendError) {
          console.error('🔧 Resend API Error:', result.resendError);
        }
      }
    } catch (error) {
      console.error('💥 Reply error:', error);
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการส่งอีเมล';
      showNotification('error', `เกิดข้อผิดพลาด: ${errorMessage}`);
    } finally {
      setIsReplying(false);
    }
  };

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'new':
        return { color: 'bg-blue-600', icon: Mail, text: 'ใหม่' };
      case 'read':
        return { color: 'bg-yellow-600', icon: Clock, text: 'อ่านแล้ว' };
      case 'replied':
        return { color: 'bg-green-600', icon: CheckCircle, text: 'ตอบแล้ว' };
      case 'closed':
        return { color: 'bg-gray-600', icon: X, text: 'ปิด' };
      default:
        return { color: 'bg-gray-600', icon: Mail, text: status };
    }
  };

  // Parse attachments
  const parseAttachments = (attachmentsString?: string): AttachmentInfo[] => {
    if (!attachmentsString) return [];
    try {
      return JSON.parse(attachmentsString);
    } catch {
      return [];
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-400" />;
    }
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  // Download attachment
  const downloadAttachment = async (contactId: number, r2Key: string, originalName: string) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}/attachment?key=${encodeURIComponent(r2Key)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        showNotification('error', 'ไม่สามารถดาวน์โหลดไฟล์ได้');
      }
    } catch (error) {
      console.error('Download error:', error);
      showNotification('error', 'เกิดข้อผิดพลาดในการดาวน์โหลด');
    }
  };

  // Auto-set reply subject when contact is selected
  useEffect(() => {
    if (selectedContact && !replySubject) {
      setReplySubject(`Re: ข้อความจาก ${selectedContact.name} - DATA MODE`);
    }
  }, [selectedContact]);

  // Hard refresh function to force reload
  const hardRefresh = async () => {
    console.log('🔄 Hard refresh initiated...');
    setIsLoading(true);
    setContacts([]); // Clear current state
    setSelectedContact(null);
    
    try {
      // Add cache busting parameter
      const timestamp = Date.now();
      const response = await fetch(`/api/contacts?_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('🔄 Hard refresh response status:', response.status);
      const data = await response.json();
      console.log('🔄 Hard refresh data:', data);
      
      if (data.contacts) {
        setContacts(data.contacts);
        setLastSyncTime(new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }));
        showNotification('success', `รีเฟรชสำเร็จ! พบข้อมูลติดต่อ ${data.contacts.length} รายการ`);
      }
    } catch (error) {
      console.error('❌ Hard refresh failed:', error);
      showNotification('error', 'ไม่สามารถรีเฟรชข้อมูลได้');
    } finally {
      setIsLoading(false);
    }
  };

  // Load contacts on mount
  useEffect(() => {
    console.log('🚀 AdminDashboard mounted, loading contacts...');
    loadContacts();
    
    // Auto-refresh every 30 seconds (increased from 15s to reduce load)
    const autoRefreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing contacts...');
      loadContacts();
    }, 30000);
    
    return () => clearInterval(autoRefreshInterval);
  }, []);

  // Listen for new contact submissions from the frontend form
  useEffect(() => {
    const handleContactSubmitted = (event: CustomEvent) => {
      console.log('🔔 New contact submitted detected:', event.detail);
      console.log('🔄 Auto-refreshing admin dashboard...');
      loadContacts();
      showNotification('success', `มีข้อความติดต่อใหม่เข้าระบบ (ID: ${event.detail.contactId})`);
    };

    window.addEventListener('contactSubmitted', handleContactSubmitted as EventListener);
    
    return () => {
      window.removeEventListener('contactSubmitted', handleContactSubmitted as EventListener);
    };
  }, []);

  // Mark contact as read when selected
  useEffect(() => {
    if (selectedContact && selectedContact.status === 'new') {
      updateContactStatus(selectedContact.id, 'read');
    }
  }, [selectedContact]);

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
          <div className="flex items-center gap-4">
            {selectedContact && (
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {selectedContact ? 'ข้อความจากลูกค้า' : 'ระบบจัดการผู้ติดต่อ'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadContacts}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              รีเฟรชปกติ
            </button>
            <button
              onClick={hardRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50"
              title="รีเฟรชข้อมูลแบบ Force (ไม่ใช้ Cache)"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Force Refresh
            </button>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              title="อัพเดทข้อมูลทั้งหมด"
            >
              <RefreshCw size={16} />
              อัพเดทระบบ
            </button>
            <button
              onClick={() => {
                console.log('🔍 Debug: Current contacts state:', contacts);
                console.log('🔍 Debug: Local storage check');
                fetch('/api/contacts').then(r => r.json()).then(data => {
                  console.log('🔍 Debug: Fresh API call result:', data);
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Debug
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Contact List */}
        <div className={`${selectedContact ? 'w-1/3' : 'w-full'} border-r border-gray-800 transition-all duration-300`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">รายชื่อผู้ติดต่อ ({contacts.length})</h2>
                {lastSyncTime && (
                  <p className="text-sm text-gray-400 mt-1">
                    🔄 ซิงค์ล่าสุด: {lastSyncTime}
                  </p>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw size={32} className="animate-spin text-cyan-400" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Mail size={48} className="mx-auto mb-4" />
                <p>ยังไม่มีข้อความติดต่อ</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => {
                  const statusDisplay = getStatusDisplay(contact.status);
                  const StatusIcon = statusDisplay.icon;
                  
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        selectedContact?.id === contact.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : contact.status === 'new' 
                          ? 'border-blue-500 bg-blue-500/10 hover:border-blue-400 animate-pulse'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="font-semibold truncate">{contact.name}</span>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusDisplay.color} ${
                          contact.status === 'new' ? 'animate-pulse' : ''
                        }`}>
                          <StatusIcon size={12} />
                          <span>{statusDisplay.text}</span>
                          {contact.status === 'new' && (
                            <span className="ml-1 text-yellow-300">●</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                        <Mail size={12} />
                        <span className="truncate">{contact.email}</span>
                      </div>

                      {contact.company && (
                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                          <Building size={12} />
                          <span className="truncate">{contact.company}</span>
                        </div>
                      )}

                      <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                        {contact.message}
                      </p>

                      {/* Attachments indicator */}
                      {parseAttachments(contact.attachments).length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-blue-400 mb-2">
                          <Paperclip size={12} />
                          <span>{parseAttachments(contact.attachments).length} ไฟล์แนบ</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>{formatDate(contact.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Contact Detail & Reply */}
        {selectedContact && (
          <div className="flex-1 flex flex-col">
            {/* Contact Details */}
            <div className="p-6 border-b border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="text-cyan-400" />
                    {selectedContact.name}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail size={14} />
                      <span>{selectedContact.email}</span>
                    </div>
                    
                    {selectedContact.company && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Building size={14} />
                        <span>{selectedContact.company}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar size={14} />
                      <span>{formatDate(selectedContact.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">สถานะ:</label>
                  <select
                    value={selectedContact.status}
                    onChange={(e) => updateContactStatus(selectedContact.id, e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500"
                  >
                    <option value="new">ใหม่</option>
                    <option value="read">อ่านแล้ว</option>
                    <option value="replied">ตอบแล้ว</option>
                    <option value="closed">ปิด</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="mt-6">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="text-purple-400" />
                  ข้อความ:
                </h4>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              {/* Attachments */}
              {parseAttachments(selectedContact.attachments).length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Paperclip className="text-cyan-400" />
                    ไฟล์แนบ ({parseAttachments(selectedContact.attachments).length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {parseAttachments(selectedContact.attachments).map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {getFileIcon(attachment.contentType)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-white truncate" title={attachment.originalName}>
                              {attachment.originalName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadAttachment(selectedContact.id, attachment.r2Key, attachment.originalName)}
                          className="ml-3 p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded transition-colors flex-shrink-0"
                          title="ดาวน์โหลด"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reply Section */}
            <div className="flex-1 p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Send className="text-green-400" />
                ตอบกลับอีเมล:
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">หัวข้อ:</label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500"
                    placeholder="หัวข้ออีเมลตอบกลับ"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">ข้อความตอบกลับ:</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full h-64 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 resize-none"
                    placeholder="พิมพ์ข้อความตอบกลับที่นี่..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setReplyText('');
                      setReplySubject(`Re: ข้อความจาก ${selectedContact.name} - DATA MODE`);
                    }}
                    className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ล้างข้อความ
                  </button>
                  <button
                    onClick={sendReply}
                    disabled={isReplying || !replyText.trim() || !replySubject.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {isReplying ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                    {isReplying ? 'กำลังส่ง...' : 'ส่งอีเมล'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
