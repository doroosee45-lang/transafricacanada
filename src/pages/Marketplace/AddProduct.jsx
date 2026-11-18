// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import {
//   PhotoIcon,
//   XMarkIcon,
//   SparklesIcon,
//   TagIcon,
//   CurrencyEuroIcon,
//   MapPinIcon,
//   FolderIcon,
//   CheckCircleIcon,
//   UserIcon,
//   EnvelopeIcon,
//   PhoneIcon,
//   ArrowRightIcon,
//   ArrowLeftIcon,
// } from '@heroicons/react/24/outline';
// import { toast } from 'react-toastify';
// import axios from '../../api/axios';
// import Footer from '../../components/Layout/Footer';

// /* ─────────────────────────────────────────────
//    DESIGN TOKENS — identiques à ClientsList
// ───────────────────────────────────────────── */
// const tk = {
//   ink:     '#171614',
//   ink80:   '#26231e',
//   surface: '#faf8f5',
//   surf2:   '#f5efe6',
//   border:  '#e9e1d5',
//   accent:  '#a77b28',
//   emerald: '#059669',
//   amber:   '#d97706',
//   rose:    '#dc2626',
//   textSec: '#4b5a6e',
//   textMut: '#8494a9',
// };

// const inputStyle = {
//   width: '100%', padding: '10px 14px', borderRadius: 10,
//   background: '#fff', color: tk.ink, fontSize: 14,
//   border: `1.5px solid ${tk.border}`, outline: 'none',
//   fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
// };

// const Field = ({ label, required, icon: Icon, error, children }) => (
//   <div style={{ marginBottom: 16 }}>
//     <label style={{
//       display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
//       fontSize: 13, fontWeight: 500, color: tk.textSec,
//     }}>
//       {Icon && <Icon style={{ width: 14, height: 14, color: tk.textMut }} />}
//       {label}
//       {required && <span style={{ color: tk.rose }}>*</span>}
//     </label>
//     {children}
//     {error && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{error}</p>}
//   </div>
// );

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [images, setImages] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const categories = ['Électronique', 'Mode', 'Maison', 'Sports', 'Livres', 'Véhicules', 'Autre'];

//   const {
//     register,
//     handleSubmit,
//     trigger,
//     getValues,
//     formState: { errors },
//   } = useForm({
//     mode: 'onChange',
//     defaultValues: {
//       sellerName: '', sellerEmail: '', sellerPhone: '',
//       title: '', description: '', category: '', price: '', originalPrice: '',
//       location: '', condition: 'neuf', stock: 1, featured: false,
//     },
//   });

//   const steps = [
//     { id: 0, name: 'Vendeur',     icon: UserIcon,         fields: ['sellerName', 'sellerEmail', 'sellerPhone'] },
//     { id: 1, name: 'Produit',     icon: TagIcon,          fields: ['title', 'description', 'category', 'price'] },
//     { id: 2, name: 'Localisation',icon: MapPinIcon,       fields: ['location', 'condition', 'stock'] },
//     { id: 3, name: 'Résumé',      icon: CheckCircleIcon,  fields: [] },
//   ];

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (images.length + files.length > 5) { toast.error('Maximum 5 images autorisées'); return; }
//     const valid = [], invalid = [];
//     for (const f of files) {
//       if (!f.type.startsWith('image/')) invalid.push(f.name);
//       else if (f.size > 5 * 1024 * 1024) invalid.push(`${f.name} (>5 Mo)`);
//       else valid.push(f);
//     }
//     if (invalid.length) toast.error(`Fichiers ignorés : ${invalid.join(', ')}`);
//     if (!valid.length) return;
//     setUploading(true);
//     Promise.all(valid.map(f => new Promise(res => {
//       const r = new FileReader();
//       r.onloadend = () => res({ url: r.result, publicId: `local-${Date.now()}-${Math.random()}` });
//       r.readAsDataURL(f);
//     }))).then(imgs => { setImages(p => [...p, ...imgs]); setUploading(false); toast.success(`${imgs.length} image(s) ajoutée(s)`); });
//   };

//   const removeImage = (i) => setImages(p => p.filter((_, idx) => idx !== i));

