import express from "express";
import { getDashboard } from "../controllers/event.js";
import { scrapeUnstopEvents } from "../controllers/scrapper.js";
import { exportEventsToExcel } from "../controllers/excelController.js";

const router = express.Router();

router.get("/events", getDashboard);

router.post("/scrape", scrapeUnstopEvents);

router.get("/export", exportEventsToExcel);

export default router;
