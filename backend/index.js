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

const _ = require('lodash');


// socket server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

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
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinSheet', async ({ sheetId, userId,FileName }) => {
    console.log(`Client with userId: ${userId} joined sheet: ${sheetId}`);
    socket.join(sheetId);

    try {
      const sheet = await Sheets.findOne({ sheetid: sheetId });

      if (sheet) {
        if (sheet.owner.equals(userId) || sheet.collaborators.includes(userId)) {
          socket.emit('load-document', sheet.data);
        } else {
          socket.emit('unauthorized', 'You do not have access to this sheet.');
        }
      } else {
        const emptyData = Array(100)
          .fill()
          .map(() => Array(50).fill(''));
          console.log(FileName);

        const newSheet = new Sheets({
          sheetid: sheetId,
          owner: userId,
          data: emptyData,
          sheetName: FileName,
        });

        await newSheet.save();
        socket.emit('load-document', emptyData);
      }
    } catch (error) {
      console.error('Error loading document from MongoDB:', error);
      socket.emit('error', 'An error occurred while loading the document.');
    }
  });

  socket.on('save-document', async ({ sheetId, data, userId, FileName }) => {
    try {
      const existingDocument = await Sheets.findOne({ sheetid: sheetId });

      if (existingDocument) {
        if (existingDocument.owner.equals(userId) || existingDocument.collaborators.includes(userId)) {
          existingDocument.data = data;
          if (FileName) {
            existingDocument.sheetName = FileName;
          }
          existingDocument.updatedAt = new Date();
          await existingDocument.save();

          socket.to(sheetId).emit('document-updated', { sheetId, data, FileName: existingDocument.sheetName });
        } else {
          socket.emit('unauthorized', 'You do not have permission to edit this sheet.');
        }
      } else {
        console.log('No document found with the given sheetId');
        socket.emit('error', 'No document found with the given sheetId.');
      }
    } catch (error) {
      console.error('Error updating document in MongoDB:', error);
      socket.emit('error', 'An error occurred while saving the document.');
    }
  });


  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

io.on("disconnect", (socket) => {
  console.log("socket disconnected !! ", socket.id);
});


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});