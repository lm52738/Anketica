var express = require('express');
const db = require("../db/index.js");
const format = require('pg-format');
var router = express.Router();

router.get('/:id', async function(req, res, next) {
  const id = req.params.id;
  console.log(id);

  var sql = await db.query(format(`select ankete.ime,pitanja.id,pitanja.tekst as tekst_pitanja, 
  pitanja.id_tip_pitanja, json_agg(odgovori_na_pitanja.tekst) as tekst_odgovora
    from pitanja
    left join ankete on (ankete.id = pitanja.id_ankete)
    left join odgovori_na_pitanja on (odgovori_na_pitanja.id_pitanja = pitanja.id)
    where ankete.id = %s
    group by ankete.ime,pitanja.id,pitanja.tekst, pitanja.id_tip_pitanja`,id));
  console.log(sql.rows);
  res.json(sql.rows);
});

router.post('/:id', function(req, res, next) {

});

module.exports = router;