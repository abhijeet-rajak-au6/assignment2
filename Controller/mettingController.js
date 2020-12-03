const { validationResult } = require("express-validator");
const participantsModel = require("../models/Participants");
const meetingModel = require("../models/Meeting");

let getAllMeetingsInTimeRange = async (start, end, page, limit) => {
  const pageNo = page * 1;
  const limit1 = limit * 1;
  const skip = (pageNo - 1) * limit1;
  start = new Date(new Date(start).getTime() + 19800 * 1000).toISOString();
  end = new Date(new Date(end).getTime() + 19800 * 1000).toISOString();

  const meetings = await meetingModel
    .find({
      $or: [
        {
          startTime: { $gte: start, $lte: end },
          endTime: { $gte: end, $gte: start },
        },
        {
          startTime: { $lte: start, $lte: end },
          endTime: { $gte: end, $gte: start },
        },
        {
          startTime: { $lte: start, $lte: end },
          endTime: { $gte: start, $lte: end },
        },
        {
          startTime: { $gte: start, $lte: end },
          endTime: { $gte: start, $lte: end },
        },
      ],
    })
    .populate("participants")
    .skip(skip)
    .limit(limit1);
  // console.log("meeting", meetings);
  return meetings;
};

let getMeetingsWithParticipant = async (participant, page=1, limit=2) => {
  const pageNo = page * 1;
  const limit1 = limit * 1;
  const skip = (pageNo - 1) * limit1;
  const meetings = await meetingModel.aggregate([
    {
      $lookup: {
        from: "participants",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
      },
    },
    {
      $match: {
        "participants.email": participant,
      },
    },
    {
      $unwind: "$participants",
    },
    { $match: { "participants.email": participant } },
    // { $group: { _id: "$_id", } },

    {
      $skip: skip,
    },
    {
      $limit: limit1,
    },
  ]);

  // const meetings = await meetingModel
  //   .find({})
  //   .populate({
  //     path: "participants",
  //     match: { email: participant },
  //     // match:{"participants": { $not:{$size: 0 }} }
  //   })

  // console.log(meetings);
  return meetings;
  // console.log(skip, limit1);
  // let filterdMeeting = meetings.filter((meeting, idx) => {
  //   // console.log(idx);
  //   if (meeting.participants.length !== 0) return meeting;
  // });
  // return filterdMeeting;
};

module.exports = {
  async createParticipants(req, res) {
    try {
      const { name, email, rsvp } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(403).send({
          errors: errors.array(),
        });
      }
      const newParticipantInstance = new participantsModel({
        name,
        email,
        rsvp,
      });
      await newParticipantInstance.save();

      return res.status(201).send({
        status: "success",
        msg: "participant created successfully",
      });
    } catch (err) {
      // console.log(err.message);
      if (err.message.includes("email")) {
        return res.send({ msg: "please provide unique email Id" });
      }
      return res.status(500).send({
        status: "fail",
        msg: err.message
          .split(":")[2]
          .replace("enum value for path `rsvp", "value for rsvp"),
      });
    }
  },

  async createMeeting(req, res) {
    try {
      let { title, startTime, endTime } = req.body;
      const { emails } = req.query;

      if (emails === undefined) {
        return res.status(404).send({
          status: "fail",
          msg: "please provide emails as query parameter",
        });
      }

      let start = new Date(
        new Date(startTime).getTime() + 19800 * 1000
      ).toISOString();

      let end = new Date(
        new Date(endTime).getTime() + 19800 * 1000
      ).toISOString();

      const participants = await participantsModel.find(
        {
          email: emails.split(","),
        },
        { _id: 1 }
      );

      if (!participants.length) {
        return res.status(404).send({
          msg: `participant with email ${emails} not found`,
        });
      }

      const meeting = await meetingModel
        .find({
          $or: [
            {
              startTime: { $gte: start, $lte: end },
              endTime: { $gte: end, $gte: start },
            },
            {
              startTime: { $lte: start, $lte: end },
              endTime: { $gte: end, $gte: start },
            },
            {
              startTime: { $lte: start, $lte: end },
              endTime: { $gte: start, $lte: end },
            },
            {
              startTime: { $gte: start, $lte: end },
              endTime: { $gte: start, $lte: end },
            },
          ],
          participants: { $in: participants },

          // endTime: { $gte: start },
          // rsvp:'Yes'
        })
        .populate({
          path: "participants",
          match: { rsvp: "Yes" },
          select: "rsvp",
        });
      // console.log("meeting", meeting);

      // return res.send({
      //   meeting: meeting,
      // });
      if (!meeting.length || !meeting[0].participants.length) {
        const nowTime = new Date(new Date().getTime()).toISOString();

        // console.log(nowTime > start);

        if (
          new Date(startTime).getTime() < new Date(nowTime).getTime() ||
          new Date(endTime).getTime() < new Date(nowTime)
        ) {
          return res.status(403).send({
            status: "fail",
            msg: "start time or end time cannot be less than creation time ",
          });
        }
        const newMeeting = new meetingModel({
          title,
          startTime: start,
          endTime: end,
          participants: participants,
          createdAt: new Date(new Date().getTime() + 19800 * 1000),
        });

        // console.log(newMeeting);
        const meeting = await newMeeting.save();

        return res.status(201).send({
          status: "success",
          msg: "meeting created sucessfully",
          meeting,
        });
      } else if (meeting[0].participants.length) {
        return res.status(403).send({
          status: "fail",
          msg: "please fix another time as user already has a meeting",
        });
      }

      // console.log("meeting", meeting);

      // console.log(participants);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        status: "fail",
        msg: err.message,
      });
    }
  },

  async getSingleMeeting(req, res) {
    try {
      const { id } = req.params;
      const meeting = await meetingModel
        .findOne({ _id: id })
        .populate("participants");
      // console.log('meetings',meetings);
      return res.status(201).send({
        status: "success",
        meeting,
      });
    } catch (err) {
      if (err.message.includes("ObjectId")) {
        return res.status(500).send({
          msg: "Invalid meeting Id",
        });
      }
    }
  },

  async getAllMeetingInTime(req, res) {
    try {
      let { start, end, participants, page, limit } = req.query;
      // console.log(participants);
      let meetings = null;
      if (start !== undefined && end !== undefined) {
        meetings = await getAllMeetingsInTimeRange(start, end, page, limit);
        return res.status(200).send({
          status: "success",
          meetings,
        });
      } else if (participants !== undefined) {
        const allParticipants = await getMeetingsWithParticipant(
          participants,
          page,
          limit
        );
        return res.status(200).send({
          status: "success",
          meetings: allParticipants,
        });
      } else {
        return res.status(404).send({
          status: "fail",
          msg: "query parameter not found",
        });
      }
    } catch (err) {
      console.log("error", err);
    }
  },
};
