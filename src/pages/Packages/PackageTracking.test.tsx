import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import PackageTracking from './PackageTracking';

// API et socket simulés uniquement dans ce test unitaire : la vérification réelle de l'API
// est faite séparément contre un backend et une base MongoDB de test.
const api = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('../../api/axios', () => ({ default: api }));

const ws = vi.hoisted(() => ({ handlers: {} as Record<string, (data: unknown) => void>, joined: [] as string[] }));
vi.mock('../../services/websocket', () => ({
  default: {
    connect: vi.fn(),
    joinRoom: (room: string) => ws.joined.push(room),
    leaveRoom: (room: string) => { ws.joined = ws.joined.filter((r) => r !== room); },
    on: (event: string, cb: (data: unknown) => void) => { ws.handlers[event] = cb; },
    off: (event: string) => { delete ws.handlers[event]; },
  },
}));
vi.mock('react-toastify', () => ({ toast: { info: vi.fn(), success: vi.fn(), error: vi.fn() } }));

const LocationProbe = () => {
  const location = useLocation();
  return <p data-testid="location">{location.pathname}{location.search}</p>;
};

const show = (path: string) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/tracking" element={<PackageTracking publicMode />} />
      <Route path="/tracking/:trackingNumber" element={<PackageTracking publicMode />} />
      <Route path="/app/packages/tracking" element={<PackageTracking />} />
    </Routes>
    <LocationProbe />
  </MemoryRouter>,
);

const publicPackage = {
  trackingNumber: 'LGT-1A2B3C4D',
  status: 'transit',
  origin: 'Canada',
  destination: 'RDC',
  trackingHistory: [
    { _id: 'e1', status: 'registered', description: 'Colis enregistré dans le système', date: '2026-11-01T10:00:00.000Z' },
    { _id: 'e2', status: 'transit', location: 'Montréal', description: 'En transit', date: '2026-11-03T10:00:00.000Z' },
  ],
};

beforeEach(() => {
  api.get.mockReset();
  ws.handlers = {};
  ws.joined = [];
});

describe('Suivi de colis par numéro', () => {
  it('affiche le formulaire de recherche sans numéro, sans appel API', () => {
    show('/tracking');
    expect(screen.getByRole('heading', { name: 'Suivi de colis' })).toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
  });

  it('charge le lien public partagé, normalise le numéro et affiche les statuts en français', async () => {
    api.get.mockResolvedValue({ data: { success: true, data: publicPackage } });
    show('/tracking/lgt-1a2b3c4d');

    expect(await screen.findAllByText('En transit')).not.toHaveLength(0);
    expect(api.get).toHaveBeenCalledWith('/packages/track/LGT-1A2B3C4D');
    // Libellé présent dans la barre d'étapes ET dans l'historique (statut anglais traduit)
    expect(screen.getAllByText('Enregistré')).toHaveLength(2);
    expect(screen.queryByText('registered')).not.toBeInTheDocument();
    expect(screen.getByText('En transit • 3/7')).toBeInTheDocument();
    expect(screen.getByText('Canada → RDC')).toBeInTheDocument();
    expect(screen.getByText('Montréal')).toBeInTheDocument();
    // Dates réellement affichées à partir du champ `date`
    expect(screen.getByText(new Date('2026-11-03T10:00:00.000Z').toLocaleString('fr-FR'))).toBeInTheDocument();
    // Lien de partage vers la route publique existante
    expect(screen.getByLabelText('Lien public de suivi')).toHaveValue(`${window.location.origin}/tracking/LGT-1A2B3C4D`);
    expect(ws.joined).toContain('tracking_LGT-1A2B3C4D');
  });

  it('affiche le message de l’API pour un numéro inexistant et garde la recherche disponible', async () => {
    api.get.mockRejectedValue({ response: { status: 404, data: { message: 'Numéro de suivi introuvable.' } } });
    show('/tracking/LGT-00000000');
    expect(await screen.findByRole('alert')).toHaveTextContent('Aucun colis ne correspond à ce numéro de suivi. (LGT-00000000)');
    expect(screen.getByLabelText('Numéro de suivi')).toHaveValue('LGT-00000000');
  });

  it('signale un serveur injoignable sans prétendre que le colis est introuvable', async () => {
    api.get.mockRejectedValue(new Error('Network Error'));
    show('/tracking/LGT-1A2B3C4D');
    expect(await screen.findByRole('alert')).toHaveTextContent('Serveur injoignable');
  });

  it('la recherche publique navigue vers l’URL partageable du numéro saisi', () => {
    show('/tracking');
    fireEvent.change(screen.getByLabelText('Numéro de suivi'), { target: { value: ' lgt-1a2b 3c4d ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Suivre' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/tracking/LGT-1A2B3C4D');
  });

  it('la recherche interne utilise la route connectée existante', () => {
    show('/app/packages/tracking');
    fireEvent.change(screen.getByLabelText('Numéro de suivi'), { target: { value: 'lgt-1a2b3c4d' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Suivre' }).closest('form') as HTMLFormElement);
    expect(screen.getByTestId('location')).toHaveTextContent('/app/packages/tracking?number=LGT-1A2B3C4D');
  });

  it('applique une mise à jour temps réel au statut et à l’historique', async () => {
    api.get.mockResolvedValue({ data: { success: true, data: publicPackage } });
    show('/tracking/LGT-1A2B3C4D');
    await screen.findByText('En transit • 3/7');

    await act(async () => {
      ws.handlers.tracking_update({ packageId: 'x', trackingNumber: 'LGT-1A2B3C4D', status: 'delivered', location: 'Kinshasa', timestamp: '2026-11-05T10:00:00.000Z' });
    });
    expect(screen.getByText('Livré • 7/7')).toBeInTheDocument();
    expect(screen.getByText('Kinshasa')).toBeInTheDocument();

    // Événement d'un autre colis : ignoré
    await act(async () => {
      ws.handlers.tracking_update({ trackingNumber: 'LGT-FFFFFFFF', status: 'lost', timestamp: '2026-11-06T10:00:00.000Z' });
    });
    expect(screen.queryByText('Perdu')).not.toBeInTheDocument();
  });
});
