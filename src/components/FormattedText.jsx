import React, { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const FormattedText = ({ html, onMessageClick }) => {
  const [revealedSpoilers, setRevealedSpoilers] = useState(new Set());
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  // Process HTML to highlight code blocks and handle spoilers
  const processedHTML = useMemo(() => {
    if (!html) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Find and highlight code blocks (pre tags)
    let codeBlockIndex = 0;
    tempDiv.querySelectorAll('pre').forEach((pre) => {
      const code = pre.textContent;
      try {
        const highlighted = hljs.highlightAuto(code).value;
        pre.innerHTML = `<code class="hljs">${highlighted}</code>`;
        pre.setAttribute('data-code-index', codeBlockIndex);
        codeBlockIndex++;
      } catch (err) {
        pre.innerHTML = `<code class="hljs">${code}</code>`;
        pre.setAttribute('data-code-index', codeBlockIndex);
        codeBlockIndex++;
      }
    });

    return tempDiv.innerHTML;
  }, [html]);

  const toggleSpoiler = (index) => {
    const newRevealed = new Set(revealedSpoilers);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedSpoilers(newRevealed);
  };

  const copyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Create a safe renderer that handles spoilers with click handlers
  const RenderContent = () => {
    if (!html) return null;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedHTML;

    // Replace spoiler spans with interactive elements
    let spoilerIndex = 0;
    tempDiv.querySelectorAll('.formatted-spoiler').forEach((spoiler) => {
      const index = spoilerIndex;
      const revealed = revealedSpoilers.has(index);
      spoiler.className = revealed ? 'formatted-spoiler revealed' : 'formatted-spoiler';
      spoiler.setAttribute('data-spoiler-index', index);
      spoilerIndex++;
    });

    // Add code copy buttons
    let codeBlockIndex = 0;
    tempDiv.querySelectorAll('pre').forEach((pre) => {
      const codeText = pre.textContent;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      wrapper.innerHTML = pre.outerHTML;
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.setAttribute('data-code-index', codeBlockIndex);
      copyBtn.innerHTML = copiedCodeIndex === codeBlockIndex 
        ? '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>'
        : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
      
      wrapper.appendChild(copyBtn);
      pre.parentNode.replaceChild(wrapper, pre);
      codeBlockIndex++;
    });

    return (
      <div
        className="formatted-text"
        dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }}
        onClick={(e) => {
          if (e.target.closest('.formatted-spoiler')) {
            const spoiler = e.target.closest('.formatted-spoiler');
            const index = parseInt(spoiler.getAttribute('data-spoiler-index'));
            toggleSpoiler(index);
          } else if (e.target.closest('.code-copy-btn')) {
            const btn = e.target.closest('.code-copy-btn');
            const index = parseInt(btn.getAttribute('data-code-index'));
            const pre = btn.previousElementSibling || btn.parentElement.querySelector('pre');
            if (pre) {
              copyCode(pre.textContent, index);
            }
          }
        }}
      />
    );
  };

  return (
    <div className="text-sm text-gray-900 break-words whitespace-pre-wrap">
      <style>{`
        .formatted-text strong {
          font-weight: 600;
        }
        .formatted-text em {
          font-style: italic;
        }
        .formatted-text u {
          text-decoration: underline;
        }
        .formatted-text blockquote {
          border-left: 3px solid #3b82f6;
          padding-left: 12px;
          margin: 8px 0;
          color: #4b5563;
          font-style: italic;
        }
        .formatted-text pre {
          position: relative;
          background-color: #1e1e1e;
          color: #d4d4d4;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 8px 0;
          font-size: 13px;
          line-height: 1.5;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        .code-block-wrapper {
          position: relative;
        }
        .code-copy-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background-color: rgba(255, 255, 255, 0.1);
          color: #d4d4d4;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 150ms ease;
          z-index: 10;
        }
        .code-copy-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .code-copy-btn:active {
          background-color: #10b981;
          border-color: #10b981;
        }
        .formatted-text code {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        .formatted-text .hljs {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        .formatted-spoiler {
          background-color: #000;
          color: #000;
          padding: 2px 6px;
          border-radius: 3px;
          cursor: pointer;
          user-select: none;
          transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          min-width: 20px;
          text-align: center;
        }
        .formatted-spoiler:hover {
          opacity: 0.8;
          transform: scale(1.05);
        }
        .formatted-spoiler.revealed {
          background-color: transparent;
          color: #000;
          animation: revealPop 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes revealPop {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .formatted-text br {
          display: block;
          content: "";
        }
      `}</style>
      <RenderContent />
    </div>
  );
};

export default FormattedText;
