const express = require("express");
const http = require("http");
const app = express();
const socketIo = require("socket.io");
const port = 3000;
const cors = require("cors");
const { dbConnect } = require("./db");
const { userRoute } = require("./controllers/auth_controller.js");
const dotenv = require("dotenv");
const { sheetRoute } = require("./controllers/sheet_controller.js");
const { log } = require("console");
const { Sheets } = require("./models/sheet_model.js");

// socket server
const server = http.createServer(app);
const io = socketIo(server);

dotenv.config("./");

app.use(express.json());
app.use(cors());

// test
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// authentication Routes
app.use("/user", userRoute);

// sheet routes
app.use("/sheet", sheetRoute);

// socket IO
io.on("connection", (socket) => {
  console.log("socket connected !! ", socket.id);

  // User joins a specific sheet
  socket.on("joinSheet", (sheetId) => {
    socket.join(sheetId);
    console.log(`User ${socket.id} joined sheet ${sheetId}`);
  });

  // User edits a cell
  socket.on("editCell", async ({ sheetId, cell, value }) => {
    // Emit the update to all clients connected to this sheet
    io.to(sheetId).emit("cellUpdated", { cell, value });
    try {
      await Sheets.updateOne(
        { sheetid: sheetId, "data.row": cell.row, "data.col": cell.col },
        {
          $set: {
            "data.$.value": value,
          },
        },
        { upsert: true } // create if not exist
      );

      console.log(`Cell updated in sheet ${sheetId}:`, cell);
    } catch (error) {
      console.error("Error updating cell in MongoDB:", error);
    }
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
