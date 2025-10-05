import { useState, useRef, useEffect } from 'react';
import { Upload, Play, Trash2, FileVideo, AlertCircle, CheckCircle, X, RefreshCw } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  description: string;
  filename: string;
  file_size: number;
  content_type: string;
  created_at: string;
}

interface VideoUploadSectionProps {
  t?: (key: string) => string;
}

export default function VideoUploadSection({ }: VideoUploadSectionProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null
  });

  // Load videos
  const loadVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      if (data.videos) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        showNotification('error', 'กรุณาเลือกไฟล์วิดีโอเท่านั้น');
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        showNotification('error', 'ไฟล์วิดีโอต้องมีขนาดไม่เกิน 100MB');
        return;
      }
      setFormData({ ...formData, file });
    }
  };

  // Upload video
  const handleUpload = async () => {
    if (!formData.file || !formData.title) {
      showNotification('error', 'กรุณาใส่ชื่อวิดีโอและเลือกไฟล์');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('video', formData.file);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        showNotification('success', 'อัพโหลดวิดีโอสำเร็จ!');
        setFormData({ title: '', description: '', file: null });
        setShowUploadForm(false);
        loadVideos();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        showNotification('error', result.error || 'เกิดข้อผิดพลาดในการอัพโหลด');
      }
    } catch (error) {
      showNotification('error', 'เกิดข้อผิดพลาดในการอัพโหลด');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete video
  const handleDelete = async (videoId: number) => {
    if (!confirm('คุณต้องการลบวิดีโอนี้หรือไม่?')) return;

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        showNotification('success', 'ลบวิดีโอสำเร็จ');
        loadVideos();
      } else {
        showNotification('error', result.error || 'เกิดข้อผิดพลาดในการลบ');
      }
    } catch (error) {
      showNotification('error', 'เกิดข้อผิดพลาดในการลบ');
    }
  };

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Load videos on component mount
  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} className="opacity-50" /> : <AlertCircle size={20} className="opacity-50" />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X size={20} className="opacity-50" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent mb-6">
            จัดการวิดีโอ
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            อัพโหลดและจัดการวิดีโอสำหรับ Super AI Agent
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-600 hover:from-cyan-600 hover:via-blue-600 hover:to-pink-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Upload size={20} className="opacity-50" />
              อัพโหลดวิดีโอใหม่
            </button>
            <button
              onClick={() => {
                loadVideos();
                showNotification('success', 'รีเฟรชข้อมูลวิดีโอแล้ว');
              }}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <RefreshCw size={20} className="opacity-50" />
              รีเฟรชข้อมูล
            </button>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              title="อัพเดทระบบทั้งหมด"
            >
              <RefreshCw size={20} className="opacity-50" />
              อัพเดทระบบ
            </button>
          </div>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">อัพโหลดวิดีโอใหม่</h2>
            
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">ชื่อวิดีโอ *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="ใส่ชื่อวิดีโอ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">คำอธิบาย</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-500 focus:outline-none transition-colors h-24 resize-none"
                  placeholder="ใส่คำอธิบายวิดีโอ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ไฟล์วิดีโอ *</label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-cyan-500 transition-colors flex flex-col items-center gap-4"
                  >
                    <FileVideo size={48} className="text-gray-400 opacity-50" />
                    <div className="text-center">
                      <p className="text-gray-300">คลิกเพื่อเลือกไฟล์วิดีโอ</p>
                      <p className="text-sm text-gray-500">รองรับไฟล์ .mp4, .avi, .mov, .wmv (ขนาดไม่เกิน 100MB)</p>
                    </div>
                  </button>
                </div>
                
                {formData.file && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm"><strong>ไฟล์:</strong> {formData.file.name}</p>
                    <p className="text-sm"><strong>ขนาด:</strong> {formatFileSize(formData.file.size)}</p>
                    <p className="text-sm"><strong>ประเภท:</strong> {formData.file.type}</p>
                  </div>
                )}
              </div>

              {isUploading && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !formData.file || !formData.title}
                  className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-600 hover:from-cyan-600 hover:via-blue-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  {isUploading ? 'กำลังอัพโหลด...' : 'อัพโหลด'}
                </button>
                
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    setFormData({ title: '', description: '', file: null });
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300">
              <div className="aspect-video bg-gray-700 relative group">
                <video
                  className="w-full h-full object-cover"
                  poster=""
                  onClick={() => setSelectedVideo(selectedVideo === video.id.toString() ? null : video.id.toString())}
                >
                  <source src={`/api/videos/${video.id}/file`} type={video.content_type} />
                </video>
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => setSelectedVideo(selectedVideo === video.id.toString() ? null : video.id.toString())}
                    className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors"
                  >
                    <Play size={24} fill="white" className="opacity-50" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                {video.description && (
                  <p className="text-gray-300 mb-4 text-sm">{video.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{formatFileSize(video.file_size)}</span>
                  <span>{new Date(video.created_at).toLocaleDateString('th-TH')}</span>
                </div>
                
                <button
                  onClick={() => handleDelete(video.id)}
                  className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} className="opacity-50" />
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-16">
            <FileVideo size={64} className="mx-auto text-gray-600 mb-4 opacity-50" />
            <p className="text-xl text-gray-400">ยังไม่มีวิดีโอ</p>
            <p className="text-gray-500">เริ่มต้นโดยการอัพโหลดวิดีโอแรกของคุณ</p>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold">
                  {videos.find(v => v.id.toString() === selectedVideo)?.title}
                </h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} className="opacity-50" />
                </button>
              </div>
              
              <div className="p-6">
                <video
                  className="w-full rounded-lg"
                  controls
                  autoPlay
                >
                  <source src={`/api/videos/${selectedVideo}/file`} type={videos.find(v => v.id.toString() === selectedVideo)?.content_type} />
                </video>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
