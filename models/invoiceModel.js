const mongoose = require("mongoose");
const { Schema } = mongoose;
const invoiceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    product: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    rate: { type: [Schema.Types.Mixed], require: true },
    quantity: { type: [Schema.Types.Mixed], require: true },
    totalAmount: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
);

exports.Invoice = mongoose.model("Invoice", invoiceSchema);
