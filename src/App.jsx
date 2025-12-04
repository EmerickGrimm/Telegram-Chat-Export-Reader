import React, { useState, useRef, useCallback } from 'react';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import EmptyState from './components/EmptyState';
import { parseHTML } from './utils/fileHandler';
import { parseMessage } from './utils/parser';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [chatTitle, setChatTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFolderSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setProgress(0);
    setMessages([]);
    
    const firstPath = files[0].webkitRelativePath;
    const basePath = firstPath.split('/')[0];

    const htmlFile = files.find(f => 
      f.webkitRelativePath.endsWith('messages.html') || 
      f.webkitRelativePath.endsWith('messages1.html')
    );

    if (!htmlFile) {
      alert('No messages.html file found in the selected folder');
      setLoading(false);
      return;
    }

    const text = await htmlFile.text();
    const doc = parseHTML(text);
    
    const title = doc.querySelector('.page_header .text')?.textContent.trim() || 'Chat';
    setChatTitle(title);

    const messageElements = doc.querySelectorAll('.message');
    const parsedMessages = [];
    
    const BATCH_SIZE = 100;
    for (let i = 0; i < messageElements.length; i += BATCH_SIZE) {
      const batch = Array.from(messageElements).slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(msgEl => parseMessage(msgEl, files, basePath));
      const batchResults = await Promise.all(batchPromises);
      parsedMessages.push(...batchResults);
      
      setMessages([...parsedMessages]);
      setProgress((parsedMessages.length / messageElements.length) * 100);
      
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    // Post-process to link quoted messages
    const messagesWithQuotes = parsedMessages.map(msg => {
      if (msg.replyTo && msg.replyTo.messageId && !msg.replyTo.isAnotherChat) {
        // Find the quoted message
        const quotedMsg = parsedMessages.find(m => {
          const msgId = m.id.replace('message', '');
          return msgId === msg.replyTo.messageId.toString();
        });
        
        if (quotedMsg) {
          return {
            ...msg,
            replyTo: {
              ...msg.replyTo,
              quotedMessage: quotedMsg
            }
          };
        }
      }
      return msg;
    });

    setMessages(messagesWithQuotes);
    setLoading(false);
    setProgress(0);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <ChatHeader 
        chatTitle={chatTitle} 
        onLoadClick={() => fileInputRef.current?.click()} 
      />

      {messages.length === 0 ? (
        <div className="flex-1 overflow-y-auto">
          <EmptyState 
            loading={loading}
            progress={loading ? progress : null}
            onLoadClick={() => fileInputRef.current?.click()} 
          />
        </div>
      ) : (
        <MessageList messages={messages} />
      )}

      <input
        ref={fileInputRef}
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleFolderSelect}
        className="hidden"
      />
    </div>
  );
};

export default App;