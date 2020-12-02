const { check, validationResult, query } = require("express-validator");
const { isDate } = require("moment");

module.exports = {
  checkValidation(method) {
    // console.log(method);
    switch (method) {
      case "PARTICIPANT_VALIDATION":
        console.log(method);
        return [
          check("name")
            .not()
            .isEmpty()
            .withMessage("please provide your phone"),
          check("email")
            .not()
            .isEmpty()
            .withMessage("please provide email")
            .isEmail()
            .withMessage("please provide valid email"),
        ];
      case "MEETING_VALIDATE":
        console.log(method);
        return [
          check("title")
            .not()
            .isEmpty()
            .withMessage("please provide meeting title"),
          check("startTime")
            .not()
            .isEmpty()
            .withMessage("please provide meeting start time")
            .isDate()
            .withMessage("please provide valid start date"),
          check("endTime")
            .not()
            .isEmpty()
            .withMessage("please provide meeting end time")
            .isDate()
            .withMessage("please provide valid end date"),
        ];
      default:
        return "Invalid Method";
    }
  },
};
