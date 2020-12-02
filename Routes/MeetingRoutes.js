const { Router } = require("express");
const { checkUser } = require("../middleware/checkUser");
const { checkValidation } = require("../middleware/validate");
const { validationResult, check } = require("express-validator");
const {
  createParticipants,
  createMeeting,
  getSingleMeeting,
  getAllMeetingInTime
} = require("../Controller/mettingController");

const router = Router();

router.post(
  "/createParticipant",
  checkValidation("PARTICIPANT_VALIDATION"),
  createParticipants
);

router.post("/meetings", checkValidation("MEETING_VALIDATE"), createMeeting);

router.get("/meeting/:id", getSingleMeeting);

router.get("/meetings",getAllMeetingInTime);

module.exports = router;
