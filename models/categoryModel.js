const mongoose = require("mongoose");
const { Schema } = mongoose;
const categorySchema = new Schema({
  name: { type: String, require: [true, "Name is required"] },
  description: { type: String, require: [true, "Description is required"] },
  active: { type: Boolean, require: true, default: true },
});
exports.Category = mongoose.model("Category", categorySchema);
