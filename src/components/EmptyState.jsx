import React from 'react';
import { Send, FolderOpen } from 'lucide-react';

const EmptyState = ({ onLoadClick, loading, progress }) => {
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading messages...</p>
        {progress && (
          <div className="mt-6 max-w-xs mx-auto">
            <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-24">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
        <Send className="w-10 h-10 text-blue-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">No Chat Loaded</h2>
      <p className="text-gray-500 mb-8">Load a Telegram export folder to view the conversation</p>
      <button
        onClick={onLoadClick}
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition inline-flex items-center gap-2"
      >
        <FolderOpen className="w-5 h-5" />
        Load Telegram Export
      </button>
    </div>
  );
};

export default EmptyState;