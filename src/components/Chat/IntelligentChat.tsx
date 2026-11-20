// components/Chat/IntelligentChat.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PaperAirplaneIcon,
  XMarkIcon,
  UserIcon,
  SparklesIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
// Instance configurée (VITE_API_URL) : avant, fetch('/api/chat') visait l'origine du FRONTEND —
// en production (site statique Render) la réécriture /* → index.html renvoyait du HTML.
import api from '../../api/axios';
import { asHttpError } from '../../types/api';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const tk = {
  ink: '#172F50',
  ink80: '#172F50',
  surface: '#F7FAFE',
  border: '#DCE9F5',
  accent: '#4D91D9',
  textSec: '#52677D',
  textMut: '#8295A8',
};

// Rendu markdown minimaliste : **gras**, • listes, sauts de ligne
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const renderMessage = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Transformer **texte** en <strong>
    const parts = line.split(/\*\*([^*]+)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );
    const isBullet = line.trimStart().startsWith('•');
    return (
      <React.Fragment key={i}>
        {isBullet
          ? <span style={{ display: 'flex', gap: 6, marginTop: 2 }}>
              <span style={{ flexShrink: 0 }}>•</span>
              <span>{rendered.slice(1)}</span>
            </span>
          : <span>{rendered}</span>
        }
        {i < lines.length - 1 && !isBullet && <br />}
      </React.Fragment>
    );
  });
};

const MAX_INPUT_LENGTH = 800;

interface IntelligentChatProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

