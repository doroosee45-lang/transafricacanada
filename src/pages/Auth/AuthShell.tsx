import React from 'react';

// Cadre commun des pages d'authentification secondaires (mot de passe oublié, réinitialisation) :
// même fond, même carte et même logo que la page de connexion. Responsive (max-w-md, px-4).
export const inputClass =
  'w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/25 text-white placeholder-blue-200/50 text-sm ' +
  'focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all duration-200';

export const buttonClass =
  'w-full py-3 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-600 ' +
  'hover:from-blue-700 hover:to-blue-800 flex justify-center items-center gap-2 focus:outline-none focus:ring-2 ' +
  'focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed ' +
  'transition-all duration-200 shadow-lg shadow-sky-500/25';

export const Spinner = () => (
  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
);

const AuthShell = ({ subtitle, children }: { subtitle?: React.ReactNode; children: React.ReactNode }) => (
  <div className="min-h-screen relative overflow-hidden bg-slate-900">
    <div
      className="absolute inset-0 bg-cover bg-center scale-105 animate-zoom"
      style={{ backgroundImage: "url('/images/easy-public/avion.jpg')", filter: 'brightness(0.85) contrast(1.1)' }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/65 via-slate-900/55 to-sky-900/45 backdrop-blur-[1px]" />
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/12 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
          <div className="flex flex-col items-center mb-7">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl font-bold shadow-lg">
              ✈
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white tracking-tight">Trans Africa Canada</h1>
            {subtitle && <p className="mt-1.5 text-sm text-blue-100/80 text-center">{subtitle}</p>}
          </div>
          {children}
        </div>
        <p className="text-center text-blue-200/50 text-xs mt-5">© 2026 Trans Africa Canada. Tous droits réservés.</p>
      </div>
    </div>
  </div>
);

export default AuthShell;
