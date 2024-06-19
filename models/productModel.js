const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, require: [true, "Name is required"] },
  rate: { type: Number, require: [true, "Rate is required"] },
  unit: { type: String, require: [true, "Unit is required"] },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  shortKey: { type: String, require: [true, "ShortKey is required"] },
});

exports.Product = mongoose.model("Product", productSchema);
