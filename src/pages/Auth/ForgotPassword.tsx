import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import AuthShell, { inputClass, buttonClass, Spinner } from './AuthShell';
import { asHttpError } from '../../types/api';

interface ForgotPasswordFormValues {
  email: string;
}

// Demande de lien de réinitialisation. Le serveur répond de façon IDENTIQUE que le compte
// existe ou non : la page affiche donc toujours le même message neutre après envoi.
const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>();

  const onSubmit = async ({ email }: ForgotPasswordFormValues) => {
    if (submitting.current) return; // pas de double envoi
    submitting.current = true;
    setError('');
    try {
      await axios.post('/auth/forgot-password', { email: email.trim() });
      setSent(true);
    } catch (caught) {
      const err = asHttpError(caught);
      // 400 (saisie invalide) ou panne réseau/serveur : affichées telles quelles, jamais masquées.
      setError(err.response?.data?.message || "Le service est momentanément indisponible. Réessayez dans quelques instants.");
    } finally {
      submitting.current = false;
    }
  };

  return (
    <AuthShell subtitle="Mot de passe oublié">
      {sent ? (
        <div className="space-y-5" role="status" data-testid="forgot-sent">
          <p className="text-sm text-blue-50 leading-relaxed">
            Si un compte correspond à cette adresse, un e-mail contenant un lien de réinitialisation vient d'être envoyé.
          </p>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Le lien est valable <strong>30 minutes</strong> et ne peut servir qu'une fois. Pensez à vérifier vos courriers indésirables.
          </p>
          <Link to="/login" className={buttonClass}>Retour à la connexion</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <p className="text-sm text-blue-50/90 leading-relaxed">
            Saisissez l'adresse e-mail de votre compte. Nous vous enverrons un lien pour choisir un nouveau mot de passe.
          </p>
          <div>
            <label htmlFor="forgot-email" className="block text-xs font-medium text-blue-100 mb-1.5">Adresse e-mail</label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="vous@exemple.com"
              {...register('email', {
                required: "L'adresse e-mail est requise",
                maxLength: { value: 254, message: 'Adresse trop longue' },
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Adresse e-mail invalide' },
              })}
              className={inputClass}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-red-300 text-xs mt-1.5">{errors.email.message}</p>}
          </div>
          {error && <p className="text-red-300 text-xs" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting} className={buttonClass}>
            {isSubmitting && <Spinner />}
            {isSubmitting ? 'Envoi en cours…' : 'Envoyer le lien'}
          </button>
          <p className="text-center text-xs text-blue-200/80">
            <Link to="/login" className="text-sky-300 hover:text-sky-200 font-semibold transition-colors">← Retour à la connexion</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
