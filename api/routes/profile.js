const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Osoba = require("../models/osoba.models");
const bodyParser = require("body-parser");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, async function (req, res, next) {
  const user = req.user;

  res.json(user);
});

router.post("/", (req, res) => {});

module.exports = router;
