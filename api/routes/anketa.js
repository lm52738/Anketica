const express = require('express');
const router = express.Router();
const db = require("../db/index.js")
const bodyParser = require('body-parser');


router.use(bodyParser.json({type: 'application/*+json'}))


/*
U POSTMANU na localhost:9000/anketa, POST metoda, body raw JSON

{
    "creator": "userId", // ovo nam basically isto ne treba u requestu jer ces preko bearer tokena moc saznat koji je user poslao, tako da ja bi idealno samo token slao u headeru umjesto ovoga
    "title": "test anketa",
    "description": "JAKO SUPER ANKETA KOJA JE SUPAC SUPAC SUP",
    "questions": [{
            "mode": "radio", // (ili "text" ili "checkbox"), mozemo i s brojevima ako zelis, svejedno
            "question": "u koliko sati se dizes ujutro ~ tip 0 je jedan tocan odg",
            "answers": ["8", "9", "10"],   // za text saljem praznu listu valjda, nije ni bitno
            "isRequired": true   //novo
        }
    ],
    // sve dalje je isto novo
    "groupName": "Ime grupe",
    "emails": ["hrvoje@hotmails.com", "example@gmail.com"],
    "emailTitle": "Header poruke",
    "emailMessage": "Pocetni tekst poruke" //nakon kojeg dode i link na anketu ili nes
}

*/


router.get('/',
    async function (req, res, next) {
        res.sendStatus(200)
    });

router.post('/',
    async function (req, res, next) {
        console.log("tu sam")
        let {creator, title, description, questions} = req.body;
        console.log("~~~~~~~~~~~")
        console.log(req.body)
        console.log("~~~~~~~~~~~")
        console.log(creator, title, description, questions)

        let idAnkete = (await createAnketa(title))['rows'][0]['id']
        console.log("STVOREN ENTRY ANKETA, ID: " + idAnkete)
        for (const questionIter of questions) {
            console.log("~~~~~~~~~~~~~~~~~~~~~~")
            let {mode, question, answers} = questionIter;

            let questionID = (await createQuestion(question, questionTypeStringToInt(mode), idAnkete))['rows'][0]['id']
            console.log("STVOREN ENTRY PITANJE, ID: " + questionID)

            console.log("MOGUCE OPCIJE SU: " + answers)
            let answersID = (await createAnswers(questionID, answers))['rows'][0]['id']
            console.log("STVOREN ENTRY MOGUCE OPCIJE, ID: " + answersID)

        }
        res.sendStatus(200)
    });

let questionTypeStringToInt = function (stringVal) {
    switch (stringVal) {
        case "radio":
            return 0;
        case "text":
            return 1;
        case "checkbox" :
            return 2;
        default:
            return -1;
    }
}

let createAnketa = function (imeAnkete) {

    return db.query("INSERT INTO ankete(ime) values('" + imeAnkete + "') returning id")
}
let createQuestion = function (tekstPitanja, idTipaPitanja, idAnkete) {

    return db.query("INSERT INTO pitanja(tekst, id_tip_pitanja, id_ankete) values('" + tekstPitanja + "', '" + idTipaPitanja + "', '" + idAnkete + "') returning id")
}

let createAnswers = function (idPitanja, moguceOpcijeTekst) {
    return db.query("INSERT INTO moguce_opcije(id_pitanja, tekst) values('" + idPitanja + "', '" + moguceOpcijeTekst + "') returning id")
}

module.exports = router;
