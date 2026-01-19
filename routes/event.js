import express from "express";
import { getDashboard } from "../controllers/event.js";
import { scrapeUnstopEvents } from "../controllers/scrapper.js";

const router = express.Router();

router.get("/events", getDashboard);

router.post("/scrape", scrapeUnstopEvents);

export default router;
