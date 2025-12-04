import React, { memo, useState, useRef } from 'react';
import { File, MapPin, User, Smile, Phone, PhoneOff, Play } from 'lucide-react';
import MediaViewer from './MediaViewer';
import AudioMessage from './AudioMessage';

const MediaItem = memo(({ item, mediaIndex = 0, totalMedia = 1, allMedia = [], onMediaOpen }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(mediaIndex);
  // round_video inline play state
  const [isPlayingRound, setIsPlayingRound] = useState(false);
  const roundVideoRef = useRef(null);

  // CRITICAL: Safety check FIRST
  if (!item || typeof item !== 'object' || !item.type) {
    console.warn('MediaItem received invalid item:', item, 'Type:', typeof item);
    return null;
  }

  const handleOpenMedia = () => {
    setCurrentIndex(mediaIndex);
    // If a global opener is provided, use it (prevents local viewers and duplicates)
    if (onMediaOpen) {
      onMediaOpen(mediaIndex);
      return;
    }

    // Fallback: open local viewer
    setViewerOpen(true);
    if (onMediaOpen) onMediaOpen(mediaIndex);
  };

  const handleNext = () => {
    if (currentIndex < allMedia.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentMedia = allMedia[currentIndex] || item;

  if (item.type === 'photo') {
    return (
      <>
        <img 
          src={item.thumb || item.url} 
          alt="photo" 
          className="max-w-xs rounded-lg shadow hover:shadow-md transition cursor-pointer hover:opacity-90"
          loading="lazy"
          onClick={handleOpenMedia}
        />
        {viewerOpen && (
          <MediaViewer
            item={currentMedia}
            onClose={() => setViewerOpen(false)}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={currentIndex < allMedia.length - 1}
            hasPrev={currentIndex > 0}
            currentIndex={currentIndex + 1}
            totalIndex={allMedia.length}
          />
        )}
      </>
    );
  }

  if (item.type === 'sticker') {
    return (
      <div className="flex items-center justify-center w-40 h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow hover:shadow-md transition">
        {item.url && item.url.endsWith('.tgs') ? (
          <div className="text-center">
            <Smile className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <span className="text-5xl">{item.emoji}</span>
          </div>
        ) : item.url ? (
          <img src={item.url} alt="sticker" className="w-36 h-36 object-contain" loading="lazy" />
        ) : (
          <span className="text-5xl">{item.emoji}</span>
        )}
      </div>
    );
  }

  if (item.type === 'animated_sticker') {
    return (
      <div className="relative w-48 h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center shadow hover:shadow-md transition">
        {item.thumb ? (
          <img 
            src={item.thumb} 
            alt="animated sticker" 
            className="w-44 h-44 object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-6xl">{item.emoji}</span>
        )}
        <div className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Smile className="w-3 h-3" />
          <span className="font-semibold">Animated</span>
        </div>
      </div>
    );
  }

  if (item.type === 'gif') {
    return (
      <>
        <div 
          className="relative max-w-xs rounded-lg overflow-hidden shadow hover:shadow-md transition cursor-pointer group"
          onClick={handleOpenMedia}
        >
          <video src={item.url} autoPlay loop muted className="w-full" preload="metadata" />
          <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded font-bold">
            GIF
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
            <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" />
          </div>
        </div>
        {viewerOpen && (
          <MediaViewer
            item={currentMedia}
            onClose={() => setViewerOpen(false)}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={currentIndex < allMedia.length - 1}
            hasPrev={currentIndex > 0}
            currentIndex={currentIndex + 1}
            totalIndex={allMedia.length}
          />
        )}
      </>
    );
  }
  
  if (item.type === 'video') {
    return (
      <>
        <div 
          className="relative max-w-xs rounded-lg overflow-hidden shadow hover:shadow-md transition cursor-pointer group"
          onClick={handleOpenMedia}
        >
          <video src={item.url} className="w-full aspect-video object-cover" preload="metadata" />
          {item.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded font-medium">
              {item.duration}
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Play className="w-6 h-6 text-blue-600 ml-0.5" fill="currentColor" />
            </div>
          </div>
        </div>
        {viewerOpen && (
          <MediaViewer
            item={currentMedia}
            onClose={() => setViewerOpen(false)}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={currentIndex < allMedia.length - 1}
            hasPrev={currentIndex > 0}
            currentIndex={currentIndex + 1}
            totalIndex={allMedia.length}
          />
        )}
      </>
    );
  }
  
  if (item.type === 'round_video') {
    // Play round videos inline in chat (do NOT open in global viewer)
    const toggleRoundPlay = (e) => {
      e.stopPropagation();
      if (!roundVideoRef.current) return;
      if (isPlayingRound) {
        roundVideoRef.current.pause();
        setIsPlayingRound(false);
      } else {
        roundVideoRef.current.play().catch(() => {});
        setIsPlayingRound(true);
      }
    };

    return (
      <div className="relative w-48 h-48 rounded-full overflow-hidden shadow hover:shadow-md transition cursor-pointer group">
        <video
          ref={roundVideoRef}
          src={item.url}
          className="w-full h-full object-cover"
          preload="metadata"
          onEnded={() => setIsPlayingRound(false)}
          onPause={() => setIsPlayingRound(false)}
          onClick={toggleRoundPlay}
          style={{
            transition: 'transform 240ms ease',
            transform: isPlayingRound ? 'scale(1.06)' : 'scale(1)'
          }}
        />

        {/* show overlay only when NOT playing; centered icon */}
        {!isPlayingRound && (
          <button
            onClick={toggleRoundPlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 transition rounded-full"
            aria-label="Play round video"
          >
            <div className="p-2 rounded-full bg-black bg-opacity-60 text-white flex items-center justify-center">
              <Play className="w-6 h-6" />
            </div>
          </button>
        )}
      </div>
    );
  }
  
  if (item.type === 'animation') {
    return (
      <>
        <div 
          className="relative max-w-xs rounded-lg overflow-hidden shadow hover:shadow-md transition cursor-pointer group"
          onClick={handleOpenMedia}
        >
          <video src={item.url} autoPlay loop muted className="w-full" preload="metadata" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
            <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" />
          </div>
        </div>
        {viewerOpen && (
          <MediaViewer
            item={currentMedia}
            onClose={() => setViewerOpen(false)}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={currentIndex < allMedia.length - 1}
            hasPrev={currentIndex > 0}
            currentIndex={currentIndex + 1}
            totalIndex={allMedia.length}
          />
        )}
      </>
    );
  }
  
  if (item.type === 'voice') {
    return <AudioMessage url={item.url} duration={item.duration} />;
  }

  if (item.type === 'location') {
    return (
      <a 
        href={item.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-green-50 px-4 py-3 rounded-lg border border-green-200 hover:bg-green-100 transition"
      >
        <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <div className="font-medium text-sm text-gray-900">Location</div>
          <div className="text-xs text-gray-600">{item.coords}</div>
        </div>
      </a>
    );
  }

  if (item.type === 'contact') {
    return (
      <div className="flex items-center gap-3 bg-purple-50 px-4 py-3 rounded-lg border border-purple-200">
        <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
        <div>
          <div className="font-medium text-sm text-gray-900">{item.name}</div>
          <div className="text-xs text-gray-600">{item.phone}</div>
        </div>
      </div>
    );
  }

  if (item.type === 'call') {
    const isDeclined = item.status?.toLowerCase().includes('declined');
    const isMissed = item.status?.toLowerCase().includes('missed');
    
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg ${
        isDeclined || isMissed ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
      }`}>
        {isDeclined || isMissed ? (
          <PhoneOff className="w-5 h-5 text-red-600 flex-shrink-0" />
        ) : (
          <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900">{item.name}</div>
          <div className={`text-xs ${
            isDeclined || isMissed ? 'text-red-600' : 'text-green-600'
          }`}>
            {item.status}
          </div>
        </div>
      </div>
    );
  }
  
  if (item.type === 'file') {
    return (
      <a href={item.url} download className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
        <File className="w-5 h-5 text-gray-600 flex-shrink-0" />
        <div className="min-w-0">
          <div className="font-medium text-sm text-gray-900 truncate">{item.title}</div>
          <div className="text-xs text-gray-500">{item.size}</div>
        </div>
      </a>
    );
  }
  
  return null;
});

MediaItem.displayName = 'MediaItem';

export default MediaItem;