const IntelligentChat = ({ isOpen, onClose, userId }: IntelligentChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Générer un ID de session unique
  useEffect(() => {
    // Identifiant aléatoire (CSPRNG) : il donne accès à l'historique de la conversation.
    const stored = localStorage.getItem('chatSessionId');
    const newSessionId = stored && /^[A-Za-z0-9_-]{16,100}$/.test(stored)
      ? stored
      : `session_${(crypto.randomUUID ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('')).replace(/-/g, '')}`;
    if (stored !== newSessionId) localStorage.setItem('chatSessionId', newSessionId);
    setSessionId(newSessionId);
    loadChatHistory(newSessionId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus sur l'input quand le chat s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Charger l'historique des messages
  const loadChatHistory = useCallback(async (session: string) => {
    try {
      const { data } = await api.get(`/chat/history/${encodeURIComponent(session)}`);
      if (data.history && data.history.length > 0) {
        setMessages(data.history);
      } else {
        setMessages([{
          role: 'assistant',
          content: "Bonjour ! 👋 Je suis l'assistant de Trans Africa Canada. Je peux vous aider avec :\n\n• 📦 Suivi de vos colis\n• 💰 Tarifs et forfaits\n• 🛒 Marketplace de kilos\n• 💳 Paiements et factures\n• 🏢 Agences et équipes\n\nComment puis-je vous aider aujourd'hui ?"
        }]);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  }, []);

  // Envoyer un message (text optionnel pour les suggestions rapides)
  const sendMessage = async (text?: string) => {
    const userMessage = (text || inputMessage).trim();
    if (!userMessage || isLoading) return;

    setInputMessage('');
    
    // Ajouter le message utilisateur
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const { data } = await api.post('/chat', { message: userMessage, sessionId, userId });
      
      // Simuler un délai de frappe pour plus de réalisme
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        setIsTyping(false);
      }, 500);
      
    } catch (caught) {
      const error = asHttpError(caught);
      // 429 (trop de messages) : le serveur fournit un message explicite dans `response`.
      const serverText = error.response?.data?.response || error.response?.data?.error;
      if (!serverText) console.error('Erreur envoi message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: serverText || "Désolé, une erreur est survenue. Veuillez réessayer ou contacter notre support."
      }]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Effacer l'historique
  const clearHistory = async () => {
    if (window.confirm('Effacer tout l\'historique de la conversation ?')) {
      try {
        await api.delete(`/chat/history/${encodeURIComponent(String(sessionId))}`);
        setMessages([
          {
            role: 'assistant',
            content: "Historique effacé ! 👋 Je suis toujours là pour vous aider. Que puis-je faire pour vous aujourd'hui ?"
          }
        ]);
      } catch (error) {
        console.error('Erreur effacement:', error);
      }
    }
  };

  // Suggestions rapides
  const quickSuggestions = [
    "Comment suivre mon colis ?",
    "Quels sont les tarifs ?",
    "Comment fonctionne la marketplace ?",
    "Contacter le support"
  ];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 'clamp(12px, 4vw, 24px)',
      right: 'clamp(12px, 4vw, 24px)',
      zIndex: 1000,
      width: 'min(400px, calc(100vw - 32px))',
      height: 'min(600px, calc(100vh - 100px))',
      background: '#fff',
      borderRadius: 'clamp(20px, 5vw, 24px)',
      boxShadow: '0 20px 60px rgba(0,0,0,.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'slideUp 0.3s ease-out',
    }}>
      {/* Header - adapté mobile */}
      <div style={{
        background: `linear-gradient(135deg, ${tk.accent}, #79B5E8)`,
        padding: 'clamp(12px, 4vw, 16px) clamp(16px, 4vw, 20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#fff',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 3vw, 12px)' }}>
          <div style={{
            width: 'clamp(32px, 8vw, 40px)',
            height: 'clamp(32px, 8vw, 40px)',
            borderRadius: 'clamp(10px, 3vw, 12px)',
            background: 'rgba(255,255,255,.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <SparklesIcon style={{ width: 'clamp(18px, 5vw, 22px)', height: 'clamp(18px, 5vw, 22px)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 'clamp(14px, 4vw, 16px)', fontWeight: 700, margin: 0, fontFamily: "'Open Sans', Arial, sans-serif" }}>
              Assistant IA
            </h3>
            <p style={{ fontSize: 'clamp(10px, 3vw, 11px)', margin: 0, opacity: 0.8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              En ligne
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(4px, 2vw, 8px)' }}>
          <button
            onClick={clearHistory}
            style={{
              background: 'rgba(255,255,255,.15)',
              border: 'none',
              borderRadius: 8,
              padding: 'clamp(4px, 2vw, 6px)',
              cursor: 'pointer',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Effacer l'historique"
          >
            <TrashIcon style={{ width: 'clamp(14px, 4vw, 16px)', height: 'clamp(14px, 4vw, 16px)' }} />
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,.15)',
              border: 'none',
              borderRadius: 8,
              padding: 'clamp(4px, 2vw, 6px)',
              cursor: 'pointer',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <XMarkIcon style={{ width: 'clamp(14px, 4vw, 16px)', height: 'clamp(14px, 4vw, 16px)' }} />
          </button>
        </div>
      </div>

      {/* Messages - zone scrollable */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'clamp(12px, 4vw, 16px) clamp(12px, 4vw, 20px)',
        background: tk.surface,
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(8px, 3vw, 12px)',
        WebkitOverflowScrolling: 'touch',
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '85%',
              display: 'flex',
              gap: 'clamp(6px, 2vw, 8px)',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            }}>
              {/* Avatar - caché sur très petit écran */}
              <div style={{
                width: 'clamp(28px, 7vw, 32px)',
                height: 'clamp(28px, 7vw, 32px)',
                borderRadius: '50%',
                background: msg.role === 'user' ? tk.accent : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 4px rgba(0,0,0,.1)',
              }}>
                {msg.role === 'user' ? (
                  <UserIcon style={{ width: 'clamp(12px, 4vw, 16px)', height: 'clamp(12px, 4vw, 16px)', color: '#fff' }} />
                ) : (
                  <SparklesIcon style={{ width: 'clamp(12px, 4vw, 16px)', height: 'clamp(12px, 4vw, 16px)', color: tk.accent }} />
                )}
              </div>
              <div style={{
                background: msg.role === 'user' ? tk.accent : '#fff',
                color: msg.role === 'user' ? '#fff' : tk.ink,
                padding: 'clamp(8px, 3vw, 10px) clamp(10px, 3vw, 14px)',
                borderRadius: 'clamp(14px, 4vw, 16px)',
                borderBottomRightRadius: msg.role === 'user' ? 4 : 'clamp(14px, 4vw, 16px)',
                borderBottomLeftRadius: msg.role === 'user' ? 'clamp(14px, 4vw, 16px)' : 4,
                fontSize: 'clamp(12px, 3.5vw, 13px)',
                lineHeight: 1.6,
                wordBreak: 'break-word',
                boxShadow: '0 1px 2px rgba(0,0,0,.05)',
              }}>
                {msg.role === 'user' ? msg.content : renderMessage(msg.content)}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 'clamp(6px, 2vw, 8px)' }}>
              <div style={{
                width: 'clamp(28px, 7vw, 32px)',
                height: 'clamp(28px, 7vw, 32px)',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,.1)',
              }}>
                <SparklesIcon style={{ width: 'clamp(12px, 4vw, 16px)', height: 'clamp(12px, 4vw, 16px)', color: tk.accent }} />
              </div>
              <div style={{
                background: '#fff',
                padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
                borderRadius: 'clamp(14px, 4vw, 16px)',
                borderBottomLeftRadius: 4,
                display: 'flex',
                gap: 4,
              }}>
                <span style={{ width: 6, height: 6, background: tk.textMut, borderRadius: '50%', animation: 'bounce 1.4s infinite' }} />
                <span style={{ width: 6, height: 6, background: tk.textMut, borderRadius: '50%', animation: 'bounce 1.4s infinite 0.2s' }} />
                <span style={{ width: 6, height: 6, background: tk.textMut, borderRadius: '50%', animation: 'bounce 1.4s infinite 0.4s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions rapides - caché si trop de messages */}
      {messages.length <= 2 && (
        <div style={{
          padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 20px)',
          background: '#fff',
          borderTop: `1px solid ${tk.border}`,
          display: 'flex',
          gap: 'clamp(6px, 2vw, 8px)',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}>
          {quickSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(suggestion)}
              style={{
                padding: 'clamp(5px, 2vw, 6px) clamp(8px, 3vw, 12px)',
                borderRadius: 20,
                background: tk.surface,
                border: `1px solid ${tk.border}`,
                fontSize: 'clamp(10px, 3vw, 11px)',
                color: tk.textSec,
                cursor: 'pointer',
                transition: 'all .2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = tk.accent;
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = tk.accent;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = tk.surface;
                e.currentTarget.style.color = tk.textSec;
                e.currentTarget.style.borderColor = tk.border;
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input - adapté mobile */}
      <div style={{
        padding: 'clamp(12px, 3vw, 16px) clamp(12px, 4vw, 20px)',
        background: '#fff',
        borderTop: `1px solid ${tk.border}`,
        display: 'flex',
        gap: 'clamp(8px, 3vw, 12px)',
        alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value.slice(0, MAX_INPUT_LENGTH))}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Écrivez votre message..."
            rows={1}
            style={{
              width: '100%',
              padding: 'clamp(8px, 2.5vw, 10px) clamp(10px, 3vw, 12px)',
              borderRadius: 20,
              border: `1.5px solid ${tk.border}`,
              fontSize: 'clamp(12px, 3.5vw, 13px)',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              transition: 'border .2s',
              maxHeight: '100px',
            }}
            onFocus={e => e.currentTarget.style.borderColor = tk.accent}
            onBlur={e => e.currentTarget.style.borderColor = tk.border}
          />
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !inputMessage.trim()}
          style={{
            width: 'clamp(36px, 10vw, 40px)',
            height: 'clamp(36px, 10vw, 40px)',
            borderRadius: '50%',
            background: '#347FC5',
            border: 'none',
            cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !inputMessage.trim() ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform .2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!isLoading && inputMessage.trim()) {
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onTouchStart={e => {
            if (!isLoading && inputMessage.trim()) {
              e.currentTarget.style.transform = 'scale(0.95)';
            }
          }}
          onTouchEnd={e => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isLoading ? (
            <ArrowPathIcon style={{ width: 'clamp(16px, 4.5vw, 18px)', height: 'clamp(16px, 4.5vw, 18px)', color: '#fff', animation: 'spin 1s linear infinite' }} />
          ) : (
            <PaperAirplaneIcon style={{ width: 'clamp(16px, 4.5vw, 18px)', height: 'clamp(16px, 4.5vw, 18px)', color: '#fff' }} />
          )}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Améliorations pour mobile */
        @media (max-width: 640px) {
          div[style*="position: fixed"] {
            bottom: 12px !important;
            right: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default IntelligentChat;