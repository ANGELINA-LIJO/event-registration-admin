const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch events" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch event" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { eventName, description, eventDate, venue } = req.body;
    if (!eventName?.trim() || !description?.trim() || !eventDate || !venue?.trim()) {
      return res.status(400).json({ message: "Please complete all event fields" });
    }
    if (Number.isNaN(Date.parse(eventDate))) {
      return res.status(400).json({ message: "Invalid event date" });
    }
    const event = await Event.create({ eventName, description, eventDate, venue });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    const { eventName, description, eventDate, venue } = req.body;
    if (!eventName?.trim() || !description?.trim() || !eventDate || !venue?.trim()) {
      return res.status(400).json({ message: "Please complete all event fields" });
    }
    if (Number.isNaN(Date.parse(eventDate))) {
      return res.status(400).json({ message: "Invalid event date" });
    }
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { eventName, description, eventDate, venue },
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete event" });
  }
});

module.exports = router;
