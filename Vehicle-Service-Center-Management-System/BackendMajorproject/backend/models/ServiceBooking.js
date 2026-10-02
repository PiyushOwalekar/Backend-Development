import mongoose from "mongoose";

const serviceBookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      enum: [
        "General Service",
        "Oil Change",
        "Brake Service",
        "Engine Repair",
        "AC Service",
        "Wheel Alignment",
        "Other"
      ]
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    status: {
      type: String,
      enum: ["Booked", "In Progress", "Completed", "Cancelled"],
      default: "Booked"
    },
    mechanicNote: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  { timestamps: true }
);

export default mongoose.model("ServiceBooking", serviceBookingSchema);
