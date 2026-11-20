import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import AuthShell, { inputClass, buttonClass, Spinner } from './AuthShell';
import { passwordChecks, validatePassword } from '../../utils/passwordPolicy';
import { asHttpError } from '../../types/api';

interface ResetPasswordFormValues {
  password: string;
  confirm: string;
}

const TOKEN_FORMAT = /^[a-f0-9]{64}$/;

// Saisie du nouveau mot de passe depuis le lien reçu par e-mail. Le lien est vérifié auprès du
// serveur à l'ouverture (expiré, déjà utilisé ou remplacé → message explicite, pas de formulaire).
const ResetPassword = () => {
  const { token = '' } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(TOKEN_FORMAT.test(token) ? 'checking' : 'invalid'); // checking | ready | invalid | done
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const submitting = useRef(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({ mode: 'onChange' });
  const password = watch('password') || '';

  useEffect(() => {
    if (!TOKEN_FORMAT.test(token)) return undefined;
    let cancelled = false;
    axios.get(`/auth/reset-password/${token}`)
      .then(() => { if (!cancelled) setState('ready'); })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 400) setState('invalid');
        else { setState('ready'); setError("Impossible de vérifier le lien pour l'instant. Vous pouvez tout de même essayer."); }
      });
    return () => { cancelled = true; };
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (submitting.current) return;
    submitting.current = true;
    setError('');
    try {
      await axios.put(`/auth/reset-password/${token}`, { password: data.password });
      setState('done');
      toast.success('Mot de passe réinitialisé. Connectez-vous avec votre nouveau mot de passe.');
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (caught) {
      const err = asHttpError(caught);
      const msg = err.response?.data?.message;
      if (err.response?.status === 400 && /invalide ou expiré/.test(msg || '')) setState('invalid');
      else setError(msg || 'Le service est momentanément indisponible. Réessayez dans quelques instants.');
    } finally {
      submitting.current = false;
    }
  };

  if (state === 'checking') {
    return (
      <AuthShell subtitle="Nouveau mot de passe">
        <div className="flex justify-center py-6" role="status" aria-label="Vérification du lien"><Spinner /></div>
      </AuthShell>
    );
  }

  if (state === 'invalid') {
    return (
      <AuthShell subtitle="Lien invalide ou expiré">
        <div className="space-y-5" data-testid="reset-invalid">
          <p className="text-sm text-blue-50 leading-relaxed">
            Ce lien de réinitialisation n'est plus valable : il a expiré (30 minutes), a déjà été utilisé ou a été remplacé par une demande plus récente.
          </p>
          <Link to="/forgot-password" className={buttonClass}>Demander un nouveau lien</Link>
          <p className="text-center text-xs"><Link to="/login" className="text-sky-300 hover:text-sky-200 font-semibold">← Retour à la connexion</Link></p>
        </div>
      </AuthShell>
    );
  }

  if (state === 'done') {
    return (
      <AuthShell subtitle="Mot de passe modifié">
        <div className="space-y-5" role="status" data-testid="reset-done">
          <p className="text-sm text-blue-50 leading-relaxed">
            Votre mot de passe a été modifié. Pour votre sécurité, toutes les sessions ouvertes auparavant ont été fermées.
          </p>
          <Link to="/login" className={buttonClass}>Se connecter</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell subtitle="Choisissez un nouveau mot de passe">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="reset-password" className="block text-xs font-medium text-blue-100 mb-1.5">Nouveau mot de passe</label>
          <div className="relative">
            <input
              id="reset-password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              autoFocus
              placeholder="••••••••"
              {...register('password', { validate: (v) => validatePassword(v) || true })}
              className={`${inputClass} pr-20`}
              aria-invalid={!!errors.password}
              aria-describedby="reset-rules"
            />
            <button type="button" onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-sky-300 hover:text-sky-200"
              aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              {show ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          <ul id="reset-rules" className="mt-2 space-y-1">
            {passwordChecks(password).map((c) => (
              <li key={c.id} className={`text-xs ${c.ok ? 'text-emerald-300' : 'text-blue-100/70'}`}>
                {c.ok ? '✓' : '•'} {c.label}
              </li>
            ))}
          </ul>
          {errors.password && password && <p className="text-red-300 text-xs mt-1.5">{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="reset-confirm" className="block text-xs font-medium text-blue-100 mb-1.5">Confirmer le mot de passe</label>
          <input
            id="reset-confirm"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            {...register('confirm', {
              required: 'Confirmez le mot de passe',
              validate: (v) => v === watch('password') || 'Les deux mots de passe ne correspondent pas',
            })}
            className={inputClass}
            aria-invalid={!!errors.confirm}
          />
          {errors.confirm && <p className="text-red-300 text-xs mt-1.5">{errors.confirm.message}</p>}
        </div>
        {error && <p className="text-red-300 text-xs" role="alert">{error}</p>}
        <button type="submit" disabled={isSubmitting} className={buttonClass}>
          {isSubmitting && <Spinner />}
          {isSubmitting ? 'Enregistrement…' : 'Enregistrer le nouveau mot de passe'}
        </button>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
