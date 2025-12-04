import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Pause } from 'lucide-react';

const MediaViewer = ({ item, onClose, onNext, onPrev, hasNext, hasPrev, currentIndex, totalIndex }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const videoRef = React.useRef(null);
  const controlsRef = React.useRef(null);

  useEffect(() => {
    // Disable body scroll when viewer is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === ' ') {
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  // When a new item is opened, ensure controls and counter are visible immediately,
  // then hide controls after a short timeout for videos.
  useEffect(() => {
    setShowControls(true);

    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      setControlsTimeout(null);
    }

    const timeout = setTimeout(() => {
      if (item?.type === 'video') {
        // only auto-hide for videos while playing
        if (isPlaying) setShowControls(false);
      } else {
        // for non-video media, keep small overlays visible briefly
        setShowControls(false);
      }
    }, 3000);

    setControlsTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      setControlsTimeout(null);
    };
    // We intentionally do not depend on isPlaying here to avoid canceling initial timeout on play toggles
  }, [item]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (isPlaying && item.type === 'video') {
        setShowControls(false);
      }
    }, 3000);
    
    setControlsTimeout(timeout);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const viewerContent = (
    <div 
      className="fixed inset-0 bg-black z-[9999] flex items-center justify-center overflow-hidden"
      onClick={handleBackdropClick}
      onMouseMove={handleMouseMove}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition z-[10000]"
      >
        <X className="w-7 h-7 text-white" />
      </button>

      {/* Navigation */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="fixed left-6 top-1/2 -translate-y-1/2 p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition z-[10000]"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={onNext}
          className="fixed right-6 top-1/2 -translate-y-1/2 p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition z-[10000]"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Content Container */}
      <div className="w-full h-full flex items-center justify-center px-16 py-16" onClick={handleBackdropClick}>
        {item.type === 'photo' && (
          <img
            src={item.url || item.thumb}
            alt="media"
            className="max-w-full max-h-full w-auto h-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {(item.type === 'video' || item.type === 'animation' || item.type === 'gif' || item.type === 'round_video') && (
          <div 
            className="relative flex items-center justify-center w-full h-full"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => {
              if (isPlaying && item.type === 'video') {
                setShowControls(false);
              }
            }}
          >
            <video
              ref={videoRef}
              src={item.url}
              autoPlay={item.type === 'video' || item.type === 'animation' || item.type === 'gif' || item.type === 'round_video'}
              loop={item.type === 'animation' || item.type === 'gif'}
              muted={item.type === 'animation' || item.type === 'gif' || isMuted}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              style={{
                transition: 'transform 240ms ease',
                transform: item.type === 'round_video' && isPlaying ? 'scale(1.08)' : 'scale(1)'
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
              }}
            />

            {/* Video controls panel for regular videos */}
            {item.type === 'video' && (
              <div
                ref={controlsRef}
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black via-opacity-70 to-transparent px-8 py-6 flex items-center justify-between transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onPrev && hasPrev) onPrev();
                    }}
                    className="p-3 hover:bg-white hover:bg-opacity-30 rounded-full transition flex-shrink-0"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause();
                    }}
                    className="p-3 hover:bg-white hover:bg-opacity-30 rounded-full transition flex-shrink-0"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 text-white" />
                    ) : (
                      <Play className="w-7 h-7 text-white" fill="white" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNext && hasNext) onNext();
                    }}
                    className="p-3 hover:bg-white hover:bg-opacity-30 rounded-full transition flex-shrink-0"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="flex-1" onClick={(e) => e.stopPropagation()} />

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMuteToggle();
                    }}
                    className="p-3 hover:bg-white hover:bg-opacity-30 rounded-full transition flex-shrink-0"
                  >
                    {isMuted ? (
                      <VolumeX className="w-7 h-7 text-white" />
                    ) : (
                      <Volume2 className="w-7 h-7 text-white" />
                    )}
                  </button>

                  {item.duration && (
                    <span className="text-white text-sm font-medium ml-2 flex-shrink-0 min-w-max">{item.duration}</span>
                  )}
                </div>
              </div>
            )}

            {/* Non-video inline overlay removed to avoid duplicate controls; use global side controls */}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white text-sm text-opacity-60 pointer-events-none text-center z-[10000]">
        {hasPrev || hasNext ? 'Use arrow keys or buttons to navigate • ESC to close' : 'Click background or press ESC to close'}
      </div>

      {/* Media counter */}
      {currentIndex !== undefined && totalIndex !== undefined && totalIndex > 1 && (
        <div className="fixed bottom-8 right-8 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm font-medium z-[10000]">
          {currentIndex} / {totalIndex}
        </div>
      )}
    </div>
  );

  // Render as a portal to the document body
  return createPortal(viewerContent, document.body);
};

export default MediaViewer;
