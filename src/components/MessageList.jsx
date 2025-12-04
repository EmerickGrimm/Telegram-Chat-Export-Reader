import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import MessageItem from './MessageItem';
import MediaViewer from './MediaViewer';

const ESTIMATED_HEIGHT = 160;
const BUFFER_SIZE = 8;

const MessageList = ({ messages }) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const heightsRef = useRef(new Map());
  const [mountedItems, setMountedItems] = useState(new Set());
  // Global media viewer state
  const [globalViewerOpen, setGlobalViewerOpen] = useState(false);
  const [globalIndex, setGlobalIndex] = useState(0);

  // Build a flat list of all media (photos/videos/gifs/animations/round_video) across messages
  const globalMedia = useMemo(() => {
    const list = [];
    messages.forEach((msg, msgIdx) => {
      const media = (msg.media || []).filter(m => m && typeof m === 'object' && m.type);
      media.forEach((m, mediaIdx) => {
        // Only include types we want to browse globally (exclude round_video - play inline only)
        if (["photo", "video", "gif", "animation"].includes(m.type)) {
          list.push({ item: m, messageIndex: msgIdx, mediaIndex: mediaIdx });
        }
      });
    });
    return list;
  }, [messages]);

  const openGlobalMedia = useCallback((messageIdx, mediaIdx) => {
    // find global index
    const idx = globalMedia.findIndex(g => g.messageIndex === messageIdx && g.mediaIndex === mediaIdx);
    if (idx !== -1) {
      setGlobalIndex(idx);
      setGlobalViewerOpen(true);
    }
  }, [globalMedia]);

  const closeGlobalViewer = useCallback(() => setGlobalViewerOpen(false), []);

  const handleGlobalNext = useCallback(() => {
    setGlobalIndex(i => Math.min(i + 1, globalMedia.length - 1));
  }, [globalMedia.length]);

  const handleGlobalPrev = useCallback(() => {
    setGlobalIndex(i => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      setContainerHeight(container.clientHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  const setItemHeight = useCallback((index, height) => {
    if (height > 0 && heightsRef.current.get(index) !== height) {
      heightsRef.current.set(index, height);
      setMountedItems(new Set(heightsRef.current.keys()));
    }
  }, []);

  const getItemHeight = useCallback((index) => {
    return heightsRef.current.get(index) || ESTIMATED_HEIGHT;
  }, []);

  // Calculate visible range
  const getVisibleRange = useCallback(() => {
    if (!messages.length || !containerHeight) {
      return { startIndex: 0, endIndex: Math.min(20, messages.length), offsetY: 0 };
    }

    let accumulatedHeight = 0;
    let startIndex = 0;
    let endIndex = messages.length;
    let startOffset = 0;

    // Find start index
    for (let i = 0; i < messages.length; i++) {
      const itemHeight = getItemHeight(i);
      
      if (accumulatedHeight + itemHeight >= scrollTop) {
        startIndex = Math.max(0, i - BUFFER_SIZE);
        break;
      }
      accumulatedHeight += itemHeight;
    }

    // Calculate start offset
    startOffset = 0;
    for (let i = 0; i < startIndex; i++) {
      startOffset += getItemHeight(i);
    }

    // Find end index
    accumulatedHeight = startOffset;
    for (let i = startIndex; i < messages.length; i++) {
      const itemHeight = getItemHeight(i);
      accumulatedHeight += itemHeight;
      
      if (accumulatedHeight >= scrollTop + containerHeight + (BUFFER_SIZE * ESTIMATED_HEIGHT)) {
        endIndex = Math.min(messages.length, i + 1);
        break;
      }
    }

    return { startIndex, endIndex, offsetY: startOffset };
  }, [messages, scrollTop, containerHeight, getItemHeight]);

  const { startIndex, endIndex, offsetY } = getVisibleRange();

  // Calculate total height
  const totalHeight = messages.reduce((sum, _, index) => {
    return sum + getItemHeight(index);
  }, 0);

  // Make sure we don't slice beyond array bounds
  const safeStartIndex = Math.max(0, Math.min(startIndex, messages.length - 1));
  const safeEndIndex = Math.max(0, Math.min(endIndex, messages.length));
  
  const visibleMessages = messages.slice(safeStartIndex, safeEndIndex);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-white"
      onScroll={handleScroll}
    >
      {globalViewerOpen && globalMedia[globalIndex] && (
        <MediaViewer
          item={globalMedia[globalIndex].item}
          onClose={closeGlobalViewer}
          onNext={handleGlobalNext}
          onPrev={handleGlobalPrev}
          hasNext={globalIndex < globalMedia.length - 1}
          hasPrev={globalIndex > 0}
          currentIndex={globalIndex + 1}
          totalIndex={globalMedia.length}
        />
      )}
      <div className="max-w-5xl mx-auto px-4 py-6 pb-32">
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          <div 
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${offsetY}px)`,
            }}
          >
            {visibleMessages.map((msg, idx) => {
              const actualIndex = safeStartIndex + idx;
              if (!msg || actualIndex >= messages.length) return null;
              
              return (
                <MessageItem 
                  key={msg.id} 
                  message={msg}
                  index={actualIndex}
                  onHeightChange={setItemHeight}
                  onOpenGlobalMedia={(localIndex) => openGlobalMedia(actualIndex, localIndex)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageList;