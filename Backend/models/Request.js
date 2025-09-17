import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Citizen",
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  gatheringName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Cultural", "Religious", "Political", "Family", "Other"],
    required: true,
  },
  expectedPeople: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  remarks: {
    type: String,
    default: "",
  },
}, { timestamps: true });

export default mongoose.model("Request", requestSchema);
