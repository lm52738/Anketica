const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Osoba = require("../models/osoba.models");
const bodyParser = require('body-parser');

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
  
    if (typeof bearerHeader !== "undefined") {
      const token = bearerHeader.split(" ")[1];
      req.token = token;
  
      jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
  
        req.user = await Osoba.fetchByOsobaId(user.id);
        console.log('Verifyan token');
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };

router.get("/", verifyToken, async function(req, res, next) {
    const user = req.user;

    res.json(user);
});

router.post("/", (req,res) => {
    
})

module.exports = router;
