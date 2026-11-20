import api from "./axios";
import type { Id, Payload, QueryParams } from "../types/api";

const packageService = {

  // GET /api/packages
  getAll: (params: QueryParams = {}) =>
    api.get("/packages", { params }),

  // GET /api/packages/stats
  getStats: () =>
    api.get("/packages/stats"),

  // GET /api/packages/track/:trackingNumber  (public, sans auth)
  track: (trackingNumber: string) =>
    api.get(`/packages/track/${trackingNumber}`),

  // GET /api/packages/:id
  getById: (id: Id) =>
    api.get(`/packages/${id}`),

  // POST /api/packages
  create: (data: Payload) =>
    api.post("/packages", data),

  // PUT /api/packages/:id
  update: (id: Id, data: Payload) =>
    api.put(`/packages/${id}`, data),

  // PUT /api/packages/:id/status
  updateStatus: (id: Id, status: string, location = "", description = "") =>
    api.put(`/packages/${id}/status`, { status, location, description }),

  // DELETE /api/packages/:id
  delete: (id: Id) =>
    api.delete(`/packages/${id}`),
};

export default packageService;
