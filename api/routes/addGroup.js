const express = require("express");
const router = express.Router();
const db = require("../db/index.js");
var format = require('pg-format');

router.get("/", async function(req, res, next) {
   var sql = await db.query(`SELECT mail FROM osobe`);

   console.log(sql.rows);
   res.json(sql.rows);
});

router.post("/", async function(req,res) {

    const ime = req.body.ime;
    const mails = req.body.mails.split(",");

    await db.query(format(`INSERT INTO grupe (ime) VALUES ('%s') RETURNING id`,ime));

    for (var mail of mails) {
        await db.query(format(`INSERT INTO osoba_grupa (id_grupa, id_osoba) 
            VALUES (
                SELECT id FROM osobe WHERE mail like '%s', 
                SELECT id FROM grupa WHERE ime like '%s
                )`,mail,ime));
    }
    

});


module.exports = router;