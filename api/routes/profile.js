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

router.post("/", async function (req, res){
  console.log("doso sm u post od profila");
  const id = req.body.id
  const ime = req.body.firstName
  const prezime = req.body.lastName
  const mail = req.body.email
  const rod = req.body.gender

  console.log(id);
  console.log (ime);
  console.log (prezime);
  console.log (rod);
  console.log (mail);

  switch(rod) {
    case 'male':
        rod = 'm';
      break;
    case 'female':
        rod = 'f';
      break;
    default:
      rod = 'o';
  }

  
  let osoba = await Osoba.fetchByOsobaId(id);
  osoba.editOsoba(ime,prezime,mail,rod);
  

  const token = jwt.sign(
    {
      id: osoba.id,
      mail: osoba.mail,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return res.json({
    token: token,
    osoba: osoba,
  });
});

module.exports = router;
