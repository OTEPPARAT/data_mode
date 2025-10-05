import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';
interface Video {
  id: number;
  title: string;
  description: string;
  filename: string;
  file_size: number;
  content_type: string;
  created_at: string;
}
interface VideoSectionProps {
  targetVideoTitle?: string;
  t?: (key: string) => string;
  currentLang?: 'th' | 'en';
}
export default function VideoSection({
  targetVideoTitle = "TEST1 EX",
  t,
  currentLang = 'th'
}: VideoSectionProps) {
  const [targetVideo, setTargetVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  // Load videos from API
  useEffect(() => {
    const loadVideos = async () => {
      try {
        console.log('🎥 Loading videos...');
        const response = await fetch('/api/videos');
        const data = await response.json();
        console.log('📹 Video data:', data);
        
        if (data.videos && data.videos.length > 0) {
          // Find the target video
          const foundVideo = data.videos.find((video: Video) => 
            video.title.toLowerCase().includes(targetVideoTitle.toLowerCase())
          );
          
          if (foundVideo) {
            console.log('✅ Found target video:', foundVideo.title);
            setTargetVideo(foundVideo);
          } else {
            console.log('📺 Using first available video:', data.videos[0].title);
            setTargetVideo(data.videos[0]);
          }
        } else {
          console.log('❌ No videos found');
        }
      } catch (error) {
        console.error('❌ Failed to load videos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadVideos();
  }, [targetVideoTitle]);
  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  if (isLoading) {
    return <div className="py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>;
  }
  if (!targetVideo) {
    return <div className="py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-gray-400">{t && typeof t === 'function' ? t('video-not-found') : 'Video not found'}</p>
          </div>
        </div>
      </div>;
  }
  return <>
      <div className="py-16">
        <div className="container mx-auto max-w-6xl">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">{t && typeof t === 'function' ? t('video-title') : 'Super AI Agent Work System'}</span>
            </h2>
            <p className="text-xl text-gray-300">{t && typeof t === 'function' ? t('video-subtitle') : 'Watch the system workflow video'}</p>
          </div>

          {/* Video Container */}
          <div className="relative max-w-4xl mx-auto">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl animate-pulse"></div>
            
            {/* Video wrapper */}
            <div className="relative bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm rounded-3xl p-4 border border-white/20 hover:border-cyan-500/50 transition-all duration-500 shadow-2xl">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group">
                <video ref={setVideoRef} className="w-full h-full object-cover" muted={isMuted} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} poster="">
                  <source src={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`} type="video/mp4" />
                  <source src={`/api/videos/${targetVideo.id}/file`} type={targetVideo.content_type} />
                  Your browser does not support the video tag.
                </video>

                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <button onClick={togglePlay} className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors border border-white/30">
                      {isPlaying ? <Pause size={32} className="text-white fill-white opacity-50" /> : <Play size={32} className="text-white fill-white ml-1 opacity-50" />}
                    </button>
                    
                    <button onClick={toggleMute} className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors border border-white/30">
                      {isMuted ? <VolumeX size={24} className="text-white opacity-50" /> : <Volume2 size={24} className="text-white opacity-50" />}
                    </button>

                    <button onClick={toggleFullscreen} className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors border border-white/30">
                      <Maximize size={24} className="text-white opacity-50" />
                    </button>
                  </div>
                </div>

                {/* Video Title Overlay - Only show on hover */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-1">{targetVideo.title}</h3>
                    {targetVideo.description && <p className="text-gray-300 text-xs">{targetVideo.description}</p>}
                  </div>
                </div>

                
              </div>

              {/* Video Info */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  {t && typeof t === 'function' ? t('video-uploaded') : 'Uploaded on:'} {new Date(targetVideo.created_at).toLocaleDateString(currentLang === 'th' ? 'th-TH' : 'en-US')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-4 right-4 z-10">
            <button onClick={toggleFullscreen} className="bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 transition-colors border border-white/30">
              <X size={24} className="text-white opacity-50" />
            </button>
          </div>
          
          <div className="w-full h-full flex items-center justify-center">
            <video className="w-full h-full object-contain" controls autoPlay={isPlaying} muted={isMuted} loop>
              <source src={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`} type="video/mp4" />
              <source src={`/api/videos/${targetVideo.id}/file`} type={targetVideo.content_type} />
            </video>
          </div>
        </div>}
    </>;
}
