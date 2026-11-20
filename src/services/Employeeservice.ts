import api from "./axios";
import type { Id, Payload, QueryParams } from "../types/api";

const employeeService = {

  // GET /api/employees
  getAll: (params: QueryParams = {}) =>
    api.get("/employees", { params }),

  // GET /api/employees/stats
  getStats: () =>
    api.get("/employees/stats"),

  // GET /api/employees/:id
  getById: (id: Id) =>
    api.get(`/employees/${id}`),

  // POST /api/employees
  create: (data: Payload) =>
    api.post("/employees", data),

  // PUT /api/employees/:id
  update: (id: Id, data: Payload) =>
    api.put(`/employees/${id}`, data),

  // DELETE /api/employees/:id
  delete: (id: Id) =>
    api.delete(`/employees/${id}`),
};

export default employeeService;
