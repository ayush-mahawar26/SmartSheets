const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const { dbConnect } = require("./db");
const { userRoute } = require("./controllers/auth_controller.js");
const dotenv = require("dotenv");

dotenv.config("./");

app.use(express.json());
app.use(cors());

// test
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// authentication Routes
app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
