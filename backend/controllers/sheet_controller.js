const express = require("express");
const { Sheets } = require("../models/sheet_model");
const zod = require("zod");
const { authMiddleWare } = require("../middleware/auth_middleware");
const { User } = require("../models/user_model");
const sheetRoute = express.Router();

const sheetInputZod = zod.object({
  sheetName: zod.string(),
});
// create sheet
sheetRoute.get(`/new`, authMiddleWare, async (req, res) => {
  const sheetId = req.query.id;

  if (!sheetId) {
    return res.json({
      code: 400,
      mssg: "Pass the query parameter of ID",
    });
  }

  const sheet = await Sheets.findOne({
    sheetid: sheetId,
  });

  if (sheet) {
    return res.json({
      code: 400,
      mssg: "Sheet already exist",
    });
  }

  if (!sheetInputZod.safeParse(req.body).success) {
    return res.json({
      code: 400,
      mssg: "Invalid Input",
    });
  }

  const user = await User.findById(req.userid);

  const newSheet = await Sheets.create({
    sheetName: req.body.sheetName,
    sheetid: sheetId,
    owner: user,
    collaborators: [],
    data: [],
  });

  if (newSheet) {
    await user.updateOne({
      $push: { sheets: newSheet },
    });
    return res.json({
      code: 200,
      data: newSheet,
      mssg: "Sheet created successfully",
    });
  }

  res.json({
    code: 500,
    mssg: "Error while creating sheet",
  });
});

// get All Sheets of user
// sheetRoute.get("/all", authMiddleWare, async (req, res) => {
//   const userid = req.userid;

//   const sheets = await Sheets.find({
//     owner: userid,
//   });

//   if (!sheets)
//     return res.json({
//       code: 500,
//       mssg: "Error while fetching sheets",
//     });

//   return res.json({
//     code: 200,
//     mssg: "Sheets fetched sucessfully",
//     data: sheets,
//   });
// });

sheetRoute.get("/all",async (req, res) => {
  try {
    const sheets = await Sheets.find().select('-data'); // Fetch all sheets from the database
    res.json(sheets); // Send the sheets as a JSON response
  } catch (error) {
    console.error('Error fetching sheets:', error);
    res.status(500).json({ message: 'Failed to fetch sheets' });
  }
});

// get sheet by id
sheetRoute.get('/:sheetId', async (req, res) => {
  try {
    const sheet = await Sheets.findOne({ sheetid: req.params.sheetId });
    if (!sheet) {
      return res.status(404).json({ message: 'Sheet not found' });
    }
    res.json(sheet);
  } catch (error) {
    console.error('Error fetching sheet:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {
  sheetRoute,
};