//   const nextStep = async () => {
//     if (await trigger(steps[currentStep].fields)) setCurrentStep(p => Math.min(p + 1, steps.length - 1));
//   };
//   const prevStep = () => setCurrentStep(p => Math.max(p - 1, 0));

//   const onSubmit = async () => {
//     if (!images.length) { toast.error('Veuillez ajouter au moins une image'); return; }
//     setLoading(true);
//     const data = getValues();
//     try {
//       await axios.post('/marketplace/products', {
//         ...data,
//         images: images.map(i => ({ url: i.url, publicId: i.publicId })),
//         price: parseFloat(data.price),
//         originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
//         stock: parseInt(data.stock),
//       });
//       toast.success('Produit publié avec succès');
//       navigate('/app/marketplace/products');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Erreur lors de la publication');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0: return (
//         <>
//           <Field label="Nom complet" required icon={UserIcon} error={errors.sellerName?.message}>
//             <input type="text" {...register('sellerName', { required: 'Le nom est requis' })} style={inputStyle} placeholder="Jean Dupont" />
//           </Field>
//           <Field label="Email" required icon={EnvelopeIcon} error={errors.sellerEmail?.message}>
//             <input type="email" {...register('sellerEmail', {
//               required: "L'email est requis",
//               pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' },
//             })} style={inputStyle} placeholder="jean@exemple.com" />
//           </Field>
//           <Field label="Téléphone" required icon={PhoneIcon} error={errors.sellerPhone?.message}>
//             <input type="tel" {...register('sellerPhone', { required: 'Le téléphone est requis' })} style={inputStyle} placeholder="+33 6 12 34 56 78" />
//           </Field>
//         </>
//       );

//       case 1: return (
//         <>
//           <Field label="Titre" required error={errors.title?.message}>
//             <input type="text" {...register('title', { required: 'Le titre est requis' })} style={inputStyle} placeholder="Ex : iPhone 13 Pro Max 256 Go" />
//           </Field>
//           <Field label="Description" required error={errors.description?.message}>
//             <textarea rows={4} {...register('description', { required: 'La description est requise' })}
//               style={{ ...inputStyle, resize: 'none' }} placeholder="État, caractéristiques, accessoires inclus…" />
//           </Field>
//           <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//             <Field label="Catégorie" required icon={FolderIcon} error={errors.category?.message}>
//               <select {...register('category', { required: 'La catégorie est requise' })} style={inputStyle}>
//                 <option value="">Sélectionner…</option>
//                 {categories.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </Field>
//             <Field label="Prix (€)" required icon={CurrencyEuroIcon} error={errors.price?.message}>
//               <input type="number" step="0.01" {...register('price', {
//                 required: 'Le prix est requis',
//                 min: { value: 0, message: 'Prix positif requis' },
//               })} style={inputStyle} placeholder="0.00" />
//             </Field>
//             <Field label="Prix d'origine (€)">
//               <input type="number" step="0.01" {...register('originalPrice')} style={inputStyle} placeholder="0.00" />
//             </Field>
//           </div>
//         </>
//       );

//       case 2: return (
//         <>
//           <Field label="Localisation" required icon={MapPinIcon} error={errors.location?.message}>
//             <input type="text" {...register('location', { required: 'La localisation est requise' })} style={inputStyle} placeholder="Paris, France" />
//           </Field>
//           <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//             <Field label="État">
//               <select {...register('condition')} style={inputStyle}>
//                 {['neuf', 'comme neuf', 'bon état', 'état correct'].map(v => (
//                   <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
//                 ))}
//               </select>
//             </Field>
//             <Field label="Stock">
//               <input type="number" min="1" {...register('stock')} style={inputStyle} />
//             </Field>
//           </div>
//           <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 8 }}>
//             <input type="checkbox" {...register('featured')}
//               style={{ width: 16, height: 16, marginTop: 2, accentColor: tk.accent }} />
//             <span style={{ fontSize: 13, color: tk.textSec }}>
//               <span style={{ fontWeight: 500, color: tk.ink }}>Mettre en avant</span>
//               {' — meilleure visibilité (option payante)'}
//             </span>
//           </label>
//         </>
//       );

