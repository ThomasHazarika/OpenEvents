import { chromium } from "playwright";
import Event from "../models/event.js";

const scrapeUnstopEvents = async (req, res) => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://unstop.com/events", {
      waitUntil: "networkidle",
    });

    // Scroll to load lazy content
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 3000);
      await page.waitForTimeout(2000);
    }

    const events = await page.evaluate(() => {
      const results = [];
      const cards = document.querySelectorAll("a[href^='/events/']");

      cards.forEach((card) => {
        const text = card.innerText;
        if (!text || text.length < 20) return;

        const title =
          card.querySelector("h3")?.innerText ||
          card.querySelector("h2")?.innerText ||
          text.split("\n")[0];

        results.push({
          title: title?.trim() || "N/A",
          location: text.includes("India") ? "India" : "Remote",
          deadline: text.match(/Ends.*?\d+/)?.[0] || "N/A",
          link: card.href,
        });
      });

      return results;
    });

    await browser.close();

    // Deduplicate
    const uniqueEvents = Array.from(
      new Map(events.map((e) => [e.link, e])).values()
    );

    await Event.deleteMany({ platform: "Unstop" });
    await Event.insertMany(
      uniqueEvents.map((e) => ({ ...e, platform: "Unstop" }))
    );

    console.log(`Scraped ${uniqueEvents.length} events from Unstop`);

    res.redirect("/events");
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).render("events/error", {
      message: "Failed to scrape events",
    });
  }
};

export { scrapeUnstopEvents };
