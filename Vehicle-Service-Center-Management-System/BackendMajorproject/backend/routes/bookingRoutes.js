import express from "express";
import ServiceBooking from "../models/ServiceBooking.js";
import Vehicle from "../models/Vehicle.js";
import { protect, mechanicOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer creates a booking for their own vehicle.
router.post("/", protect, async (req, res) => {
  try {
    const { vehicle, serviceType, appointmentDate, description } = req.body;

    if (!vehicle || !serviceType || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Vehicle, service type and appointment date are required"
      });
    }

    const selectedVehicle = await Vehicle.findOne({
      _id: vehicle,
      owner: req.user._id
    });

    if (!selectedVehicle) {
      return res.status(403).json({
        success: false,
        message: "You can only book service for your own vehicle"
      });
    }

    const date = new Date(appointmentDate);
    if (Number.isNaN(date.getTime()) || date <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment date must be a valid future date"
      });
    }

    const booking = await ServiceBooking.create({
      customer: req.user._id,
      vehicle,
      serviceType,
      appointmentDate: date,
      description
    });

    const populated = await booking.populate([
      { path: "vehicle", select: "registrationNumber make model year" },
      { path: "customer", select: "name email" }
    ]);

    res.status(201).json({
      success: true,
      message: "Service booking created successfully",
      data: populated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Customers see their own bookings; mechanics see all bookings.
router.get("/", protect, async (req, res) => {
  try {
    const filter = req.user.role === "mechanic" ? {} : { customer: req.user._id };

    const bookings = await ServiceBooking.find(filter)
      .populate("customer", "name email")
      .populate("vehicle", "registrationNumber make model year")
      .sort({ appointmentDate: 1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
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
    const booking = await ServiceBooking.findById(req.params.id)
      .populate("customer", "name email")
      .populate("vehicle", "registrationNumber make model year");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const isOwner = booking.customer._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "mechanic") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Customer can update their own booking while it is still booked.
router.put("/:id", protect, async (req, res) => {
  try {
    const booking = await ServiceBooking.findOne({
      _id: req.params.id,
      customer: req.user._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or access denied"
      });
    }

    if (booking.status !== "Booked") {
      return res.status(400).json({
        success: false,
        message: "Only booked appointments can be edited"
      });
    }

    if (req.body.vehicle) {
      const vehicle = await Vehicle.findOne({
        _id: req.body.vehicle,
        owner: req.user._id
      });
      if (!vehicle) {
        return res.status(403).json({
          success: false,
          message: "Selected vehicle does not belong to you"
        });
      }
    }

    Object.assign(booking, req.body);
    await booking.save();

    res.json({
      success: true,
      message: "Booking updated successfully",
      data: booking
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
    const booking = await ServiceBooking.findOneAndDelete({
      _id: req.params.id,
      customer: req.user._id,
      status: "Booked"
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or cannot be cancelled"
      });
    }

    res.json({
      success: true,
      message: "Booking cancelled/deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Mechanic-only workflow endpoint.
router.patch("/:id/status", protect, mechanicOnly, async (req, res) => {
  try {
    const { status, mechanicNote } = req.body;

    const allowed = ["Booked", "In Progress", "Completed", "Cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const booking = await ServiceBooking.findByIdAndUpdate(
      req.params.id,
      { status, mechanicNote },
      { new: true, runValidators: true }
    )
      .populate("customer", "name email")
      .populate("vehicle", "registrationNumber make model year");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      message: "Job status updated successfully",
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
