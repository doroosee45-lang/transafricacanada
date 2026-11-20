import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  SparklesIcon,
  UserIcon,
  CubeIcon,
  CreditCardIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, formatByCurrency, sumByCurrency, packageCurrency } from '../../config/currencies';
import { asHttpError } from '../../types/api';
import type { Client, Package } from '../../types/models';

/** Valeurs du formulaire d'enregistrement d'un paiement. */
interface PaymentFormValues {
  client: string;
  amount: string | number;
  method: string;
  status: string;
  paymentDate: string;
  packages: string[];
  notes: string;
  mobileNumber: string;
  transactionId: string;
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
  orange:     '#ea580c',
  purple:     '#7c3aed',
  rose:       '#dc2626',
  textSec:    '#52677D',
  textMut:    '#8295A8',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 80,
};

const AddPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PaymentFormValues>({
    defaultValues: {
      client:      location.state?.clientId  || '',
      amount:      location.state?.amount    || '',
      method:      'cash',
      status:      'pending',
      paymentDate: new Date().toISOString().split('T')[0],
      packages:    [],
      notes:       '',
      mobileNumber:  '',
      transactionId: '',
    },
  });

  const [clients,        setClients]        = useState<Client[]>([]);
  const [clientPackages, setClientPackages]  = useState<Package[]>([]);
  const [searchClient,   setSearchClient]    = useState('');
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);
  const [loading,        setLoading]         = useState(false);
  const [initDone,       setInitDone]        = useState(false);

  const selectedMethod = watch('method');
  const isMobileMoney  = selectedMethod === 'mobile_money';

  /* ── Pré-chargement depuis location.state (ex : venant de PackageDetail) ── */
  useEffect(() => {
    if (initDone) return;
    const init = async () => {
      // Charger le client pré-sélectionné
      if (location.state?.clientId) {
        try {
          const r = await axios.get(`/clients/${location.state.clientId}`);
          const c = r.data?.data;
          if (c) {
            setValue('client', c._id);
            setSearchClient(`${c.firstName} ${c.lastName}`);
            const pkgs = await loadClientPackages(c._id);
            // Pré-sélectionner le colis si fourni
            if (location.state?.packageId) {
              const pre = pkgs.find((p: Package) => p._id === location.state.packageId);
              if (pre) setSelectedPackages([pre]);
            }
          }
        } catch {}
      }
      setInitDone(true);
    };
    init();
  }, []); // eslint-disable-line

  /* ── Recherche client au clavier ── */
  useEffect(() => {
    if (searchClient.length > 2) searchClients();
    else if (!searchClient) setClients([]);
  }, [searchClient]); // eslint-disable-line

  /* ── Recharge les colis quand le client change ── */
  const clientId = watch('client');
  useEffect(() => {
    if (clientId && initDone) loadClientPackages(clientId);
  }, [clientId]); // eslint-disable-line

  const searchClients = async () => {
    try {
      const r = await axios.get(`/clients?search=${encodeURIComponent(searchClient)}&limit=6`);
      setClients(Array.isArray(r.data?.data) ? r.data.data : []);
    } catch { setClients([]); }
  };

  const loadClientPackages = async (cId: string): Promise<Package[]> => {
    try {
      const r = await axios.get(`/clients/${cId}/packages?limit=50`);
      const pkgs = (Array.isArray(r.data?.data) ? r.data.data : []).filter((p: Package)=>!p.financial);
      setClientPackages(pkgs);
      return pkgs;
    } catch { setClientPackages([]); return []; }
  };

  const selectClient = (c: Client) => {
    setValue('client', c._id);
    setSearchClient(`${c.firstName} ${c.lastName}`);
    setShowClientSearch(false);
    setSelectedPackages([]);
  };

  const togglePackage = (pkg: Package) => {
    if(pkg.financial){toast.error('Encaissez ce colis depuis son détail multidevise.');return;}
    setSelectedPackages(prev => {
      const already = prev.some(p => p._id === pkg._id);
      return already ? prev.filter(p => p._id !== pkg._id) : [...prev, pkg];
    });
  };

  /* CORRECTION: utiliser totalPrice (et non shippingCost qui n'existe pas) */
  const calculateTotal = () =>
    (() => { const t = Object.values(sumByCurrency(selectedPackages, (p) => p.totalPrice || 0, (p) => packageCurrency(p))); return t.length === 1 ? t[0] : 0; })();

  const onSubmit = async (data: PaymentFormValues) => {
    if (selectedPackages.length === 0) {
      toast.error('Veuillez sélectionner au moins un colis');
      return;
    }
    setLoading(true);
    try {
      const paymentData = {
        client:   data.client,
        method:   data.method,
        status:   data.status,
        paymentDate: data.paymentDate,
        notes:    data.notes,
        mobileNumber:  data.mobileNumber,
        transactionId: data.transactionId,
        packages: selectedPackages.map(p => p._id),
        amount:   calculateTotal(),
      };
      const res = await axios.post('/payments', paymentData);
      toast.success('Paiement enregistré avec succès ✅');
      // Rediriger vers le détail du paiement créé
      const newId = res.data?.data?._id;
      navigate(newId ? `/app/payments/${newId}` : '/app/payments');
    } catch (caught) {
      const error = asHttpError(caught);
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>

      {/* ─────────────── HERO — identique à ClientsList ─────────────── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 280,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#172F50', padding: '0 24px', maxWidth: 640 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '6px 16px', marginBottom: 18,
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#C5DCEF' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              PAIEMENT
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Enregistrer un paiement{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              simple et sécurisé
            </span>
          </h1>
          <p style={{ color: '#172F50', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Sélectionnez un client, choisissez les colis concernés et validez le paiement.
          </p>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── FORMULAIRE ─────────────── */}
      <div className="page-content" style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 48px' }}>
        <div style={{
          background: '#fff', borderRadius: 20,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 2px 8px rgba(23,47,80,.05)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 24px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${tk.accent}10`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <CreditCardIcon style={{ width: 20, height: 20, color: tk.accent }} />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: tk.ink }}>Nouveau paiement</h2>
                <p style={{ fontSize: 12, color: tk.textMut, marginTop: 2 }}>Enregistrez un nouveau paiement pour un client</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24 }}>

            {/* Section Client */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <UserIcon style={{ width: 16, height: 16, color: tk.accent }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: tk.ink }}>Client</span>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <MagnifyingGlassIcon style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    width: 16, height: 16, color: tk.textMut, zIndex: 1,
                  }} />
                  <input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={searchClient}
                    onChange={(e) => {
                      setSearchClient(e.target.value);
                      setShowClientSearch(true);
                    }}
                    onFocus={() => setShowClientSearch(true)}
                    style={{ ...inputStyle, paddingLeft: 38 }}
                  />
                </div>
                {showClientSearch && searchClient.length > 2 && (
                  <div style={{
                    position: 'absolute', zIndex: 10, marginTop: 4, width: '100%',
                    background: '#fff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: `1.5px solid ${tk.border}`, maxHeight: 240, overflowY: 'auto',
                  }}>
                    {clients.map((client) => (
                      <button
                        key={client._id}
                        type="button"
                        onClick={() => selectClient(client)}
                        style={{
                          width: '100%', textAlign: 'left', padding: '12px 16px',
                          borderBottom: `1px solid ${tk.border}`, cursor: 'pointer',
                          transition: 'background .15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = tk.surface}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        <div style={{ fontWeight: 600, fontSize: 14, color: tk.ink }}>
                          {client.firstName} {client.lastName}
                        </div>
                        <div style={{ fontSize: 12, color: tk.textMut }}>
                          {client.email} • {client.phone}
                        </div>
                      </button>
                    ))}
                    {clients.length === 0 && (
                      <div style={{ padding: '12px 16px', color: tk.textMut, fontSize: 13 }}>
                        Aucun client trouvé
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.client && <p style={{ marginTop: 6, fontSize: 11, color: tk.rose }}>Veuillez sélectionner un client</p>}
            </div>

            {/* Section Colis à payer */}
            {watch('client') && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <CubeIcon style={{ width: 16, height: 16, color: tk.accent }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: tk.ink }}>Colis à payer</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 600,
                    background: 'rgba(77,145,217,.08)', color: tk.accent,
                  }}>
                    {selectedPackages.length} sélectionné{selectedPackages.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{
                  background: tk.surface, borderRadius: 16, padding: 16,
                  border: `1px solid ${tk.border}`,
                }}>
                  {clientPackages.length > 0 ? (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {clientPackages.map((pkg) => {
                          const isSelected = selectedPackages.some(p => p._id === pkg._id);
                          return (
                            <label
                              key={pkg._id}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px 14px', background: '#fff', borderRadius: 12,
                                border: `1.5px solid ${isSelected ? tk.accent : tk.border}`,
                                cursor: 'pointer', transition: 'all .15s',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => togglePackage(pkg)}
                                  style={{ width: 16, height: 16, accentColor: tk.accent }}
                                />
                                <div>
                                  <p style={{ fontWeight: 600, fontSize: 13, color: tk.ink }}>{pkg.trackingNumber}</p>
                                  <p style={{ fontSize: 11, color: tk.textMut }}>
                                    Destination: {pkg.destination || '—'} • Poids: {pkg.weight}kg
                                  </p>
                                </div>
                              </div>
                              <div style={{ fontWeight: 700, fontSize: 15, color: tk.accent }}>
                                {pkg.totalPrice != null ? formatMoney(pkg.totalPrice, packageCurrency(pkg)) : '—'}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      <div style={{
                        marginTop: 16, paddingTop: 16, borderTop: `1px solid ${tk.border}`,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: tk.ink }}>Total à payer</span>
                        <span style={{ fontSize: 24, fontWeight: 700, color: tk.accent }}>
                          {formatByCurrency(sumByCurrency(selectedPackages, (p) => p.totalPrice || 0, (p) => packageCurrency(p)))}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p style={{ textAlign: 'center', padding: '24px', color: tk.textMut, fontSize: 13 }}>
                      Aucun colis en attente de paiement pour ce client
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Section Détails du paiement */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <CreditCardIcon style={{ width: 16, height: 16, color: tk.accent }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: tk.ink }}>Détails du paiement</span>
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Méthode de paiement - version améliorée avec toutes les options */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                    Méthode de paiement *
                  </label>
                  <select {...register('method', { required: 'La méthode est requise' })} style={inputStyle}>
                    <optgroup label="💳 Paiements traditionnels">
                      <option value="cash">💵 Espèces</option>
                      <option value="card">💳 Carte bancaire</option>
                      <option value="bank_transfer">🏦 Virement bancaire</option>
                      <option value="cheque">📝 Chèque</option>
                    </optgroup>
                    <optgroup label="📱 Mobile Money">
                      <option value="mobile_money">📱 Mobile Money (M-Pesa, Orange, Airtel…)</option>
                    </optgroup>
                  </select>
                  {errors.method && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.method.message}</p>}
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                    <CalendarIcon style={{ width: 14, height: 14, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                    Date de paiement
                  </label>
                  <input type="date" {...register('paymentDate')} style={inputStyle} />
                </div>

                {/* Champs supplémentaires pour Mobile Money */}
                {isMobileMoney && (
                  <>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                        <PhoneIcon style={{ width: 14, height: 14, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        Numéro de téléphone *
                      </label>
                      <input
                        type="tel"
                        placeholder="+243 XXX XXX XXX"
                        {...register('mobileNumber', { required: isMobileMoney ? 'Le numéro est requis' : false })}
                        style={inputStyle}
                      />
                      {errors.mobileNumber && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.mobileNumber.message}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                        ID de transaction
                      </label>
                      <input
                        type="text"
                        placeholder="Référence de la transaction"
                        {...register('transactionId')}
                        style={inputStyle}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                    Statut
                  </label>
                  <select {...register('status')} style={inputStyle}>
                    <option value="pending">En attente</option>
                    <option value="paid">Payé</option>
                    <option value="partial">Partiel</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                    <DocumentTextIcon style={{ width: 14, height: 14, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                    Notes
                  </label>
                  <textarea {...register('notes')} rows={3} style={textareaStyle} placeholder="Informations complémentaires..." />
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTop: `1px solid ${tk.border}` }}>
              <button
                type="button"
                onClick={() => navigate('/app/payments')}
                style={{
                  padding: '10px 24px', borderRadius: 10,
                  border: `1.5px solid ${tk.border}`, background: '#fff',
                  fontSize: 13, fontWeight: 500, color: tk.textSec,
                  cursor: 'pointer', transition: 'all .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = tk.surface; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || selectedPackages.length === 0}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 24px', borderRadius: 10,
                  background: '#347FC5', color: '#fff', border: 'none',
                  fontSize: 13, fontWeight: 600, cursor: loading || selectedPackages.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: loading || selectedPackages.length === 0 ? 0.6 : 1,
                  transition: 'all .15s',
                }}
              >
                {loading ? (
                  <>
                    <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon style={{ width: 14, height: 14 }} />
                    Enregistrer le paiement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AddPayment;