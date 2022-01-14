const express = require("express");
const router = express.Router();
const db = require("../db/index.js");
const format = require('pg-format');
const verifyToken = require ('../middleware/verifyToken')

router.get("/", verifyToken, async function(req, res, next) {
   //res.send("SURVEYS");
   const sqlSurveys = `select distinct slanje_ankete.id_ankete as id ,ime, ispunjena, to_char((datum + trajanje), 'DD/MM/YYYY HH:MI') as deadline,
   count (pitanja.id) as pitanja, COUNT(slanje_ankete.id) as br_anketa 
   from slanje_ankete 
   inner join ankete on (ankete.id = slanje_ankete.id_ankete) 
      inner join vlastite_ankete on (vlastite_ankete.id_slanje_ankete = ankete.id) 
      inner join pitanja on (ankete.id = pitanja.id_ankete)
      where vlastite_ankete.id_osobe = ` + req.user.id + `
      group by slanje_ankete.id_ankete,ankete.ime, vlastite_ankete.ispunjena, deadline,vlastite_ankete.id_slanje_ankete;
   `;
   const resultCategories = (await db.query(sqlSurveys)).rows;
   console.log(resultCategories);
   console.log (req.user);
   //console.log (re);
   res.json(resultCategories);
});
router.get("/bla", async function(req, res, next) {
   //res.send("SURVEYS");
   const sqlSurveys = `select slanje_ankete.id as id, ime, ispunjena from slanje_ankete inner join ankete on (ankete.id = slanje_ankete.id_ankete) 
   inner join vlastite_ankete on (vlastite_ankete.id_slanje_ankete = ankete.id) 
   inner join pitanja on (ankete.id = pitanja.id_ankete);`;
   const resultCategories = (await db.query(sqlSurveys)).rows;
   console.log(resultCategories);
   res.json(resultCategories);
   //var sql = await db.query(format(`SELECT * FROM pspbe`));
   //console.log(sql.rows);
   
});

module.exports = router;