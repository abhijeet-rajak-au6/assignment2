const { validationResult } = require("express-validator");

module.exports = {
  async checkUser(req, res, next) {
    try {
      console.log("in check user");
      const errors = validationResult(req);
      console.log("errors",errors.array());
      if (!errors.isEmpty()) {
        return res.status(403).send({
          errors: errors.array(),
        });
      }
      const { visitorId, info, meetingWith } = req.body;
      const { phone } = req.body;
      const isVistorExist = await visitorMasterModel.find({
        phone,
      });
      const visitorLogs = await visitorLogModel.find({
        phone,
        isCheckedOut:false
      })

      console.log(isVistorExist);
      console.log('logs',visitorLogs);
      if (isVistorExist.length) {
        if(visitorLogs.length){
          return res.status(403).send({
            status:'fail',
            msg:"please checkout first"
          })  
        }
        const visitorLog = await visitorLogModel.create({
          visitorId:isVistorExist[0]._id,
          info,
          meetingWith,
          phone,
          entryTime:new Date(Date.now()).toISOString()
        });
       
        return res.status(201).send({
          status: "exist",
          msg: "visitor alreay exist",
        });
      }
      console.log('hello');
      next();
    } catch (err) {
        return res.status(500).send({
            error:err.message
        })
    }
  },
};
