import React, { memo, useEffect, useRef, useState } from 'react';
import MediaItem from './MediaItem';
import FormattedText from './FormattedText';

const MessageItem = memo(({ message, index, onHeightChange, onOpenGlobalMedia }) => {
  const itemRef = useRef(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    if (itemRef.current) {
      const height = itemRef.current.offsetHeight;
      onHeightChange(index, height);
    }
  }, [message, index, onHeightChange]);

  if (message.type === 'service') {
    return (
      <div
        ref={itemRef}
        className="my-6 text-center"
      >
        <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">
          {message.text}
        </div>
      </div>
    );
  }

  // Regular message
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-yellow-100 text-yellow-700',
    'bg-pink-100 text-pink-700',
  ];

  const colorIndex = (message.initials?.charCodeAt(0) || 0) % colors.length;
  const bgColor = colors[colorIndex];

  // Filter out invalid media items
  const validMedia = (message.media || []).filter(item => item && typeof item === 'object' && item.type);

  // Check if this is a "joined" message (no user info)
  const isJoinedMessage = !message.from || !message.initials;

  return (
    <div ref={itemRef} className="mb-4 flex gap-2">
      {/* Avatar - only show if not a joined message */}
      {!isJoinedMessage && (
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs ${bgColor}`}
        >
          {message.initials || '?'}
        </div>
      )}

      {/* Message content */}
      <div className="flex-1 max-w-2xl">
        {!isJoinedMessage && (
          <div className="flex items-baseline gap-2 px-3 pt-1">
            <span className="font-semibold text-sm text-gray-900">{message.from}</span>
            <span className="text-xs text-gray-500">{message.time}</span>
          </div>
        )}

        {isJoinedMessage && message.time && (
          <div className="text-xs text-gray-500 mb-1 px-3">{message.time}</div>
        )}

        {/* Reply/Quote section */}
        {message.replyTo && (
          <div className={`mx-3 mb-3 rounded-lg border-l-4 overflow-hidden ${
            message.replyTo.isAnotherChat
              ? 'bg-amber-50 border-amber-400'
              : 'bg-blue-50 border-blue-400'
          }`}>
            <div className={`px-4 py-3 text-sm ${
              message.replyTo.isAnotherChat
                ? 'text-amber-900'
                : 'text-blue-900'
            }`}>
              {message.replyTo.isAnotherChat && (
                <div className="font-semibold mb-2 flex items-center gap-1.5 text-amber-700">
                  <span>💬</span>
                  <span>Quote from another chat</span>
                </div>
              )}
              
              {/* Quoted message content */}
              {message.replyTo.quotedMessage ? (
                <div>
                  {message.replyTo.quotedMessage.from && (
                    <div className="font-semibold text-xs mb-1 opacity-75">
                      {message.replyTo.quotedMessage.from}
                    </div>
                  )}
                  <div className="font-medium leading-snug">
                    {message.replyTo.quotedMessage.formattedHTML ? (
                      <FormattedText html={message.replyTo.quotedMessage.formattedHTML} />
                    ) : (
                      message.replyTo.quotedMessage.text
                    )}
                  </div>
                </div>
              ) : (
                <div className="font-medium leading-snug">{message.replyTo.text}</div>
              )}
            </div>
          </div>
        )}

        {/* Text content */}
        {message.formattedHTML ? (
          <div className="px-3">
            <FormattedText html={message.formattedHTML} />
          </div>
        ) : message.text ? (
          <div className="text-sm text-gray-900 break-words whitespace-pre-wrap px-3">
            {message.text}
          </div>
        ) : null}

        {/* Media content */}
        {validMedia.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 px-3">
            {validMedia.map((item, idx) => (
              <MediaItem 
                key={`${message.id}-${idx}`} 
                item={item}
                mediaIndex={idx}
                totalMedia={validMedia.length}
                allMedia={validMedia}
                onMediaOpen={(localIndex) => {
                  setCurrentMediaIndex(localIndex);
                  if (onOpenGlobalMedia) onOpenGlobalMedia(localIndex);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;