//       case 3:
//         const d = getValues();
//         const sections = [
//           { icon: UserIcon,   title: 'Vendeur',      rows: [['Nom', d.sellerName], ['Email', d.sellerEmail], ['Tél.', d.sellerPhone]] },
//           { icon: TagIcon,    title: 'Produit',      rows: [['Titre', d.title], ['Catégorie', d.category], ['Prix', `${d.price} €`], d.originalPrice && ['Prix d\'origine', `${d.originalPrice} €`]].filter(Boolean) },
//           { icon: MapPinIcon, title: 'Localisation', rows: [['Lieu', d.location], ['État', d.condition], ['Stock', d.stock], ['Mis en avant', d.featured ? 'Oui' : 'Non']] },
//         ];
//         return (
//           <>
//             {sections.map(({ icon: Icon, title, rows }) => (
//               <div key={title} style={{
//                 borderRadius: 12, border: `1px solid ${tk.border}`, overflow: 'hidden', marginBottom: 16,
//               }}>
//                 <div style={{
//                   display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
//                   background: tk.surface, borderBottom: `1px solid ${tk.border}`,
//                 }}>
//                   <Icon style={{ width: 14, height: 14, color: tk.accent }} />
//                   <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>{title}</span>
//                 </div>
//                 <div style={{ padding: '12px 16px' }}>
//                   {rows.map(([k, v]) => (
//                     <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
//                       <span style={{ fontSize: 12, color: tk.textMut }}>{k}</span>
//                       <span style={{ fontSize: 13, fontWeight: 500, color: tk.ink, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             <div style={{
//               borderRadius: 12, border: `1px solid ${tk.border}`, overflow: 'hidden',
//             }}>
//               <div style={{
//                 display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
//                 background: tk.surface, borderBottom: `1px solid ${tk.border}`,
//               }}>
//                 <PhotoIcon style={{ width: 14, height: 14, color: tk.accent }} />
//                 <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>Photos</span>
//               </div>
//               <div style={{ padding: 16 }}>
//                 {images.length
//                   ? <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//                       {images.map((img, i) => (
//                         <img key={i} src={img.url} alt=""
//                           style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', border: `1px solid ${tk.border}` }} />
//                       ))}
//                     </div>
//                   : <p style={{ fontSize: 13, color: tk.rose }}>Aucune photo — veuillez en ajouter au moins une.</p>
//                 }
//               </div>
//             </div>
//           </>
//         );

//       default: return null;
//     }
//   };

//   return (
//     <div style={{ minHeight: '100vh', background: tk.surface }}>

//       {/* ─────────────── HERO — identique à ClientsList ─────────────── */}
//       <section style={{
//         position: 'relative', height: 280,
//         display: 'flex', flexDirection: 'column',
//         alignItems: 'center', justifyContent: 'center',
//         overflow: 'hidden',
//       }}>
//         <div style={{ position: 'absolute', inset: 0 }}>
//           <div style={{
//             position: 'absolute', inset: 0,
//             backgroundImage: "url('https://topcargointernational.com/assets/plane2.png')",
//             backgroundSize: 'cover', backgroundPosition: 'center',
//             animation: 'zoom-slow 12s ease-in-out infinite alternate',
//           }} />
//           <div style={{
//             position: 'absolute', inset: 0,
//             background: 'linear-gradient(135deg, rgba(23,22,20,.88) 0%, rgba(167,123,40,.55) 60%, rgba(23,22,20,.75) 100%)',
//           }} />
//           <div style={{
//             position: 'absolute', inset: 0,
//             backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)',
//             backgroundSize: '28px 28px',
//           }} />
//         </div>

//         <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff', padding: '0 24px', maxWidth: 640 }}>
//           <div style={{
//             display: 'inline-flex', alignItems: 'center', gap: 8,
//             background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
//             border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
//             padding: '6px 16px', marginBottom: 18,
//           }}>
//             <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
//             <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
//               Mettre en vente
//             </span>
//           </div>

//           <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//             Mettez votre article en vente{' '}
//             <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//               en quelques étapes
//             </span>
//           </h1>
//           <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
//             Remplissez les informations ci-dessous. Notre équipe vérifiera votre annonce rapidement.
//           </p>

