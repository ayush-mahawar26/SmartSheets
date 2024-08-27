const mongoose = require("mongoose");

const cellSchema = new mongoose.Schema({
  row: { type: Number, required: true },
  col: { type: Number, required: true },
  value: { type: String, required: false }, // Value can be a string, number, or formula
});

const spreadsheetSchema = new mongoose.Schema({
  sheetid: {
    type: String,
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who owns the spreadsheet
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of user IDs with access
  data: [cellSchema], // Array of cells
  sheetName: { type: String, required: true }, // Name of the sheet
  createdAt: { type: Date, default: Date.now }, // Timestamp for creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp for last update
});

spreadsheetSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Sheets = mongoose.model("Sheet", spreadsheetSchema);
module.exports = {
  Sheets,
};
