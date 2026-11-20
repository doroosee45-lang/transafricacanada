import api from "./axios";
import type { QueryParams } from "../types/api";

const analyticsService = {

  // GET /api/analytics/dashboard
  getDashboard: () =>
    api.get("/analytics/dashboard"),

  // GET /api/analytics/reports?type=packages&startDate=...&endDate=...
  getReport: (params: QueryParams = {}) =>
    api.get("/analytics/reports", { params }),
};

export default analyticsService;