//           {/* Step indicators */}
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
//             {steps.map((s, i) => (
//               <div key={s.id} style={{
//                 height: 4, borderRadius: 99, transition: 'all .3s',
//                 width: i === currentStep ? 28 : 16,
//                 background: i === currentStep ? '#fff' : i < currentStep ? tk.emerald : 'rgba(255,255,255,.25)',
//               }} />
//             ))}
//           </div>
//         </div>

//         <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
//             <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
//           </svg>
//         </div>
//       </section>

//       {/* ─────────────── CONTENU ─────────────── */}
//       <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 48px' }}>

//         {/* Card principale */}
//         <div style={{
//           background: '#fff', borderRadius: 20,
//           border: `1.5px solid ${tk.border}`,
//           boxShadow: '0 2px 8px rgba(23,22,20,.05)',
//           overflow: 'hidden',
//         }}>
//           {/* Stepper header */}
//           <div style={{
//             padding: '16px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               {steps.map((step, idx) => {
//                 const Icon = step.icon;
//                 const done = idx < currentStep;
//                 const active = idx === currentStep;
//                 return (
//                   <React.Fragment key={step.id}>
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
//                       <div style={{
//                         width: 36, height: 36, borderRadius: 99,
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         background: done ? tk.emerald : active ? tk.accent : tk.border,
//                         color: '#fff', transition: 'all .15s',
//                       }}>
//                         {done ? <CheckCircleIcon style={{ width: 16, height: 16 }} /> : <Icon style={{ width: 16, height: 16 }} />}
//                       </div>
//                       <span style={{
//                         fontSize: 10, fontWeight: 600,
//                         color: active ? tk.accent : done ? tk.emerald : tk.textMut,
//                       }}>{step.name}</span>
//                     </div>
//                     {idx < steps.length - 1 && (
//                       <div style={{
//                         flex: 1, height: 2, margin: '0 8px',
//                         background: tk.border, borderRadius: 99, overflow: 'hidden',
//                       }}>
//                         <div style={{
//                           width: done ? '100%' : 0, height: '100%',
//                           background: `linear-gradient(90deg, ${tk.accent}, ${tk.emerald})`,
//                           transition: 'width .3s',
//                         }} />
//                       </div>
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </div>
//           </div>

//           <div style={{ padding: '20px' }}>

//             {/* Photos */}
//             <div style={{ marginBottom: 24 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
//                 <PhotoIcon style={{ width: 16, height: 16, color: tk.accent }} />
//                 <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>Photos du produit</span>
//                 <span style={{ fontSize: 11, color: tk.textMut }}>({images.length}/5)</span>
//               </div>

//               <div className="form-photos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
//                 {images.map((img, i) => (
//                   <div key={i} style={{
//                     position: 'relative', aspectRatio: '1/1', borderRadius: 12,
//                     overflow: 'hidden', border: `1.5px solid ${tk.border}`, background: tk.surface,
//                   }}>
//                     <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(i)}
//                       style={{
//                         position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)',
//                         opacity: 0, cursor: 'pointer', transition: 'opacity .15s',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       }}
//                       onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
//                       onMouseLeave={e => { e.currentTarget.style.opacity = 0; }}
//                     >
//                       <XMarkIcon style={{ width: 20, height: 20, color: '#fff' }} />
//                     </button>
//                   </div>
//                 ))}
//                 {images.length < 5 && (
//                   <label style={{
//                     aspectRatio: '1/1', borderRadius: 12, border: `1.5px dashed ${tk.border}`,
//                     display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//                     cursor: 'pointer', transition: 'all .15s', background: tk.surface,
//                   }}
//                   onMouseEnter={e => { e.currentTarget.style.borderColor = tk.accent; e.currentTarget.style.background = `${tk.accent}05`; }}
//                   onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.background = tk.surface; }}>
//                     <PhotoIcon style={{ width: 20, height: 20, color: tk.textMut }} />
//                     <span style={{ fontSize: 10, color: tk.textMut, marginTop: 4 }}>Ajouter</span>
//                     <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
//                   </label>
//                 )}
//               </div>

