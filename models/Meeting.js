const { Schema, model } = require("mongoose");

const mettingSchema = Schema({
  title: {
    type: String,
    required: [true, "Please provide title "],
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "participant",
      required: [true, "Please participants list"],
    },
  ],
  startTime: {
    type: Date,
    required: [true, "Please provide start time"],
  },
  endTime: {
    type: Date,
    required: [true, "Please provide end time"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const mettingModel = model("meeting", mettingSchema);

module.exports = mettingModel;
