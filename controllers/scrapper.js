import { chromium } from "playwright";
import Event from "../models/event.js";

const scrapeUnstopEvents = async (req, res) => {
  try {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    await page.goto("https://unstop.com/events", {
      waitUntil: "networkidle",
    });

    await page.waitForTimeout(3000);

    // Scroll to trigger lazy loading
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 4000);
      await page.waitForTimeout(1500);
    }

    // Extract events
    const rawEvents = await page.evaluate(() => {
      const cards = document.querySelectorAll("a[href^='/events/']");
      const results = [];

      cards.forEach((card) => {
        const text = card.innerText;
        if (!text || text.length < 20) return;

        const title =
          card.querySelector("h3")?.innerText ||
          card.querySelector("h2")?.innerText ||
          text.split("\n")[0];

        results.push({
          title: title?.trim(),
          location: text.includes("India") ? "India" : "Remote",
          deadline: text.match(/Ends.*?\d+/)?.[0] || "N/A",
          link: card.href,
        });
      });

      return results;
    });

    await browser.close();

    const cleaned = rawEvents
      .filter((e) => e?.title && e?.link)
      .map((e) => ({
        title: e.title,
        location: e.location || "N/A",
        deadline: e.deadline || "N/A",
        link: e.link,
      }));

    // Deduplicate by link
    const uniqueEvents = Array.from(
      new Map(cleaned.map((e) => [e.link, e])).values(),
    );

    // Replace previous Unstop data
    await Event.deleteMany({ platform: "Unstop" });

    if (uniqueEvents.length) {
      await Event.insertMany(
        uniqueEvents.map((e) => ({
          ...e,
          platform: "Unstop",
        })),
      );
    }

    console.log(`Scraped ${uniqueEvents.length} events from Unstop`);

    res.redirect("/");
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).render("events/error", {
      message: "Failed to scrape events",
    });
  }
};

export { scrapeUnstopEvents };
