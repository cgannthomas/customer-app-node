const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerid: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalcode: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
