const express = require("express");
const router = express.Router();


const db = require ("../db/index.js")
//router.use (express.json())

router.post ("/", async (req,res) => {
    console.log ("u postu sam");
    const id = req.body.id
    const id_uloga = req.body.id_uloga
    const ime = req.body.ime
    const prezime = req.body.prezime
    const mail = req.body.mail
    const datum_rod = req.body.datum_rod
    const rod = req.body.rod
    const password = req.body.password
    console.log (mail);
    console.log (password);

    const sql = "INSERT INTO osobe (id, id_uloga, ime, prezime, mail, datum_rod, rod, password)" +
     " VALUES ('" + id + "','" + id_uloga + "','" + ime + "','" + prezime + "','" + mail + "','" + datum_rod + "','" + rod + "','" + password + "')"

    await db.query (sql, [])
    //.then()
    //(err, res) => {console.log(err))
})

router.get("/", function(req, res, next) {
    res.send("LOGIN PAGE");
});

module.exports = router;
