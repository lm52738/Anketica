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


        // console.log("tu sam")
        // let {creator, title, description, questions} = req.body;
        // console.log("~~~~~~~~~~~")
        // console.log(req.body)
        // console.log("~~~~~~~~~~~")
        // console.log(creator, title, description)
        // console.log(questions)
        //
        // let numberOfTimesAsked = 3 // pitana 3 puta dodatno uz ovaj
        // let timePeriod = 7 // 7 dana po anketi
        // let mails = ["h.h@gmail.com", "hrvoje.hemen@gmail.com", "bla.bla@gmail.com"]
        //
        // let idAnkete = (await createAnketa(title))['rows'][0]['id']
        // console.log("STVOREN ENTRY ANKETA, ID: " + idAnkete)
        // for (const questionIter of questions) {
        //     console.log("~~~~~~~~~~~~~~~~~~~~~~")
        //     let {mode, question, answers} = questionIter;
        //
        //     let questionID = (await createQuestion(question, questionTypeStringToInt(mode), idAnkete))['rows'][0]['id']
        //     console.log("STVOREN ENTRY PITANJE, ID: " + questionID)
        //
        //     console.log("MOGUCE OPCIJE SU: " + answers)
        //     let answersID = (await createAnswers(questionID, answers))['rows'][0]['id']
        //     console.log("STVOREN ENTRY MOGUCE OPCIJE, ID: " + answersID)
        // }
        //
        //
        // let today = new Date();
        // let sentPollsIds = []
        // for (let i = 0; i < numberOfTimesAsked + 1; i++) {
        //     let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        //
        //     let slanjeId = (await createSlanjeAnkete(idAnkete, date, timePeriod))['rows'][0]['id']
        //     sentPollsIds.push(slanjeId)
        //     addDays(date, 7)
        // }
        //
        // for (const sendPollsId of sentPollsIds) {
        //     for (const mail of mails) {
        //         let vlastitaId = (await createVlasitaAnketa(sendPollsId, mail))['rows'][0]['id']
        //         //console.log("Created vlastita anketa, id: " + vlastitaId)
        //     }
        //
        // }
        //
        // let anketeZahh = (await getVlastiteAnketeByMail("h.h@gmail.com"))['rows']
        //
        // console.log(anketeZahh)


        await getAnketaByID(5)


        res.sendStatus(200)
    });

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

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

//TODO promijeniti sve queryje da koriste `` umjesto "" radi lijepseg formatiranja
let createAnketa = async function (imeAnkete) {
    return db.query("INSERT INTO ankete(ime) values('" + imeAnkete + "') returning id");
}
let createQuestion = async function (tekstPitanja, idTipaPitanja, idAnkete) {
    return db.query("INSERT INTO pitanja(tekst, id_tip_pitanja, id_ankete) values('" + tekstPitanja + "', '" + idTipaPitanja + "', '" + idAnkete + "') returning id");
}

let createAnswers = async function (idPitanja, moguceOpcijeTekst) {
    return db.query("INSERT INTO moguce_opcije(id_pitanja, tekst) values('" + idPitanja + "', '" + moguceOpcijeTekst + "') returning id");
}

let createSlanjeAnkete = async function (idAnkete, datum, trajanje) {
    return db.query("INSERT INTO slanje_ankete(id_ankete, datum, trajanje) values('" + idAnkete + "', '" + datum + "', '" + trajanje + "') returning id");
}

let createVlasitaAnketa = async function (idSlanjeAnkete, mail_osobe) {
    return db.query(`INSERT INTO vlastite_ankete(mail, id_slanje_ankete, ispunjena)
                     values ('${mail_osobe}', '${idSlanjeAnkete}', false)
                     returning id`);
}

let getVlastiteAnketeByMail = async function (mail_osobe) {
    return db.query(`SELECT *
                     from vlastite_ankete
                     where mail = '${mail_osobe}'`);
}
let getAnketaByID = async function (id) {
    let anketaIzBaze = (await (db.query(`SELECT *
                               from ankete
                               where id = '${id}'`)))['rows'][0]
    console.log(anketaIzBaze)

    let ime = anketaIzBaze['ime']

    let questions = (await (db.query(`SELECT * from pitanja where id_ankete = '${id}'`)))['rows']

    let questionsArray = []
    for (const question of questions) {

        let questionId = question['id']

        let possibleAnswers = (await (db.query(`SELECT * from moguce_opcije where id_pitanja = '${questionId}'`)))['rows'][0]
        //console.log(question)
        questionsArray.push({
            "question" : question['tekst'],
            "type": question['id_tip_pitanja'],
            "possibleAnswers" : possibleAnswers['tekst']
        })
    }


    let anketa = {
        "id": id,
        "name": ime,
        "questions": questionsArray
    }
    console.log(anketa)
    return anketa
}

module.exports = router;
