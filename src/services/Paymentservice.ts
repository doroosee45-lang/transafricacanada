import api from "./axios";
import type { Id, Payload, QueryParams } from "../types/api";

const paymentService = {

  // GET /api/payments
  getAll: (params: QueryParams = {}) =>
    api.get("/payments", { params }),

  // GET /api/payments/stats
  getStats: () =>
    api.get("/payments/stats"),

  // GET /api/payments/:id
  getById: (id: Id) =>
    api.get(`/payments/${id}`),

  // POST /api/payments
  create: (data: Payload) =>
    api.post("/payments", data),

  // PUT /api/payments/:id
  update: (id: Id, data: Payload) =>
    api.put(`/payments/${id}`, data),

  // DELETE /api/payments/:id
  delete: (id: Id) =>
    api.delete(`/payments/${id}`),
};

export default paymentService;
