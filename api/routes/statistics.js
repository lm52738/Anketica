var express = require('express');
const db = require("../db/index.js");
const format = require('pg-format');
var router = express.Router();

router.get('/:id', async function(req, res, next) {
  res.send("Statistika");
  const id = req.params.id;
  console.log(id);

  var sql = await db.query(format(`SELECT * FROM ankete WHERE id = %s`,id));
  console.log(sql.rows);
  res.json(sql.rows);
});

router.post('/:id', function(req, res, next) {

});

module.exports = router;