const express = require("express");
const router = express.Router();


const db = require ("../db/index.js")
//router.use (express.json())

router.post ("/", async (req,res) => {
    console.log ("u postu sam");
    const mail = req.body.mail
    const password = req.body.password
    console.log (mail);
    console.log (password);

    const sql = "INSERT INTO lik (mail, password) VALUES ('" + mail + "','" + password + "')"

    await db.query (sql, [])
    //.then()
    //(err, res) => {console.log(err))
})

router.get("/", function(req, res, next) {
    res.send("LOGIN PAGE");
});

module.exports = router;
