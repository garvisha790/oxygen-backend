const express = require("express");
const router = express.Router();
const Plant = require("../models/plant"); // MongoDB Model

// GET all plants
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find();
    if (plants.length === 0) {
      return res.status(404).json({ message: "No plants found" });
    }
    res.json(plants);
  } catch (error) {
    console.error("❌ Error fetching plants:", error.message);
    res.status(500).json({ error: "Failed to fetch plant data" });
  }
});

// POST (Add) a new plant
router.post("/", async (req, res) => {
  try {
    const newPlant = new Plant(req.body);
    await newPlant.save();
    res.status(201).json(newPlant);
  } catch (error) {
    console.error("❌ Error adding plant:", error.message);
    res.status(500).json({ error: "Failed to add plant" });
  }
});

// DELETE a plant
router.delete("/:id", async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting plant:", error.message);
    res.status(500).json({ error: "Failed to delete plant" });
  }
});

module.exports = router;