//               {uploading && (
//                 <p style={{ fontSize: 11, color: tk.accent, marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
//                   <span style={{ width: 12, height: 12, border: `2px solid ${tk.accent}`, borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
//                   Téléchargement en cours…
//                 </p>
//               )}
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div style={{ marginBottom: 20 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
//                   {React.createElement(steps[currentStep].icon, { style: { width: 16, height: 16, color: tk.accent } })}
//                   <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>{steps[currentStep].name}</span>
//                   <span style={{ marginLeft: 'auto', fontSize: 11, color: tk.textMut }}>Étape {currentStep + 1} sur {steps.length}</span>
//                 </div>
//                 {renderStep()}
//               </div>

//               {/* Navigation */}
//               <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: `1px solid ${tk.border}` }}>
//                 <button
//                   type="button"
//                   onClick={prevStep}
//                   style={{
//                     display: 'flex', alignItems: 'center', gap: 6,
//                     padding: '8px 16px', borderRadius: 10,
//                     background: '#fff', border: `1.5px solid ${tk.border}`,
//                     fontSize: 13, fontWeight: 500, color: tk.textSec,
//                     cursor: 'pointer', transition: 'all .15s', visibility: currentStep === 0 ? 'hidden' : 'visible',
//                   }}
//                 >
//                   <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Précédent
//                 </button>

//                 {currentStep < steps.length - 1 ? (
//                   <button
//                     type="button"
//                     onClick={nextStep}
//                     style={{
//                       display: 'flex', alignItems: 'center', gap: 6,
//                       padding: '8px 20px', borderRadius: 10,
//                       background: tk.accent, color: '#fff', border: 'none',
//                       fontSize: 13, fontWeight: 600, cursor: 'pointer',
//                       transition: 'all .15s',
//                     }}
//                   >
//                     Suivant <ArrowRightIcon style={{ width: 14, height: 14 }} />
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={loading || uploading || !images.length}
//                     style={{
//                       display: 'flex', alignItems: 'center', gap: 6,
//                       padding: '8px 20px', borderRadius: 10,
//                       background: tk.emerald, color: '#fff', border: 'none',
//                       fontSize: 13, fontWeight: 600, cursor: loading || uploading || !images.length ? 'not-allowed' : 'pointer',
//                       opacity: loading || uploading || !images.length ? 0.6 : 1,
//                       transition: 'all .15s',
//                     }}
//                   >
//                     {loading ? (
//                       <>
//                         <span style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
//                         Publication…
//                       </>
//                     ) : (
//                       <><CheckCircleIcon style={{ width: 14, height: 14 }} /> Publier le produit</>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//
//       <style>{`
//         @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// };

// export default AddProduct;






import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  PhotoIcon, XMarkIcon, SparklesIcon, TagIcon, CurrencyEuroIcon,
  MapPinIcon, FolderIcon, CheckCircleIcon, UserIcon, EnvelopeIcon,
  PhoneIcon, ArrowRightIcon, ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, withCurrencyLabel, CURRENCIES } from '../../config/currencies';

const tk = {
  ink: '#171614', ink80: '#26231e', surface: '#faf8f5', surf2: '#f5efe6',
  border: '#e9e1d5', accent: '#a77b28', emerald: '#059669',
  amber: '#d97706', rose: '#dc2626', textSec: '#4b5a6e', textMut: '#8494a9',
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
};

const Field = ({ label, required, icon: Icon, error, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
      fontSize: 13, fontWeight: 500, color: tk.textSec,
    }}>
      {Icon && <Icon style={{ width: 14, height: 14, color: tk.textMut }} />}
      {label}
      {required && <span style={{ color: tk.rose }}>*</span>}
    </label>
    {children}
    {error && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{error}</p>}
  </div>
);

