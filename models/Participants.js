const { Schema, model } = require("mongoose");

const participantsSchema = Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide your email"],
  },
  rsvp: {
    type: String,
    enum: ["Yes", "No", "May Be", "Not Answered"],
    required: [true, "Please enter rsvp"],
  },
});

const participantsModel = model("participant", participantsSchema);

module.exports = participantsModel;
