const errorMsg = require("../helpers/errorMessage").errorMessages;
const utils = require("../helpers/utils");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { joiSchema } = require("../helpers/joi_validation");

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
          .findOne({ _id: req.params.id });
        return res.send(utils.responseMsg(false, true, udata));
      }
      const data = await mongoose.model("user").find();
      return res.send(utils.responseMsg(false, true, data));
    }

    if (req.user.role == "customer") {
      const data = await mongoose
        .model("user")
        .findOne({ _id: req.user.userId });
      return res.send(utils.responseMsg(false, true, data));
    }

    return res.status(401).send(utils.responseMsg(errorMsg.unauthorized));
  } catch (err) {
    console.log("ERROR", err.stack);
    return res.status(500).send(utils.responseMsg(true, false, err));
  }
};

/**
 * @description userUpdate controller.
 * @function userUpdate
 */
exports.userUpdate = async (req, res) => {
  try {
    if(req.body.phone != undefined) req.body.phone = req.body.phone.toString();
    const doc = await joiSchema.validateAsync(req.body);
    if (doc.error) throw doc.error;
    if(doc.phone != undefined) doc.phone = parseInt(doc.phone);

    const userId = req.user.userId;
    const userData = await mongoose.model("user").findOne({ _id: userId });
    if (userData) {
      const password_exist = doc.hasOwnProperty("password");
      if (req.params.id != undefined && req.user.role == "admin") {
        if (password_exist) {
          const hash = await bcrypt.hash(doc.password, 10);
          doc.password = hash;
          await mongoose
            .model("user")
            .updateOne({ _id: req.params.id }, { $set: doc });
        }
        await mongoose
          .model("user")
          .updateOne({ _id: req.params.id }, { $set: doc });

        const msgData = "Updated";
        return res.send(utils.responseMsg(false, true, msgData));
      }

      if (password_exist) {
        const hash = await bcrypt.hash(doc.password, 10);
        doc.password = hash;
        await mongoose.model("user").updateOne({ _id: userId }, { $set: doc });
      } else
        await mongoose.model("user").updateOne({ _id: userId }, { $set: doc });

      const msg = "Updated";
      return res.send(utils.responseMsg(false, true, msg));
    }
    return res.status(401).send(utils.responseMsg(errorMsg.unauthorized));
  } catch (err) {
    if (err.isJoi)
      return res.status(422).send(utils.responseMsg(true, false, err.details));
    console.log("ERROR", err.stack);
    return res.status(400).send(utils.responseMsg(true, false, err));
  }
};

/**
 * @description user delete controller.
 * @function userDelete
 */
exports.userDelete = async (req, res) => {
  try {
    const userData = await mongoose
      .model("user")
      .findOne({ _id: req.user.userId });
    if (userData) {
      if (userData.role == "customer") {
        await mongoose.model("user").deleteOne({ _id: req.user.userId });
        const msg = "User Deleted";
        return res.send(utils.responseMsg(false, true, msg));
      }
    }
    return res.status(401).send(utils.responseMsg(errorMsg.unauthorized));
  } catch (err) {
    console.log("ERROR", err.stack);
    return res
      .status(500)
      .send(utils.responseMsg(true, false, err));
  }
};

/**
 * @description add book controller.
 * @function addBook
 */
exports.addBook = async (req, res) => {
  try {
    const doc = req.body;
    const bookData = await mongoose.model("book").findOne({ name: doc.name });
    if (bookData == null) {
      if (doc.bookCopies == 0) doc.availability = false;
      const data = await mongoose.model("book").create(doc);

      const msg = {
        message: "Book added",
        data: data,
      };
      return res.send(utils.responseMsg(false, true, msg));
    } else {
      const obj = { message: "Book already Existed" };
      return res.send(utils.responseMsg(true, false, obj));
    }
  } catch (err) {
    console.log("ERROR", err.stack);
    return res.status(500).send(utils.responseMsg(true, false, err));
  }
};

/**
 * @description update book controller.
 * @function updateBook
 */
exports.updateBook = async (req, res) => {
  try {
    const doc = req.body;
    const data = await mongoose.model("book").findOne({ _id: req.params.id });
    if (data != null) {
      if (doc.bookCopies == 0) doc.availability = false;
      await mongoose
        .model("book")
        .updateOne({ _id: req.params.id }, { $set: doc });

      const msg = { message: "Book updated" };
      return res.send(utils.responseMsg(false, true, msg));
    }
    return res.status(404).send(utils.responseMsg(errorMsg.dataNotFound));
  } catch (err) {
    console.log("ERROR", err.stack);
    return res.status(500).send(utils.responseMsg(true, false, err));
  }
};

/**
 * @description delete book controller.
 * @function deleteBook
 */
exports.deleteBook = async (req, res) => {
  try {
    const data = await mongoose.model("book").findOne({ _id: req.params.id });
    if (data != null) {
      await mongoose.model("book").deleteOne({ _id: req.params.id });

      const msg = { message: "Book deleted" };
      return res.send(utils.responseMsg(false, true, msg));
    }
    return res.status(404).send(utils.responseMsg(errorMsg.dataNotFound));
  } catch (err) {
    console.log("ERROR", err.stack);
    return res.status(500).send(utils.responseMsg(true, false, err));
  }
};

/**
 * @description book search controller.
 * @function bookSearch
 */
exports.bookSearch = async (req, res) => {
  try {
    if (req.params.option == "name") {
      const data = await mongoose
        .model("book")
        .find({ name: req.params.searchQuery });
      if (data.length != 0)
        return res.send(utils.responseMsg(false, true, data));
      else
        return res.status(404).send(utils.responseMsg(errorMsg.dataNotFound));
    }

    if (req.params.option == "author") {
      const data = await mongoose
        .model("book")
        .find({ author: req.params.searchQuery });
      if (data.length != 0)
        return res.send(utils.responseMsg(false, true, data));
      else
        return res.status(404).send(utils.responseMsg(errorMsg.dataNotFound));
    }

    if (req.params.option == "category") {
      const data = await mongoose
        .model("book")
        .find({ category: req.params.searchQuery });
      if (data.length != 0)
        return res.send(utils.responseMsg(false, true, data));
      else
        return res.status(404).send(utils.responseMsg(errorMsg.dataNotFound));
    }

    return res.status(401).send(utils.responseMsg(errorMsg.unauthorized));
  } catch (err) {
    console.log("ERROR", err.stack);
    return res.status(500).send(utils.responseMsg(true, false, err));
  }
};
