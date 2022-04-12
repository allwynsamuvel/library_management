const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: Number,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    lowercase: true,
    enum: ["customer", "admin"],
  },
});

new mongoose.model("user", user_schema);
