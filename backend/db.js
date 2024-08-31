const mongoose = require("mongoose");

const dbConnect = mongoose
  .connect(
    "mongodb://localhost:27017/sheets",
  )
  .then((val, err) => {
    if (err) throw err;
    console.log("Connected to db");
  });

module.exports = {
  dbConnect,
};
