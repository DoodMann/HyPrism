import React, { useState, useRef, useEffect } from 'react';

// Try to import background video, fallback to null if not available
let backgroundVideo: string | null = null;
try {
  backgroundVideo = new URL('../assets/background.mp4', import.meta.url).href;
} catch {
  // Video file not available, will use fallback gradient
}

export const BackgroundImage: React.FC = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Prevent video from restarting on window focus
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Save and restore playback position on visibility change
    let savedTime = 0;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        savedTime = video.currentTime;
      } else {
        // Restore the video position when window becomes visible
        if (savedTime > 0 && Math.abs(video.currentTime - savedTime) > 1) {
          video.currentTime = savedTime;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <>
      {/* Video Background or Gradient Fallback */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundVideo && !videoError ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`absolute w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Crect fill='%23090909' width='1280' height='720'/%3E%3C/svg%3E"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          // Fallback animated gradient background
          <div className="absolute w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient" />
        )}
      </div>

      {/* Light overlay for readability - much lighter than before */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </>
  );
};
