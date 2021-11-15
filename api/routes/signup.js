const express = require("express");
const router = express.Router();
const db = require ("../db/index.js")
const Osoba = require('../models/osoba.models')
const bcrypt = require("bcrypt");

router.get("/", function(req, res, next) {
    res.send("SIGN UP PAGE");
});

router.post ("/", async (req,res) => {
    console.log ("u postu sam");
    const ime = req.body.firstName
    const prezime = req.body.lastName
    const mail = req.body.email
    const datum_rod = req.body.birthDay
    var rod = req.body.gender
    const password1 = req.body.password
    const password2 = req.body.verifyPassword


    switch(rod) {
        case 'male':
            rod = 'm'
          break;
        case 'female':
            rod = 'f';
          break;
        default:
          rod = 'o';
      }
    console.log (ime);
    console.log (prezime);
    console.log (datum_rod);
    console.log (rod);
    console.log (mail);
    console.log (password1);
    console.log (password2);

    //provjeri istovjetnost unesenenih zaporki
    if (password1 !== password2) {
      console.log("NISU ISTE LOZINKE")
      return;
    }

    let osoba = await Osoba.fetchByEmail(mail);
    if (osoba.id !== undefined){
      console.log("POSTOJI VEC MAIL")
      return;
    }

    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password1, salt);
    osoba = new Osoba(ime, prezime, mail, datum_rod, rod, hash);
    await osoba.persist();
})

module.exports = router;