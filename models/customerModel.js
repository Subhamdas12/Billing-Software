const mongoose = require("mongoose");
const { Schema } = mongoose;
const customerSchema = new Schema({
  name: { type: String, require: [true, "Name is required"] },
  housingComplex: {
    type: String,
    require: [true, "Housing complex is required"],
  },
  phoneNumber: {
    type: String,
    require: [true, "Phone number is required"],
    unique: true,
  },
  flatNumber: { type: String, require: [true, "Flat number is required"] },
  invoices: [{ type: Schema.Types.ObjectId, ref: "Invoice" }],
});

exports.Customer = mongoose.model("Customer", customerSchema);
