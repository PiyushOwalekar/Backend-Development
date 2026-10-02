import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
      unique: true,
      trim: true,
      uppercase: true
    },
    make: {
      type: String,
      required: [true, "Vehicle make is required"],
      trim: true
    },
    model: {
      type: String,
      required: [true, "Vehicle model is required"],
      trim: true
    },
    year: {
      type: Number,
      required: [true, "Vehicle year is required"],
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
