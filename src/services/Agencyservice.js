import api from "./axios";

/** URL de base du serveur (sans le suffixe /api) pour les fichiers statiques */
export const UPLOAD_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace(/\/api\/?$/, "");

/** URL de base de l'API (avec /api) */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/** Construit l'URL complète d'une photo stockée sur le serveur */
export const photoUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${UPLOAD_BASE_URL}${path}`;
};

/**
 * Upload multipart via fetch natif (pas axios).
 * Axios écrase parfois le Content-Type par défaut (application/json) et empêche
 * le browser de générer le boundary multipart — ce qui fait que multer ne voit
 * pas le fichier. fetch() laisse le navigateur gérer le Content-Type automatiquement.
 */
const uploadWithFile = async (method, url, data, file) => {
  const fd = new FormData();

  // Champs texte / objets
  Object.entries(data).forEach(([k, v]) => {
    if (k === "photo") return;                         // géré via le file
    if (v === undefined || v === null) return;
    if (typeof v === "object" && !(v instanceof File)) {
      fd.append(k, JSON.stringify(v));                 // sérialise les objets imbriqués
    } else {
      fd.append(k, String(v));
    }
  });

  // Fichier photo
  if (file instanceof File) {
    fd.append("photo", file, file.name);
  }

  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      // PAS de Content-Type → le navigateur génère multipart/form-data; boundary=...
    },
    body: fd,
  });

  const json = await res.json();
  if (!res.ok) { const err = new Error(json?.message || 'Request failed'); err.response = { data: json, status: res.status }; throw err; }
  return { data: json };
};

const agencyService = {

  // GET /api/agencies
  getAll:  (params = {}) => api.get("/agencies", { params }),
  getStats: ()           => api.get("/agencies/stats"),
  getById:  (id)         => api.get(`/agencies/${id}`),

  // POST /api/agencies
  create: (data, photoFile) => {
    if (photoFile instanceof File) return uploadWithFile("POST", "/agencies", data, photoFile);
    return api.post("/agencies", data);
  },

  // PUT /api/agencies/:id
  update: (id, data, photoFile) => {
    if (photoFile instanceof File) return uploadWithFile("PUT", `/agencies/${id}`, data, photoFile);
    return api.put(`/agencies/${id}`, data);
  },

  // DELETE /api/agencies/:id
  delete: (id) => api.delete(`/agencies/${id}`),
};

export default agencyService;