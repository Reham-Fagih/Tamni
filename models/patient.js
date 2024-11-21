const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  chemicalExposure: { type: String },
  illnessDuration: { type: String, required: true },
  familyHistory: { type: String },
  date: { type: Date, default: Date.now },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
