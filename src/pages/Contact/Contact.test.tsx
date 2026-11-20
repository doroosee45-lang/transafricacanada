import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// API simulée dans ce test unitaire ; l'API réelle est vérifiée par les tests d'intégration backend.
const api = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock('../../api/axios', () => ({ default: api }));
vi.mock('../../components/Layout/Navbar', () => ({ default: () => null }));
vi.mock('../../components/Layout/Footer', () => ({ default: () => null }));

import Contact from './Contact';

const fill = (name: string, value: string) => fireEvent.change(document.querySelector(`[name="${name}"]`) as Element, { target: { value } });
const fillValid = () => {
  fill('name', 'Amira Ben Salah'); fill('email', 'amira@test.invalid');
  fill('subject', 'Envoi Tunis'); fill('message', 'Bonjour, quels sont vos délais ?');
};
const submit = () => fireEvent.submit(document.querySelector('form') as HTMLFormElement);

beforeEach(() => api.post.mockReset());

describe('Formulaire de contact', () => {
  it("n'appelle pas l'API si les champs sont invalides et affiche les erreurs", async () => {
    render(<MemoryRouter><Contact /></MemoryRouter>);
    fill('name', 'A'); fill('email', 'pas-un-mail'); fill('subject', 'x'); fill('message', 'court');
    await act(async () => submit());
    expect(api.post).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Adresse e-mail invalide');
  });

  it('affiche la référence renvoyée par le serveur après un envoi réel', async () => {
    api.post.mockResolvedValue({ status: 201, data: { data: { reference: 'MSG-20261112-ABC123' } } });
    render(<MemoryRouter><Contact /></MemoryRouter>);
    fillValid();
    await act(async () => submit());
    expect(api.post).toHaveBeenCalledWith('/contact', expect.objectContaining({ email: 'amira@test.invalid', subject: 'Envoi Tunis' }));
    expect(screen.getByRole('status')).toHaveTextContent('MSG-20261112-ABC123');
    expect((document.querySelector('[name="name"]') as HTMLInputElement).value).toBe('');
  });

  it("ne prétend jamais avoir envoyé en cas d'échec (serveur injoignable / limite)", async () => {
    api.post.mockRejectedValueOnce(new Error('Network Error'));
    render(<MemoryRouter><Contact /></MemoryRouter>);
    fillValid();
    await act(async () => submit());
    expect(screen.getByRole('alert')).toHaveTextContent("n'a PAS été envoyé");
    expect(screen.queryByRole('status')).toBeNull();
    expect((document.querySelector('[name="name"]') as HTMLInputElement).value).toBe('Amira Ben Salah'); // saisie conservée

    api.post.mockRejectedValueOnce({ response: { status: 429, data: {} } });
    await act(async () => submit());
    expect(screen.getByRole('alert')).toHaveTextContent('Trop de messages');
  });

  it('empêche la double soumission pendant l\'envoi', async () => {
    let resolve: (value: unknown) => void = () => {};
    const pending = new Promise((r) => { resolve = r; });
    api.post.mockReturnValue(pending);
    render(<MemoryRouter><Contact /></MemoryRouter>);
    fillValid();
    // Trois soumissions dans le même cycle (avant tout nouveau rendu) : double clic / Entrée répétée.
    submit(); submit(); submit();
    expect(api.post).toHaveBeenCalledTimes(1);
    resolve({ status: 201, data: { data: { reference: 'MSG-1' } } });
    expect(await screen.findByRole('status')).toHaveTextContent('MSG-1');
  });
});
