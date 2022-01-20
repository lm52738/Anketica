const express = require("express");
const router = express.Router();
const db = require("../db/index.js");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
router.use(bodyParser.json({type: "application/*+json"}));

const add = require("date-fns/add");
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

router.get("/", async function (req, res, next) {
    res.sendStatus(200);
});

router.get("/id/:id/", async function (req, res, next) {
    console.log("Gettam po id-ju" + req.params.id);
    const anketa = await getAnketaByID(req.params.id);

    res.json(anketa);
});

router.get("/vlastita/:id/", async function (req, res, next) {
    console.log("Gettam vlastitu  id-ju" + req.params.id);
    const anketa = await getVlastitaAnketaByID(req.params.id);

    res.json(anketa["rows"]);
});
router.get("/slanje/:id/", async function (req, res, next) {
    console.log("Gettam slanje  id-ju" + req.params.id);
    const anketa = await getSlanjeAnketeByID(req.params.id);

    res.json(anketa["rows"]);
});

router.get("/mail/:mail", async function (req, res, next) {
    console.log("Gettam vlastite ankete po mailu: " + req.params.mail);
    const ankete = await getAnketeByMail(req.params.mail);
    res.json(ankete["rows"]);
});

// {
//      OVO JE ID SLANJA ANKETE, JER NAM TREBA STATISTIKA PO SLANJU
//     "id": 1,
//      OVO JE LISTA PITANJA, OBJEKTI IMAJU KLJUC ID PITANJA, A VRIJEDNOST ODGOVOR
//     "questions": [
//     {"3": "Da"},
//     {"4" : "Cupavci,Paprenjaci"},
//     {"5": "Ovo je proizvoljno blabla"}
//
// ]
// }
router.post("/submit-survey", async function (req, res, next) {
    console.log(req.body);
    let {id, questions, mail} = req.body;
    for (const [key, value] of Object.entries(questions)) {
        let questionID = key
        let questionAnswer = value

        console.log(questionID);
        console.log(questionAnswer);

        let answerID = (await saveAnswer(id, mail, questionID, questionAnswer))["rows"][0]["id"];
        console.log("Spremljen odgovor, id je " + answerID);
    }
    res.sendStatus(200);
});

router.post("/", async function (req, res, next) {
    console.log(req.body);

    let {
        groupName,
        title,
        description,
        howOften,
        duration,
        recurrances,
        emailTitle,
        emailMessage,
        emails,
        questions,
    } = req.body;

    const now = new Date();

    const mails = emails.split(",").map((mail) => mail.trim());

    let creator = "creator";

    //ako nije specificirano anketa je dostupna tjedan dana
    if (duration == null) {
        duration = 1;
    }
    let timePeriod = duration * 7;
    // ako nije specificirano anketa se pita jednom tjedno
    if (howOften == null) {
        howOften = 7;
    } else {
        if (howOften === "0") {
            howOften = 1;
        } else if (howOften === "1") {
            howOften = 7;
        } else if (howOften === "2") {
            howOften = 30;
        } else {
            howOften = 365;
        }
    }
    //ako nije specificirano anketa se ne pita dodatno, samo jedan originalni put
    if (recurrances == null) {
        recurrances = 0;
    }

    console.log("~~~~~ BODY ~~~~~~");
    console.log(req.body);
    console.log("~~~~~~~~~~~~~~~~~");
    console.log(creator, title, description);
    console.log(questions);

    let idAnkete = (await createAnketa(title, description))["rows"][0]["id"];
    console.log("STVOREN ENTRY ANKETA, ID: " + idAnkete);
    for (const questionIter of questions) {
        //console.log("~~~~~~~~~~~~~~~~~~~~~~")
        let {mode, question, answers, isRequired} = questionIter;

        let questionID = (
            await createQuestion(
                question,
                questionTypeStringToInt(mode),
                idAnkete,
                isRequired
            )
        )["rows"][0]["id"];
        //console.log("STVOREN ENTRY PITANJE, ID: " + questionID)

        //console.log("MOGUCE OPCIJE SU: " + answers)
        let answersID = (await createAnswers(questionID, answers))["rows"][0]["id"];
        // console.log("STVOREN ENTRY MOGUCE OPCIJE, ID: " + answersID)
    }

    let today = new Date();
    let sentPollsIds = [];
    console.log(
        `rec : ${recurrances}, howOften: ${howOften}, timePeriod: ${timePeriod}`
    );
    recurrances = parseInt(recurrances);
    for (let i = 0; i < recurrances + 1; i++) {
        let date =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();
        // console.log(i, recurrances)
        // console.log(i < recurrances + 1)
        console.log("Stvorena anketa koja se pita ", date);

        let slanjeId = (await createSlanjeAnkete(idAnkete, date, timePeriod))[
            "rows"
            ][0]["id"];
        sentPollsIds.push(slanjeId);

        today = add(today, {days: howOften});
        console.log(today);
    }

    let vlastitaIds = [];

    for (const sendPollsId in sentPollsIds) {
        for (const mail of mails) {
            vlastitaIds.push(
                (await createVlasitaAnketa(sendPollsId, mail))["rows"][0]["id"]
            );
            //console.log("Created vlastita anketa, id: " + vlastitaId)
        }
    }

    if (recurrances > 0) {
        // primjeri https://crontab.tech/examples
        const job = schedule.scheduleJob(
            {
                start: now,
                end: endDate(howOften, recurrances),
                rule: jobRule(howOften),
            },
            () => {
                sendMails(mails, emailTitle, emailMessage, vlastitaIds);
            }
        );
    }
    res.sendStatus(200);
});

