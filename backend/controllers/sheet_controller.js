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


sheetRoute.get("/owned", authMiddleWare, async (req, res) => {
  try {
    const userId = req.userid;

    const sheets = await Sheets.find({owner: userId}).select('-data');

    res.json(sheets);
  } catch (error) {
    console.error('Error fetching sheets:', error);
    res.status(500).json({ message: 'Failed to fetch sheets' });
  }
});
sheetRoute.get("/collaborated", authMiddleWare, async (req, res) => {
  try {
    const userId = req.userid;

    const sheets = await Sheets.find({collaborators: userId}).select('-data');

    res.json(sheets);
  } catch (error) {
    console.error('Error fetching sheets:', error);
    res.status(500).json({ message: 'Failed to fetch sheets' });
  }
});

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

sheetRoute.post("/:sheetId/collaborate", authMiddleWare, async (req, res) => {
  try {
    const { sheetId } = req.params;
    const userId = req.userid;

    const sheet = await Sheets.findOne({ sheetid: sheetId });

    if (!sheet) {
      return res.status(404).json({ message: "Sheet ID not available" });
    }

    if (!sheet.collaborators.includes(userId) && !sheet.owner.equals(userId)) {
      sheet.collaborators.push(userId);
      await sheet.save();
    }

    res.status(200).json({ message: "User added as collaborator" });
  } catch (error) {
    console.error("Error in collaboration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  sheetRoute,
};
