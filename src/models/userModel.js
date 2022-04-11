const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    match: [/^[a-zA-Z, ]+$/, "Enter Valid Name"],
    trim: true,
  },
  phone: {
    type: Number,
    unique: true,
    required: true,
    validate: [
        (e) => {
          const phone_pattern = /^\d{10}$/;
          return phone_pattern.test(e);
        },
        "Enter Valid Phone",
    ],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    validate: [
      (e) => {
        const email_pattern = /.+\@.+\..+/;
        return email_pattern.test(e);
      },
      "Enter Valid Email Address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    lowercase: true,
    enum: ["customer", "admin"],
    default: "customer",
  },
});

new mongoose.model("user", user_schema);
