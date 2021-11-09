const express = require('express');
const router = express.Router();
const db = require ("../db/index.js")
const bodyParser = require('body-parser');


router.use(bodyParser.json({ type: 'application/*+json' }))


/*
U POSTMANU na localhost:9000/anketa, POST metoda, body raw JSON

{
    "anketa":    {
    "stvorio": "nekiUsername",
    "ime": "test anketa",
    "opis": "JAKO SUPER ANKETA KOJA JE SUPAC SUPAC SUP",
    "pitanja": [{
            "tip": "0",
            "tekstPitanja": "u koliko sati se dizes ujutro ~ tip 0 je jedan tocan odg",
            "moguceOpcije": ["8", "9", "10"]
        },

        {
            "tip": "1",
            "tekstPitanja": "Sto cesto jedes za dorucak ~ tip 1 je vise mogucih tocnih",
            "moguceOpcije": ["palacinke", "sendvic", "pahuljice"]
        },
        {
            "tip": "2",
            "tekstPitanja": "Kako bi opisao svoj dan ~ tip 2 je free response, odgovori neka bude ovdje ali prazno",
            "moguceOpcije": []
        }
    ]

    }
}

*/



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
        console.log("STVOREN ENTRY ANKETA, ID: " + idAnkete)
        for (const pitanje of pitanja) {
            console.log("~~~~~~~~~~~~~~~~~~~~~~")
            let tipPitanja = pitanje['tip']
            let tekstPitanja = pitanje['tekstPitanja']
            let moguceOpcije = pitanje['moguceOpcije']

            let idPitanja = (await stvoriPitanje(tekstPitanja, tipPitanja, idAnkete  ) )['rows'][0]['id']
            console.log("STVOREN ENTRY PITANJE, ID: " + idPitanja)

            console.log("MOGUCE OPCIJE SU: " + moguceOpcije)
            let idMoguceOpcije = (await stvoriMoguceOpcije(idPitanja, moguceOpcije))['rows'][0]['id']
            console.log("STVOREN ENTRY MOGUCE OPCIJE, ID: " + idPitanja)

        }

        res.sendStatus(200)
    });

let stvoriAnketu = function(imeAnkete){

    return db.query("INSERT INTO ankete(ime) values('" + imeAnkete + "') returning id")
}
let stvoriPitanje = function(tekstPitanja, idTipaPitanja, idAnkete){

    return db.query("INSERT INTO pitanja(tekst, id_tip_pitanja, id_ankete) values('" + tekstPitanja + "', '" + idTipaPitanja + "', '" + idAnkete + "') returning id")
}

let stvoriMoguceOpcije = function(idPitanja, moguceOpcijeTekst ){
    return db.query("INSERT INTO moguce_opcije(id_pitanja, tekst) values('" + idPitanja + "', '" + moguceOpcijeTekst + "') returning id")
}

module.exports = router;
