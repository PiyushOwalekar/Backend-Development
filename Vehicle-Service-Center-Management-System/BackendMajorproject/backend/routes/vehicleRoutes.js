import express from "express";
import Vehicle from "../models/Vehicle.js";
import ServiceBooking from "../models/ServiceBooking.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.create({
      ...req.body,
      owner: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id }).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found or access denied"
      });
    }

    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found or access denied"
      });
    }

    res.json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found or access denied"
      });
    }

    await ServiceBooking.deleteMany({ vehicle: vehicle._id });

    res.json({
      success: true,
      message: "Vehicle and related bookings deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Full service history: only the vehicle owner can access it.
router.get("/:id/history", protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!vehicle) {
      return res.status(403).json({
        success: false,
        message: "You can only view history for your own vehicle"
      });
    }

    const history = await ServiceBooking.find({
      vehicle: vehicle._id
    })
      .populate("vehicle", "registrationNumber make model year")
      .populate("customer", "name email")
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      vehicle,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
