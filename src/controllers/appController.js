const errorMsg = require("../helpers/errorMessage").errorMessages;
const utils = require("../helpers/utils");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { joiSchema } = require("../helpers/joi_validation");
const { ObjectId } = require("bson");

/**
 * @description userProfile controller.
 * @function userProfile
 */
exports.userProfile = async (req, res) => {
  try {
    if (req.user.role == "admin") {
      if (req.params.id != undefined) {
        const udata = await mongoose
          .model("user")
          .findOne({ _id: ObjectId(req.params.id) });
        return res.send(utils.responseMsg(false, true, udata));
      }
      const data = await mongoose.model("user").find();
      return res.send(utils.responseMsg(false, true, data));
    }

    if (req.user.role == "customer") {
      const data = await mongoose
        .model("user")
        .findOne({ _id: ObjectId(req.user.userId) });
      return res.send(utils.responseMsg(false, true, data));
    }

    return res.status(401).send(utils.responseMsg(errorMsg.unauthorized));
  } catch (err) {
    console.log("ERROR", err.stack);
    return res
      .status(400)
      .send(utils.responseMsg(true, false, err));
  }
};

/**
 * @description userUpdate controller.
 * @function userUpdate
 */
exports.userUpdate = async (req, res) => {
  try {
    const doc = await joiSchema.validateAsync(req.body);
    if(doc.error) throw doc.error;
    
    const userId = req.user.userId;
    const userData = await mongoose.model("user").findOne({ _id: ObjectId(userId) });
    if (userData) {
        const password_exist = doc.hasOwnProperty("password");
        if (req.params.id != undefined && req.user.role == "admin") {
            if (password_exist) {
                const hash = await bcrypt.hash(doc.password, 10);
                doc.password = hash;
                const a = await mongoose.model("user").updateOne({ _id: ObjectId(req.params.id) }, { $set: doc });
                console.log("err",a); 
            }
            await mongoose
            .model("user")
            .updateOne({ _id: ObjectId(req.params.id) }, { $set: doc });

            const msgData = "Updated";
            return res.send(utils.responseMsg(false, true, msgData));
        }

      
        if (password_exist) {
            const hash = await bcrypt.hash(doc.password, 10);
            doc.password = hash;
            await mongoose.model("user").updateOne({ _id: ObjectId(userId) }, { $set: doc });
        } else await mongoose.model("user").updateOne({ _id: ObjectId(userId) }, { $set: doc });

        const msg = "Updated";
        return res.send(utils.responseMsg(false, true, msg));
    }
    return res.status(401).send(utils.responseMsg(errorMsg.unauthorized));
  } catch (err) {
    console.log("ERROR", err.stack);
    return res
      .status(400)
      .send(utils.responseMsg(true, false, err));
  }
};

