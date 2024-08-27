const express = require("express");
const jwt = require("jsonwebtoken");

const authMiddleWare = async (req, res, next) => {
  const authorization = req.header("authorization");

  if (!authorization)
    return res.json({
      code: 400,
      mssg: "Authorization token not found",
    });

  const token = authorization.split(" ")[1];

  const verifyJwt = jwt.verify(token, process.env.JWT_SECRET);

  if (!verifyJwt) {
    return res.json({
      code: 400,
      mssg: "Invalid token",
    });
  }

  req.userid = verifyJwt.userId;

  next();
};

module.exports = {
  authMiddleWare,
};
