const express = require("express");
const router = express.Router();
const db = require ("../db/index.js")

router.get("/", function(req, res, next) {
    res.send("LOGIN PAGE");
});

router.post ("/", async (req,res) => {
    console.log ("u postu sam login");

    const mail = req.body.email
    const password = req.body.password
    console.log (mail);
    console.log (password);

    const sql = `SELECT *
    FROM osobe WHERE mail = '` + mail + `' AND password = '` + password + `'`;

    const result = await (await db.query(sql, [])).rows;
    console.log("SQL:");
    console.log(result);

    if (result[0] == undefined){
        console.log("OSOBA NE POSTOJI U BAZI");
        //treba redirectat opet na home page
        return;
    }

    console.log("OSOBA POSTOJI");
})

module.exports = router;
