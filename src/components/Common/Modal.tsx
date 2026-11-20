import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { IconComponent } from '../../types/ui';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  size?: ModalSize;
  icon?: IconComponent;
}

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à ClientsList
───────────────────────────────────────────── */
const tk = {
  ink:        '#172F50',
  ink80:      '#172F50',
  surface:    '#F7FAFE',
  surf2:      '#EDF5FC',
  border:     '#DCE9F5',
  accent:     '#4D91D9',
  accentDark: '#347FC5',
  emerald:    '#059669',
  amber:      '#d97706',
  rose:       '#dc2626',
  purple:     '#7c3aed',
  textSec:    '#52677D',
  textMut:    '#8295A8',
};

const Modal = ({ isOpen, onClose, title, children, size = 'md', icon: Icon }: ModalProps) => {
  const sizes: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className={`w-full ${sizes[size]} transform overflow-hidden 
                           rounded-2xl bg-white text-left align-middle 
                           shadow-2xl transition-all`}
                style={{
                  border: `1px solid ${tk.border}`,
                  boxShadow: '0 20px 40px rgba(23,47,80,.12)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: tk.border }}>
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: `${tk.accent}10`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon style={{ width: 16, height: 16, color: tk.accent }} />
                      </div>
                    )}
                    <Dialog.Title
                      as="h3"
                      style={{
                        fontSize: 16, fontWeight: 600, color: tk.ink,
                        fontFamily: "'Open Sans', Arial, sans-serif",
                      }}
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      border: `1.5px solid ${tk.border}`,
                      background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: tk.textMut,
                      transition: 'all .15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = tk.surface;
                      e.currentTarget.style.borderColor = tk.accent;
                      e.currentTarget.style.color = tk.accent;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = tk.border;
                      e.currentTarget.style.color = tk.textMut;
                    }}
                  >
                    <XMarkIcon style={{ width: 14, height: 14 }} />
                  </button>
                </div>
                
                {/* Content */}
                <div className="px-6 py-5">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;