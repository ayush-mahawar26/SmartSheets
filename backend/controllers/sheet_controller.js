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
sheetRoute.get("/all", authMiddleWare, async (req, res) => {
  const userid = req.userid;

  const sheets = await Sheets.find({
    owner: userid,
  });

  if (!sheets)
    return res.json({
      code: 500,
      mssg: "Error while fetching sheets",
    });

  return res.json({
    code: 200,
    mssg: "Sheets fetched sucessfully",
    data: sheets,
  });
});

module.exports = {
  sheetRoute,
};
