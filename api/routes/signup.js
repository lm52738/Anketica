const express = require("express");
const router = express.Router();
const db = require ("../db/index.js")

router.get("/", function(req, res, next) {
    res.send("SIGN UP PAGE");
});

router.post ("/", async (req,res) => {
    console.log ("u postu sam");
    const ime = req.body.firstName
    const prezime = req.body.lastName
    const mail = req.body.email
    const datum_rod = req.body.birthDay
    const rod = req.body.gender
    const password = req.body.password
    console.log (ime);
    console.log (prezime);
    console.log (datum_rod);
    console.log (rod);
    console.log (mail);
    console.log (password);

    const sql = "INSERT INTO lik (ime, prezime, mail, datum_rod, rod, password)" +
     " VALUES ('" + ime + "','" + prezime + "','" + mail + "','" + datum_rod + "','" + rod + "','" + password + "')";

    await db.query (sql, [])
    //.then()
    //(err, res) => {console.log(err))
})

module.exports = router;