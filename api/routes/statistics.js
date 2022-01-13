var express = require('express');
const db = require("../db/index.js");
const format = require('pg-format');
var router = express.Router();

router.get('/:id', async function(req, res, next) {
  const id = req.params.id;
  console.log(id);

  var sql = await db.query(format(`select ankete.ime,pitanja.id,pitanja.tekst, pitanja.id_tip_pitanja, odgovori_na_pitanja.tekst
  from pitanja
  left join ankete on (ankete.id = pitanja.id_ankete)
  left join odgovori_na_pitanja on (odgovori_na_pitanja.id_pitanja = pitanja.id)
  where ankete.id = %s`,id));
  console.log(sql.rows);
  res.json(sql.rows);
});

router.post('/:id', function(req, res, next) {

});

module.exports = router;