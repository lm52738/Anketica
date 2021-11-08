const express = require("express");
const router = express.Router();
const db = require ("../db/index.js")
const jwt = require('jsonwebtoken');
const Osoba = require("../models/osoba.models.js");

router.get("/", function(req, res, next) {
    res.send("LOGIN PAGE");
});

router.post ("/", async (req,res) => {
    console.log ("u postu sam login");

    const mail = req.body.email
    const password = req.body.password
    console.log (mail);
    console.log (password);

    let osoba = await Osoba.fetchByEmail(mail);

    if (osoba.id === undefined || !osoba.checkPassword(password)) {

        console.log("OSOBA NE POSTOJI U BAZI ILI JE KRIVA LOZINKA");
        res.status(400).json("Email or password incorrect!"); 
        res.json({auth: false, message: "no user exists"});
        //treba redirectat opet na home page
        return;

    } else {
        
        console.log("OSOBA POSTOJI");
        const token = jwt.sign({id: osoba.id,mail: osoba.mail},"jwtSecret",{
            expiresIn: 300,
        })
        res.json({auth: true, token: token, osoba: osoba});  
    }
});

module.exports = router;
