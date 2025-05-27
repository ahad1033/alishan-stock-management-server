import express from "express";

import { AnalyticsControllers } from "./analytics.controller";

const router = express.Router();

// SALES SUMMERY
router.get("/sales-summary", AnalyticsControllers.getSalesSummary);

// RECENT EXPENSES
router.get("/recent-expenses", AnalyticsControllers.getExpenseAnalytics);

export const AnalyticsRoutes = router;
