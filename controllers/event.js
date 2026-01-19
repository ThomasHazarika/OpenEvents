import Event from "../models/event.js";

const getDashboard = async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });

  try {
    // Clear previous Unstop data on refresh
    await Event.deleteMany({ platform: "Unstop" });

    // Always render empty dashboard
    res.render("events/index", {
      events,
      count: events.length,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).render("events/error", {
      message: "Failed to load dashboard",
    });
  }
};

export { getDashboard };

/*
  
  import Event from "../models/event.js";
  
  const getDashboard = async (req, res) => {
    const events = await Event.find().sort({ createdAt: -1 });
  
    await Event.deleteMany({ platform: "Unstop" });
  
    events = [];
    res.render("events/index", { events, count: 0 });
  
    res.render("events/index", {
      events,
      count: events.length,
    });
  };
  
  export { getDashboard };
  */
