import Event from "../models/event.js";

const getDashboard = async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });

  res.render("events/index", {
    events,
    count: events.length,
  });
};

export { getDashboard };
