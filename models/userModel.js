const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, require: [true, "Name is required"] },
  email: { type: String },
  phoneNumber: {
    type: String,
    require: [true, "Phone number is required"],
    unique: true,
  },
  role: { type: String, require: true, default: "User" },
  password: { type: Buffer, require: true },
  salt: { type: Buffer, require: true },
  customers: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
});

exports.User = mongoose.model("User", userSchema);
