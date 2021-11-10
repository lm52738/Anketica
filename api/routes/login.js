const express = require("express");
const router = express.Router();
const db = require("../db/index.js");
const jwt = require("jsonwebtoken");
const Osoba = require("../models/osoba.models.js");

router.post("/", async (req, res) => {
  console.log("u postu sam login");

  const mail = req.body.email;
  const password = req.body.password;

  let osoba = await Osoba.fetchByEmail(mail);

  

  if (osoba.id === undefined || !osoba.checkPassword(password)) {
    return res.sendStatus(403);
  } else {
    //osoba postoji
    const token = jwt.sign(
      {
        id: osoba.id,
        mail: osoba.mail,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return res.json({
      token: token,
      osoba: osoba,
    });
  }
});

module.exports = router;
