const mongoose = require("mongoose");

const book_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^[a-zA-Z, ]+$/, "Enter Valid Name"],
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bookCopies: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    lowercase: true,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
  },
});

new mongoose.model("book", book_schema);
