const authService = require("../services/authServices");
const errorMsg = require("../helpers/errorMessage").errorMessages;
const utils = require("../helpers/utils");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { joiSchema } = require("../helpers/joi_validation");

/**
 * @description Local login controller.
 * @function login
 */
exports.login = async (req, res) => {
  try {
    const data = await mongoose
      .model("user")
      .findOne({ email: req.body.email });
    if (data) {
      const result = await bcrypt.compare(req.body.password, data.password);
      if (result) {
        const user = { email: data.email, role: data.role };
        const accessToken = authService.createToken(user);
        const msgObj = {
          message: `login success (${data.name} as ${data.role})`,
          token: accessToken,
        };
        return res.send(utils.responseMsg(null, true, msgObj));
      }
    }
    const msg = "Login failed";
    return res.status(401).send(utils.responseMsg(null, true, msg));
  } catch (err) {
    console.log("ERROR", err.stack);
    return res
      .status(500)
      .send(utils.responseMsg(errorMsg.internalServerError));
  }
};

/**
 * @description Local signup controller.
 * @function signup
 */
exports.signup = async (req, res) => {
  try {
    const doc = await joiSchema.validateAsync(req.body);
    if (doc.error) throw doc.error;

    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];

      const token_data = jwt.verify(token, process.env.JWT_SECRET);
      req.user = token_data;
    }

    if (req.user != undefined && req.user.role == "customer") {
      const msg = {
        error: "unauthorized",
        message: "Customer not allowed to create other user",
      };
      return res.status(401).send(utils.responseMsg(true, false, msg));
    }

    doc.role = doc.role.toLowerCase();
    if (doc.role == "admin") {
      if (req.user == undefined || req.user.role != "admin") {
        const msg = {
          error: "unauthorized",
          message: "Only Admin assign user role as 'Admin'.",
        };
        return res.status(401).send(utils.responseMsg(true, false, msg));
      }
    }

    const userExist = await mongoose.model("user").findOne({
      $or: [{ email: doc.email }, { phone: doc.phone }],
    });
    if (userExist == null) {
      doc.password = await bcrypt.hash(doc.password, 10);
      const userData = await mongoose.model("user").create(doc);

      const msg = {
        data: userData,
        message: "User Created",
      };
      return res.status(200).send(utils.responseMsg(null, true, msg));
    } else {
      const errMsg = [];
      if (doc.email == userExist.email) errMsg.push("email already existed");
      if (doc.phone == userExist.phone) errMsg.push("phone already existed");
      const msg = {
        message: "User Existed",
        errors: errMsg,
      };
      return res.status(409).send(utils.responseMsg(true, false, msg));
    }
  } catch (err) {
    if (err.isJoi)
      return res.status(422).send(utils.responseMsg(true, false, err.details));
    console.error("ERROR", err.stack);
    return res.status(422).send(utils.responseMsg(true, false, err.errors));
  }
};
