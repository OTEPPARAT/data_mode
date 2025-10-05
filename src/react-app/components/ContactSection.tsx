import { useState, useRef } from 'react';
import { MapPin, Mail, Phone, Upload, X, FileText, Image } from 'lucide-react';
import SystemUpdateButton from './SystemUpdateButton';

interface ContactSectionProps {
  t: (key: string) => string;
}

export default function ContactSection({ t }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    console.log('🚀 Starting form submission process...');
    console.log('📝 Form data before submission:', formData);

    // Validation checks
    if (!formData.name.trim()) {
      console.error('❌ Name is required');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      console.error('❌ Email is required');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    if (!formData.message.trim()) {
      console.error('❌ Message is required');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('📤 Submitting contact form data:', formData);
      console.log('📎 Attached files:', attachedFiles.length);
      console.log('📤 Timestamp:', new Date().toISOString());
      console.log('📤 Current URL:', window.location.href);
      
      // Force absolute URL to avoid any routing issues
      const apiUrl = `${window.location.origin}/api/contacts`;
      console.log('📤 API URL:', apiUrl);
      
      // Prepare form data with files
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('email', formData.email);
      submitFormData.append('company', formData.company || '');
      submitFormData.append('message', formData.message);
      
      // Add files if any
      attachedFiles.forEach((file, index) => {
        submitFormData.append(`attachment_${index}`, file);
      });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: submitFormData,
      });

      console.log('📥 Contact form response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('📄 Raw response text:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('📄 Parsed response result:', result);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        console.error('❌ Response text:', responseText);
        throw new Error('Invalid response format from server');
      }

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });
        setAttachedFiles([]);
        console.log('✅ Contact form submitted successfully, ID:', result.contactId);
        
        // Trigger a custom event to notify admin dashboard to refresh
        window.dispatchEvent(new CustomEvent('contactSubmitted', { 
          detail: { contactId: result.contactId, timestamp: new Date().toISOString() }
        }));
        
        // Show success message for 8 seconds
        setTimeout(() => setSubmitStatus('idle'), 8000);
      } else {
        setSubmitStatus('error');
        console.error('❌ Contact form submit error:', result.error || 'Unknown error');
        console.error('❌ Full response:', result);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('💥 Contact form submit error:', error);
      console.error('💥 Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Form submission process completed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      // Allow images, documents, and common file types
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'text/csv'
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB limit
      
      if (!allowedTypes.includes(file.type)) {
        alert(`ไฟล์ ${file.name} ไม่รองรับ กรุณาเลือกไฟล์รูปภาพหรือเอกสาร`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (สูงสุด 10MB)`);
        return false;
      }
      
      return true;
    });

    // Add new files to existing ones, but limit total to 5 files
    const totalFiles = [...attachedFiles, ...validFiles];
    if (totalFiles.length > 5) {
      alert('สามารถแนบไฟล์ได้สูงสุด 5 ไฟล์');
      setAttachedFiles(totalFiles.slice(0, 5));
    } else {
      setAttachedFiles(totalFiles);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-400" />;
    }
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 right-0">
            <SystemUpdateButton variant="small" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {t('contact-title')}
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('contact-subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                ค้นพบพลังของข้อมูลที่จะยกระดับธุรกิจของคุณ
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                <strong className="font-black">DATA MODE</strong> พร้อมช่วยคุณค้นหาและวิเคราะห์ข้อมูลด้วย Super AI Agent ที่ล้ำสมัยที่สุด เพื่อให้คุณตัดสินใจธุรกิจได้อย่างมั่นใจ
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-white">ที่อยู่</h4>
                  <p className="text-gray-300">{t('contact-address')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-white">อีเมล</h4>
                  <a 
                    href={`mailto:${t('contact-email')}`}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {t('contact-email')}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-white">โทรศัพท์</h4>
                  <a 
                    href={`tel:${t('contact-phone')}`}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {t('contact-phone')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">
                  {t('form-name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
                  {t('form-email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2 text-white">
                  {t('form-company')}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
                  {t('form-message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-vertical text-white"
                  required
                />
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-3 text-white">
                  ไฟล์แนบ (ไม่บังคับ)
                </label>
                
                {/* File Upload Button */}
                <div className="mb-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-white/30 backdrop-blur-lg saturate-150 hover:bg-white/30 border-2 border-dashed border-white/20 hover:border-cyan-400/40 rounded-lg transition-all duration-300 text-white shadow-lg shadow-black/20 hover:shadow-cyan-500/20"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">เลือกไฟล์ที่ต้องการแนบ</span>
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    รองรับ: รูปภาพ, PDF, Word, Excel, TXT (สูงสุด 10MB ต่อไฟล์, 5 ไฟล์)
                  </p>
                </div>

                {/* Attached Files List */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">
                      ไฟล์ที่แนบ ({attachedFiles.length}/5):
                    </h4>
                    <div className="space-y-2">
                      {attachedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {getFileIcon(file)}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-white truncate" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-3 p-1 text-red-400 hover:text-red-300 bg-white/5 hover:bg-white/15 backdrop-blur-lg saturate-150 border border-white/10 hover:border-red-400/40 rounded transition-all duration-300 flex-shrink-0 shadow-lg shadow-black/20 hover:shadow-red-500/20"
                            title="ลบไฟล์"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 font-thin rounded-lg backdrop-blur-lg saturate-150 border hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg ${
                  isSubmitting 
                    ? 'bg-white/5 border-white/10 cursor-not-allowed text-gray-300/80 shadow-black/20' 
                    : 'bg-white/30 border-white/20 hover:border-pink-400/40 text-white/80 hover:bg-white/30 shadow-black/20 hover:shadow-pink-500/50'
                }`}
              >
                {isSubmitting ? 'กำลังส่ง...' : t('form-submit')}
              </button>
              
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mt-4 p-6 bg-green-600/30 border-2 border-green-500/70 rounded-xl text-green-200 animate-pulse">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <p className="text-lg font-semibold">ขอบคุณสำหรับข้อความของคุณ เราจะติดต่อกลับโดยเร็วที่สุด!</p>
                  </div>
                  <p className="text-center mt-2 text-green-300 text-sm">ข้อมูลของคุณได้ถูกส่งเรียบร้อยแล้ว</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mt-4 p-6 bg-red-600/30 border-2 border-red-500/70 rounded-xl text-red-200 animate-pulse">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">!</span>
                    </div>
                    <p className="text-lg font-semibold">เกิดข้อผิดพลาดในการส่งข้อความ</p>
                  </div>
                  <p className="text-center mt-2 text-red-300 text-sm">กรุณาลองใหม่อีกครั้ง หรือติดต่อเราทางโทรศัพท์</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
