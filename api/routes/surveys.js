const express = require("express");
const router = express.Router();
const db = require("../db/index.js");
const format = require('pg-format');

router.get("/", async function(req, res, next) {
   //res.send("SURVEYS");
   const sqlSurveys = `select slanje_ankete.id_ankete as id ,ime, ispunjena, datum + trajanje as deadline, id_osobe, id_slanje_ankete from slanje_ankete inner join ankete on (ankete.id = slanje_ankete.id_ankete) 
   inner join vlastite_ankete on (vlastite_ankete.id_slanje_ankete = ankete.id) 
   inner join pitanja on (ankete.id = pitanja.id_ankete);`;
   try {
      const resultCategories = (await db.query(sqlSurveys, [])).rows;
      res.json(resultCategories);
   } catch (err) {
      res.send(err);
   }
   //var sql = await db.query(format(`SELECT * FROM pspbe`));
   //console.log(sql.rows);
   
});
router.get("/bla", async function(req, res, next) {
   //res.send("SURVEYS");
   const sqlSurveys = `select slanje_ankete.id as id, ime, ispunjena from slanje_ankete inner join ankete on (ankete.id = slanje_ankete.id_ankete) 
   inner join vlastite_ankete on (vlastite_ankete.id_slanje_ankete = ankete.id) 
   inner join pitanja on (ankete.id = pitanja.id_ankete);`;
   try {
      const resultCategories = (await db.query(sqlSurveys, [])).rows;
      res.json(resultCategories);
   } catch (err) {
      res.send(err);
   }
   //var sql = await db.query(format(`SELECT * FROM pspbe`));
   //console.log(sql.rows);
   
});

module.exports = router;