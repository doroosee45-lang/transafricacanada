// components/Chat/ChatButton.jsx
import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import IntelligentChat from './IntelligentChat';

const ChatButton = ({ userId }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Optionnel: cacher le chat sur certaines pages (ex: login, register)
  useEffect(() => {
    const hideOnPages = ['/login', '/register'];
    const shouldHide = hideOnPages.some(path => window.location.pathname === path);
    setIsVisible(!shouldHide);
  }, [window.location.pathname]);

  if (!isVisible) return null;

  return (
    <>
      {/* Bouton flottant - adapté pour mobile */}
      <button
        type="button"
        aria-label={isChatOpen ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          bottom: 'clamp(12px, 4vw, 24px)',
          right: 'clamp(12px, 4vw, 24px)',
          zIndex: 999,
          width: 'clamp(48px, 12vw, 56px)',
          height: 'clamp(48px, 12vw, 56px)',
          borderRadius: '50%',
          background: `linear-gradient(135deg, #a77b28, #c7983a)`,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(167,123,40,.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s, opacity 0.3s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        onTouchStart={e => e.currentTarget.style.transform = 'scale(0.95)'}
        onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isChatOpen ? (
          <XMarkIcon style={{ width: 'clamp(22px, 6vw, 28px)', height: 'clamp(22px, 6vw, 28px)', color: '#fff' }} />
        ) : (
          <div style={{ position: 'relative' }}>
            <ChatBubbleLeftRightIcon style={{ width: 'clamp(22px, 6vw, 28px)', height: 'clamp(22px, 6vw, 28px)', color: '#fff' }} />
            <span style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 'clamp(10px, 3vw, 12px)',
              height: 'clamp(10px, 3vw, 12px)',
              borderRadius: '50%',
              background: '#4ade80',
              border: '2px solid #a77b28',
              animation: 'pulse 2s infinite',
            }} />
          </div>
        )}
      </button>

      {/* Chat intelligent */}
      <IntelligentChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userId={userId}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
    </>
  );
};

export default ChatButton;