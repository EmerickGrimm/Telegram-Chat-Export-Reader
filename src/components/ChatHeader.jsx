import React from 'react';
import { Send, Upload, Clock } from 'lucide-react';

const ChatHeader = ({ chatTitle, onLoadClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {chatTitle.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{chatTitle || 'Chat'}</h1>
            <p className="text-xs text-gray-500">Exported conversation</p>
          </div>
        </div>
        <button
          onClick={onLoadClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition flex items-center gap-2 text-sm"
        >
          <Upload className="w-4 h-4" />
          Load Chat
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;