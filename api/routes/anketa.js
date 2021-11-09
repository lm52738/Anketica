const express = require('express');
const router = express.Router();
const db = require ("../db/index.js")
const bodyParser = require('body-parser');


router.use(bodyParser.json({ type: 'application/*+json' }))

/* GET home page. */
router.post('/',
    async function (req, res, next) {
        let jsonData = await req.body['anketa']

        let stvorio = jsonData['stvorio']
        let imeAnkete = jsonData['ime']
        let opis = jsonData['opis']

        let pitanja = jsonData['pitanja']
        console.log(stvorio, imeAnkete, opis)

        let idAnkete = (await stvoriAnketu(imeAnkete) )['rows'][0]['id']
        console.log("STVORENA ANKETA ID: " + idAnkete)
        for (const pitanje of pitanja) {
            console.log("~~~~~~~~~~~~~~~~~~~~~~")
            let tipPitanja = pitanje['tip']
            let tekstPitanja = pitanje['tekstPitanja']
            let odgovori = pitanje['odgovori']

            let idPitanja = (await stvoriPitanje(tekstPitanja, tipPitanja, idAnkete  ) )['rows'][0]['id']
            console.log("STVORENO PITANJE ID: " + idPitanja)
        }

        res.sendStatus(200)
    });

let stvoriAnketu = function(imeAnkete){

    return db.query("INSERT INTO ankete(ime) values('" + imeAnkete + "') returning id")
}
let stvoriPitanje = function(tekstPitanja, idTipaPitanja, idAnkete){

    return db.query("INSERT INTO pitanja(tekst, id_tip_pitanja, id_ankete) values('" + tekstPitanja + "', '" + idTipaPitanja + "', '" + idAnkete + "') returning id")
}

module.exports = router;
