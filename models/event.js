import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  organizer: String,
  location: String,
  type: String,
  deadline: String,
  link: String,
  platform: {
    type: String,
    default: "Unstop",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
