const express = require("express");
const router = express.Router();
const db = require("../db/index.js");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
router.use(bodyParser.json({type: "application/*+json"}));

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

router.get("/:id/", async function (req, res, next) {
    console.log(req.params.id);

    const anketa = await getAnketaByID(5);

    res.json(anketa);
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

    const now = Date.now();

    const mails = emails.split(",").map((mail) => mail.trim());

    if (howOften != null && recurrances > 0) {
        // primjeri https://crontab.tech/examples
        // const job = schedule.scheduleJob(
        //     {
        //         start: now,
        //         end: endDate(howOften, recurrances),
        //         rule: jobRule(howOften),
        //     },
        //     () => {
        //         //TODO link na anketu
        //         sendMails(mails, emailTitle, emailMessage, "link na anketu");
        //     }
        // );
        console.log("Saljem mail")
    }
    let creator = "creator"

    //ako nije specificirano anketa je dostupna tjedan dana
    if (duration == null) {
        duration = 1
    }
    let timePeriod = duration * 7

    // ako nije specificirano anketa se pita jednom tjedno
    if (howOften == null) {
        howOften = 7
    }
    //ako nije specificirano anketa se ne pita dodatno, samo jedan originalni put
    if (recurrances == null) {
        recurrances = 0
    }


    console.log("~~~~~ BODY ~~~~~~")
    console.log(req.body)
    console.log("~~~~~~~~~~~~~~~~~")
    console.log(creator, title, description)
    console.log(questions)


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


    let today = new Date();
    let sentPollsIds = []
    console.log(`rec : ${recurrances}, howOften: ${howOften}, timePeriod: ${timePeriod}`)
    recurrances = parseInt(recurrances)
    for (let i = 0; i < recurrances + 1; i++) {
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        console.log(i, recurrances)
        console.log(i < recurrances + 1)
        console.log("Stvorena anketa koja se pita ", date)

        let slanjeId = (await createSlanjeAnkete(idAnkete, date, timePeriod))['rows'][0]['id']
        sentPollsIds.push(slanjeId)

        today = addDays(today, howOften)
    }

    for (const sendPollsId of sentPollsIds) {
        for (const mail of mails) {
            let vlastitaId = (await createVlasitaAnketa(sendPollsId, mail))['rows'][0]['id']
            //console.log("Created vlastita anketa, id: " + vlastitaId)
        }

    }

    let anketeZahh = (await getVlastiteAnketeByMail("h.h@gmail.com"))['rows']

    console.log(anketeZahh)

    await getAnketaByID(0);

    res.sendStatus(200);
});

// mozda ubuduce budemo imali startdate pa cemo iz toga dobiti i vrijeme u koliko sati da se obavi
const jobRule = (howOften) => {
    const now = Date.now();

    switch (howOften) {
        // every day at current time
        case 0:
            // return `${now.getMinutes()} ${now.getHours()} * * *`;

            // za demonstraciju svake minute, inace koristiti ovo iznad
            return `*/1 ${now.getHours()} * * *`;
        // every week at current time
        case 1:
            return `${now.getMinutes()} ${now.getHours()} * * ${now.getDay()}`;
        // every month at current time
        case 2:
            return `${now.getMinutes()} ${now.getHours()} * */1 *}`;
        // every year at current time
        case 3:
            return `${now.getMinutes()} ${now.getHours()} * ${now.getMonth()} *`;
        // ako nema rulea jednostavno nije periodicna anketa
        default:
            break;
    }
};

const endDate = (howOften, recurrences) => {
    const now = Date.now();

    switch (howOften) {
        case 0:
            return addDays(now, recurrences);
        case 1:
            return addDays(now, recurrences * 7);
        case 2:
            return addMonth(now);
        case 3:
            return addYear(now);
        default:
            break;
    }
};

function sendMails(emails, title, text, link) {
    let mailTransporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "09a4eb7b175d33",
            pass: process.env.MAIL_PASSWORD,
        },
    });

    emails.forEach((email) => {
        let mailDetails = {
            from: "anketica.noreply@gmail.com",
            to: email,
            subject: title,
            text: `${text}\n\n${link}`,
        };

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

function addMonth(date) {
    const result = new Date(date);
    result.setMonth(date.getMonth() + months);
    return result;
}

function addYear(date) {
    const aYearFromNow = new Date(date);
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
    return aYearFromNow;
}

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
        case "checkbox":
            return 2;
        default:
            return -1;
    }
};

//TODO promijeniti sve queryje da koriste `` umjesto "" radi lijepseg formatiranja
let createAnketa = async function (imeAnkete) {
    return db.query(
        "INSERT INTO ankete(ime) values('" + imeAnkete + "') returning id"
    );
};
let createQuestion = async function (tekstPitanja, idTipaPitanja, idAnkete) {
    return db.query(
        "INSERT INTO pitanja(tekst, id_tip_pitanja, id_ankete) values('" +
        tekstPitanja +
        "', '" +
        idTipaPitanja +
        "', '" +
        idAnkete +
        "') returning id"
    );
};

let createAnswers = async function (idPitanja, moguceOpcijeTekst) {
    return db.query(
        "INSERT INTO moguce_opcije(id_pitanja, tekst) values('" +
        idPitanja +
        "', '" +
        moguceOpcijeTekst +
        "') returning id"
    );
};

let createSlanjeAnkete = async function (idAnkete, datum, trajanje) {
    return db.query(
        "INSERT INTO slanje_ankete(id_ankete, datum, trajanje) values('" +
        idAnkete +
        "', '" +
        datum +
        "', '" +
        trajanje +
        "') returning id"
    );
};

let createVlasitaAnketa = async function (idSlanjeAnkete, mail_osobe) {
    return db.query(`INSERT INTO vlastite_ankete(mail, id_slanje_ankete, ispunjena)
                     values ('${mail_osobe}', '${idSlanjeAnkete}', false)
                     returning id`);
};

let getVlastiteAnketeByMail = async function (mail_osobe) {
    return db.query(`SELECT *
                     from vlastite_ankete
                     where mail = '${mail_osobe}'`);
};
let getAnketaByID = async function (id) {
    let anketaIzBaze = await (
        await db.query(`SELECT *
                        from ankete
                        where id = '${id}'`)
    )["rows"][0];


    let ime = anketaIzBaze["ime"];

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
        });
    }

    let anketa = {
        id: id,
        name: ime,
        questions: questionsArray,
    };
    console.log(anketa);
    return anketa;
};

module.exports = router;
