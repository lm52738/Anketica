const express = require("express");
const router = express.Router();
const db = require("../db/index.js");
var format = require('pg-format');

router.get("/", async function(req, res, next) {
   var sql = await db.query(`SELECT UPPER(ime) AS ime ,UPPER(prezime) AS prezime,mail FROM osobe`);

   console.log(sql.rows);
   res.json(sql.rows);
});

router.post("/", async function(req,res) {

    const ime = req.body.ime;
    const mails = req.body.mails;
    console.log(req.body);

    var sqlIme = await db.query(format(`SELECT * FROM grupe WHERE ime like '%s'`,ime)).rows;
    console.log(sqlIme);
    if (!sqlIme)
        await db.query(format(`INSERT INTO grupe (ime) VALUES ('%s') RETURNING id`,ime));

    for (var mail of mails) {
        var sqlMail = await db.query(format(`SELECT * FROM osoba_grupa 
        WHERE id_osoba = (SELECT id FROM osobe WHERE mail like '%s')
        AND id_grupa = (SELECT id FROM grupe WHERE ime like '%s')`,mail,ime)).rows;
        console.log(sqlMail);

        if (!sqlMail)
            await db.query(format(`INSERT INTO osoba_grupa (id_osoba, id_grupa) 
                VALUES ((SELECT id FROM osobe WHERE mail like '%s'), (SELECT id FROM grupe WHERE ime like '%s'))`,mail,ime));
    }
    
    res.redirect("/groups");
    
});


module.exports = router;