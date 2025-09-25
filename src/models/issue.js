// src/models/issue.js
import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Issue title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    // priority: {
    //   type: String,
    //   enum: ["low", "medium", "high"],
    //   default: "low",
    // },
    // status: {
    //   type: String,
    //   enum: ["open", "in-progress", "resolved", "closed"],
    //   default: "open",
    // },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Issue || mongoose.model("Issue", IssueSchema);