// ✅ label affiché à l'écran, value envoyé au backend (aligné avec l'enum du modèle)
const CATEGORIES = [
  { label: 'Électronique', value: 'electronique' },
  { label: 'Vêtements',    value: 'vetements'    },
  { label: 'Alimentaire',  value: 'alimentaire'  },
  { label: 'Cosmétique',   value: 'cosmetique'   },
  { label: 'Autre',        value: 'autre'        },
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register, handleSubmit, trigger, getValues, watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      sellerName: '', sellerEmail: '', sellerPhone: '',
      title: '', description: '', category: '', price: '', originalPrice: '', currency: '',
      location: '', condition: 'neuf', stock: 1, featured: false,
    },
  });

  const steps = [
    { id: 0, name: 'Vendeur',      icon: UserIcon,        fields: ['sellerName', 'sellerEmail', 'sellerPhone'] },
    { id: 1, name: 'Produit',      icon: TagIcon,         fields: ['title', 'description', 'category', 'currency', 'price'] },
    { id: 2, name: 'Localisation', icon: MapPinIcon,      fields: ['location', 'condition', 'stock'] },
    { id: 3, name: 'Résumé',       icon: CheckCircleIcon, fields: [] },
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) { toast.error('Maximum 5 images autorisées'); return; }
    const valid = [], invalid = [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) invalid.push(f.name);
      else if (f.size > 5 * 1024 * 1024) invalid.push(`${f.name} (>5 Mo)`);
      else valid.push(f);
    }
    if (invalid.length) toast.error(`Fichiers ignorés : ${invalid.join(', ')}`);
    if (!valid.length) return;
    setUploading(true);
    Promise.all(valid.map(f => new Promise(res => {
      const r = new FileReader();
      r.onloadend = () => res({ url: r.result, file: f, publicId: `local-${Date.now()}-${Math.random()}` });
      r.readAsDataURL(f);
    }))).then(imgs => {
      setImages(p => [...p, ...imgs]);
      setUploading(false);
      toast.success(`${imgs.length} image(s) ajoutée(s)`);
    });
  };

  const removeImage = (i) => setImages(p => p.filter((_, idx) => idx !== i));

  const nextStep = async () => {
    if (await trigger(steps[currentStep].fields))
      setCurrentStep(p => Math.min(p + 1, steps.length - 1));
  };
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 0));

  const onSubmit = async () => {
    // Soumission avant la dernière étape (touche Entrée dans un champ) : on avance d'une étape
    // au lieu de publier sans que l'utilisateur ait vu le résumé.
    if (currentStep < steps.length - 1) { await nextStep(); return; }
    if (!images.length) { toast.error('Veuillez ajouter au moins une image'); return; }
    setLoading(true);
    const data = getValues();
    try {
      const formData = new FormData();
      formData.append('title',       data.title);
      formData.append('description', data.description);
      formData.append('category',    data.category);
      formData.append('price',       parseFloat(data.price));
      formData.append('currency',    data.currency);
      formData.append('location',    data.location);
      formData.append('condition',   data.condition);
      formData.append('stock',       parseInt(data.stock));
      formData.append('featured',    data.featured);
      formData.append('sellerName',  data.sellerName);
      formData.append('sellerEmail', data.sellerEmail);
      formData.append('sellerPhone', data.sellerPhone);
      if (data.originalPrice) formData.append('originalPrice', parseFloat(data.originalPrice));
      images.forEach(img => formData.append('images', img.file));

      await axios.post('/marketplace/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Produit publié avec succès');
      navigate('/app/marketplace/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la publication');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return (
        <>
          <Field label="Nom complet" required icon={UserIcon} error={errors.sellerName?.message}>
            <input type="text" {...register('sellerName', { required: 'Le nom est requis' })}
              style={inputStyle} placeholder="Jean Dupont" />
          </Field>
          <Field label="Email" required icon={EnvelopeIcon} error={errors.sellerEmail?.message}>
            <input type="email" {...register('sellerEmail', {
              required: "L'email est requis",
              pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' },
            })} style={inputStyle} placeholder="jean@exemple.com" />
          </Field>
          <Field label="Téléphone" required icon={PhoneIcon} error={errors.sellerPhone?.message}>
            <input type="tel" {...register('sellerPhone', { required: 'Le téléphone est requis' })}
              style={inputStyle} placeholder="+33 6 12 34 56 78" />
          </Field>
        </>
      );

      case 1: return (
        <>
          <Field label="Titre" required error={errors.title?.message}>
            <input type="text" {...register('title', { required: 'Le titre est requis' })}
              style={inputStyle} placeholder="Ex : iPhone 13 Pro Max 256 Go" />
          </Field>
          <Field label="Description" required error={errors.description?.message}>
            <textarea rows={4} {...register('description', { required: 'La description est requise' })}
              style={{ ...inputStyle, resize: 'none' }}
              placeholder="État, caractéristiques, accessoires inclus…" />
          </Field>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Catégorie" required icon={FolderIcon} error={errors.category?.message}>
              {/* ✅ value = slug enum, label = texte lisible */}
              <select {...register('category', { required: 'La catégorie est requise' })} style={inputStyle}>
                <option value="">Sélectionner…</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Devise du prix" required error={errors.currency?.message}>
              <select {...register('currency', { required: 'La devise est requise' })} style={inputStyle}>
                <option value="">Sélectionner…</option>
                {CURRENCIES.filter(c => !c.legacyOnly).map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
              </select>
            </Field>
            <Field label={withCurrencyLabel('Prix', watch('currency'))} required icon={CurrencyEuroIcon} error={errors.price?.message}>
              <input type="number" step="0.01" {...register('price', {
                required: 'Le prix est requis',
                min: { value: 0, message: 'Prix positif requis' },
              })} style={inputStyle} placeholder="0.00" />
            </Field>
            <Field label={withCurrencyLabel("Prix d'origine", watch('currency'))}>
              <input type="number" step="0.01" {...register('originalPrice')} style={inputStyle} placeholder="0.00" />
            </Field>
          </div>
        </>
      );

      case 2: return (
        <>
          <Field label="Localisation" required icon={MapPinIcon} error={errors.location?.message}>
            <input type="text" {...register('location', { required: 'La localisation est requise' })}
              style={inputStyle} placeholder="Paris, France" />
          </Field>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="État">
              <select {...register('condition')} style={inputStyle}>
                {['neuf', 'comme neuf', 'bon état', 'état correct'].map(v => (
                  <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                ))}
              </select>
            </Field>
            <Field label="Stock">
              <input type="number" min="1" {...register('stock')} style={inputStyle} />
            </Field>
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 8 }}>
            <input type="checkbox" {...register('featured')}
              style={{ width: 16, height: 16, marginTop: 2, accentColor: tk.accent }} />
            <span style={{ fontSize: 13, color: tk.textSec }}>
              <span style={{ fontWeight: 500, color: tk.ink }}>Mettre en avant</span>
              {' — meilleure visibilité (option payante)'}
            </span>
          </label>
        </>
      );

      case 3: {
        const d = getValues();
        // ✅ Affiche le label lisible dans le résumé
        const categoryLabel = CATEGORIES.find(c => c.value === d.category)?.label || d.category;
        const sections = [
          { icon: UserIcon,   title: 'Vendeur',      rows: [['Nom', d.sellerName], ['Email', d.sellerEmail], ['Tél.', d.sellerPhone]] },
          { icon: TagIcon,    title: 'Produit',      rows: [['Titre', d.title], ['Catégorie', categoryLabel], ['Prix', formatMoney(d.price, d.currency)], ...(d.originalPrice ? [["Prix d'origine", formatMoney(d.originalPrice, d.currency)]] : [])] },
          { icon: MapPinIcon, title: 'Localisation', rows: [['Lieu', d.location], ['État', d.condition], ['Stock', d.stock], ['Mis en avant', d.featured ? 'Oui' : 'Non']] },
        ];
        return (
          <>
            {sections.map(({ icon: Icon, title, rows }) => (
              <div key={title} style={{ borderRadius: 12, border: `1px solid ${tk.border}`, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
                  <Icon style={{ width: 14, height: 14, color: tk.accent }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>{title}</span>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  {rows.map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                      <span style={{ fontSize: 12, color: tk.textMut }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: tk.ink, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ borderRadius: 12, border: `1px solid ${tk.border}`, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
                <PhotoIcon style={{ width: 14, height: 14, color: tk.accent }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>Photos</span>
              </div>
              <div style={{ padding: 16 }}>
                {images.length
                  ? <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {images.map((img, i) => (
                        <img key={i} src={img.url} alt=""
                          style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', border: `1px solid ${tk.border}` }} />
                      ))}
                    </div>
                  : <p style={{ fontSize: 13, color: tk.rose }}>Aucune photo — veuillez en ajouter au moins une.</p>
                }
              </div>
            </div>
          </>
        );
      }

      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>
      <section className="easy-internal-header" style={{ position: 'relative', height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 24px', maxWidth: 640 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 18 }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>Mettre en vente</span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Mettez votre article en vente{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>en quelques étapes</span>
          </h1>
          <p style={{ color: '#37312a', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Remplissez les informations ci-dessous. Notre équipe vérifiera votre annonce rapidement.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {steps.map((s, i) => (
              <div key={s.id} style={{ height: 4, borderRadius: 99, transition: 'all .3s', width: i === currentStep ? 28 : 16, background: i === currentStep ? '#fff' : i < currentStep ? tk.emerald : 'rgba(255,255,255,.25)' }} />
            ))}
          </div>
        </div>
        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      <div className="page-content" style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 48px' }}>
        <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,22,20,.05)', overflow: 'hidden' }}>
          {/* Stepper header */}
          <div style={{ padding: '16px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const done = idx < currentStep;
                const active = idx === currentStep;
                return (
                  <React.Fragment key={step.id}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? tk.emerald : active ? tk.accent : tk.border, color: '#fff', transition: 'all .15s' }}>
                        {done ? <CheckCircleIcon style={{ width: 16, height: 16 }} /> : <Icon style={{ width: 16, height: 16 }} />}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: active ? tk.accent : done ? tk.emerald : tk.textMut }}>{step.name}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div style={{ flex: 1, height: 2, margin: '0 8px', background: tk.border, borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ width: done ? '100%' : 0, height: '100%', background: `linear-gradient(90deg, ${tk.accent}, ${tk.emerald})`, transition: 'width .3s' }} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Photos */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <PhotoIcon style={{ width: 16, height: 16, color: tk.accent }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>Photos du produit</span>
                <span style={{ fontSize: 11, color: tk.textMut }}>({images.length}/5)</span>
              </div>
              <div className="form-photos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', border: `1.5px solid ${tk.border}`, background: tk.surface }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removeImage(i)}
                      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)', opacity: 0, cursor: 'pointer', transition: 'opacity .15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = 0; }}>
                      <XMarkIcon style={{ width: 20, height: 20, color: '#fff' }} />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label style={{ aspectRatio: '1/1', borderRadius: 12, border: `1.5px dashed ${tk.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .15s', background: tk.surface }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = tk.accent; e.currentTarget.style.background = `${tk.accent}05`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.background = tk.surface; }}>
                    <PhotoIcon style={{ width: 20, height: 20, color: tk.textMut }} />
                    <span style={{ fontSize: 10, color: tk.textMut, marginTop: 4 }}>Ajouter</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                )}
              </div>
              {uploading && (
                <p style={{ fontSize: 11, color: tk.accent, marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, border: `2px solid ${tk.accent}`, borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                  Téléchargement en cours…
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                  {React.createElement(steps[currentStep].icon, { style: { width: 16, height: 16, color: tk.accent } })}
                  <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>{steps[currentStep].name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: tk.textMut }}>Étape {currentStep + 1} sur {steps.length}</span>
                </div>
                {renderStep()}
              </div>

              <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: `1px solid ${tk.border}` }}>
                <button type="button" onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: '#fff', border: `1.5px solid ${tk.border}`, fontSize: 13, fontWeight: 500, color: tk.textSec, cursor: 'pointer', transition: 'all .15s', visibility: currentStep === 0 ? 'hidden' : 'visible' }}>
                  <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Précédent
                </button>
                {currentStep < steps.length - 1 ? (
                  // `key` distincts : sans eux React réutilisait le MÊME bouton en changeant son type
                  // en « submit » pendant le clic sur « Suivant » → publication dès l'étape 3.
                  <button key="next" type="button" onClick={nextStep} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 10, background: tk.accent, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}>
                    Suivant <ArrowRightIcon style={{ width: 14, height: 14 }} />
                  </button>
                ) : (
                  <button key="publish" type="submit" disabled={loading || uploading || !images.length} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 10, background: tk.emerald, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: loading || uploading || !images.length ? 'not-allowed' : 'pointer', opacity: loading || uploading || !images.length ? 0.6 : 1, transition: 'all .15s' }}>
                    {loading ? (
                      <><span style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />Publication…</>
                    ) : (
                      <><CheckCircleIcon style={{ width: 14, height: 14 }} /> Publier le produit</>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AddProduct;