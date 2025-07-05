import express from "express";

import { AnalyticsControllers } from "./analytics.controller";

const router = express.Router();

// SALES SUMMERY
router.get("/sales-summary", AnalyticsControllers.getSalesSummary);

// MONTHLY SALES SUMMERY
router.get(
  "/monthly-sales-summary",
  AnalyticsControllers.getMonthlySalesSummary
);

// RECENT EXPENSES
router.get("/recent-expenses", AnalyticsControllers.getExpenseAnalytics);

export const AnalyticsRoutes = router;