// mozda ubuduce budemo imali startdate pa cemo iz toga dobiti i vrijeme u koliko sati da se obavi
const jobRule = (howOften) => {
    const now = Date.now();

    switch (howOften) {
        // every day at current time
        case 0:
            // return `${now.getMinutes} ${now.getHours} * * *`;

            // za demonstraciju svake minute, inace koristiti ovo iznad
            return `*/1 ${now.getHours} * * *`;
        // every week at current time
        case 1:
            return `${now.getMinutes} ${now.getHours} * * ${now.getDay}`;
        // every month at current time
        case 2:
            return `${now.getMinutes} ${now.getHours} * */1 *}`;
        // every year at current time
        case 3:
            return `${now.getMinutes} ${now.getHours} * ${now.getMonth()} *`;
        // ako nema rulea jednostavno nije periodicna anketa
        default:
            break;
    }
};

const endDate = (howOften, recurrences) => {
    const now = Date.now();

    switch (howOften) {
        case 0:
            return add(now, {days: recurrences});
        case 1:
            return add(now, {days: recurrences * 7});
        case 2:
            return add(now, {months: 1});
        case 3:
            return add(now, {years: 1});
        default:
            break;
    }
};

function sendMails(emails, title, text, sendPollsIds) {
    let mailTransporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "09a4eb7b175d33",
            pass: process.env.MAIL_PASSWORD,
        },
    });

    emails.forEach((email, i) => {
        let mailDetails = {
            from: "anketica.noreply@gmail.com",
            to: email,
            subject: title,
            text: `${text}\n\nhttp://localhost:3000/survey/${sendPollsIds[i]}`,
        };

        console.log(`http://localhost:3000/survey/${sendPollsIds[i]}`);
        // Sending Email
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log("Error Occurs", err);
            } else {
                console.log(`Email sent successfully to ${email}`);
            }
        });
    });
}

let questionTypeStringToInt = function (stringVal) {
    switch (stringVal) {
        case "radio":
            return 0;
        case "text":
            return 1;
        case "checkbox":
            return 2;
        default:
            return -1;
    }
};

let saveAnswer = async function (
    idSlanja,
    mailOsobe,
    pitanjeID,
    pitanjeOdgovor
) {
    return db.query(
        `INSERT INTO odgovori_na_pitanja(mail_osobe, id_slanje_ankete, id_pitanja, tekst)
         VALUES ('${mailOsobe}', '${idSlanja}', '${pitanjeID}', '${pitanjeOdgovor}')
         returning id`
    );
};

let createAnketa = async function (imeAnkete, descriptionAnkete) {
    return db.query(
        `INSERT INTO ankete(ime, opis)
         values ('${imeAnkete}', '${descriptionAnkete}')
         returning id`
    );
};
let createQuestion = async function (
    tekstPitanja,
    idTipaPitanja,
    idAnkete,
    isRequired
) {
    return db.query(
        `INSERT INTO pitanja(tekst, id_tip_pitanja, id_ankete, required)
         values ('${tekstPitanja}', '${idTipaPitanja}', '${idAnkete}', '${isRequired}')
         returning id`
    );
};

let createAnswers = async function (idPitanja, moguceOpcijeTekst) {
    return db.query(
        `INSERT INTO moguce_opcije(id_pitanja, tekst)
         values ('${idPitanja}', '${moguceOpcijeTekst}')
         returning id`
    );
};
let getAllAnkete = async function () {
    return db.query(`SELECT *
                     from ankete`);
};
let createSlanjeAnkete = async function (idAnkete, datum, trajanje) {
    return db.query(
        `INSERT INTO slanje_ankete(id_ankete, datum, trajanje)
         values ('${idAnkete}', '${datum}', '${trajanje}')
         returning id`
    );
};

let createVlasitaAnketa = async function (idSlanjeAnkete, mail_osobe) {
    return db.query(`INSERT INTO vlastite_ankete(mail, id_slanje_ankete, ispunjena)
                     values ('${mail_osobe}', '${idSlanjeAnkete}', false)
                     returning id`);
};

let getAnketeByMail = async function (mail_osobe) {
    return db.query(`SELECT DISTINCT va.id
                     from ankete
                              join slanje_ankete sa on ankete.id = sa.id_ankete
                              join vlastite_ankete va on sa.id = va.id_slanje_ankete
                     where mail = '${mail_osobe}'
    `);
};

let getVlastitaAnketaByID = async function (id_osobe) {
    return db.query(`SELECT *
                     from vlastite_ankete
                     where id = '${id_osobe}'`);
};

let getSlanjeAnketeByID = async function (id_osobe) {
    return db.query(`SELECT *
                     from slanje_ankete
                     where id = '${id_osobe}'`);
};

let getAnketaByID = async function (id) {
    let anketaIzBaze = await (
        await db.query(`SELECT *
                        from ankete
                        where id = '${id}'`)
    )["rows"][0];

    if (anketaIzBaze === undefined) {
        return undefined;
    }
    let ime = anketaIzBaze["ime"];
    let opis = anketaIzBaze["opis"];

    let questions = (
        await db.query(`SELECT *
                        from pitanja
                        where id_ankete = '${id}'`)
    )["rows"];

    let questionsArray = [];
    for (const question of questions) {
        let questionId = question["id"];

        let possibleAnswers = (
            await db.query(
                `SELECT *
                 from moguce_opcije
                 where id_pitanja = '${questionId}'`
            )
        )["rows"][0];
        // console.log(question);
        questionsArray.push({
            questionId: questionId,
            question: question["tekst"],
            type: question["id_tip_pitanja"],
            possibleAnswers: possibleAnswers["tekst"],
            required: question["required"],
        });
    }

    let anketa = {
        id: id,
        name: ime,
        description: opis,
        questions: questionsArray,
    };
    console.log(anketa);
    return anketa;
};

module.exports = router;
