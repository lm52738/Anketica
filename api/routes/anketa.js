const express = require("express");
const router = express.Router();
const db = require("../db/index.js");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
router.use(bodyParser.json({type: "application/*+json"}));

const add = require("date-fns/add");
const {getYear, getMonth, getDay, getHours, getMinutes, getSeconds} = require("date-fns");
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

//ovo nek se prestane koristit asap
router.get("/sveVlastite/:mail", async function (req, res, next) {
    console.log("Gettam vlastite ankete po mailu: " + req.params.mail);
    const ankete = await getVlastiteAnketeByMail(req.params.mail);
    res.json(ankete["rows"]);
});
router.get("/sve/:mail", async function (req, res, next) {
    console.log("Gettam vlastite ankete po mailu: " + req.params.mail);
    const ankete = await getAnketeByMail(req.params.mail);
    res.json(ankete["rows"]);
});


router.get("/test", async function (req, res, next) {
    let a = new Date();
    a = add(a, {hours: 1})
    console.log(a);
    a = add(a, {minutes: 1})
    console.log(a)


    console.log(endDate(0, 3))

    res.send(200);
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
        let questionID = key;
        let questionAnswer = value;

        console.log(questionID);
        console.log(questionAnswer);

        let answerID = (await saveAnswer(id, mail, questionID, questionAnswer))[
            "rows"
            ][0]["id"];
        console.log("Spremljen odgovor, id je " + answerID);
    }
    await updateIspunjenaAnketa(id, mail);
    res.sendStatus(200);
});

router.post("/", async function (req, res, next) {
    let {
        groupName,
        title,
        description,
        howOften,
        duration,
        recurrances,
        emailTitle,
        emailMessage,
        questions,
    } = req.body;
    const mails = (await getMailsByGroupName(groupName)).rows;
    console.log(mails);

    //ako nije specificirano anketa je dostupna tjedan dana
    if (duration == null) {
        duration = 1;
    }
    let timePeriod = duration * 7;

    //ako nije specificirano anketa se ne pita dodatno, samo jedan originalni put
    if (recurrances == null) {
        recurrances = 0;
    }

    console.log("~~~~~ BODY ~~~~~~");
    console.log(req.body);
    console.log("~~~~~~~~~~~~~~~~~");

    let idAnkete = await stvoriAnketu(title, description, questions);

    if (recurrances > 0) {
        // primjeri https://crontab.tech/examples
        let start = new Date(Date.now());
        start = add(start,{hours:1})
        let end = endDate(howOften, recurrances);
        let rule = jobRule(howOften);
        console.log("ZAPOCINJEM POSAO")
        console.log(start)
        console.log(end)
        console.log(rule)
        const job = schedule.scheduleJob(
            {
                end: end,
                rule: rule
            },
            () => {
                sendMails(mails, emailTitle, emailMessage, idAnkete, timePeriod);
            }
        );
    } else {
        await sendMails(mails, emailTitle, emailMessage, idAnkete, timePeriod);
    }

    res.sendStatus(200);
});

const sendMails = async (emails, title, text, idAnkete, timePeriod) => {
    let mailTransporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "09a4eb7b175d33",
            pass: process.env.MAIL_PASSWORD,
        },
    });

    for (let emailObj of emails) {
        const email = emailObj["mail"];

        let today = new Date();
        today = add(today, {hours: 1})

        const date =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();

        const slanjeId = (await createSlanjeAnkete(idAnkete, date, timePeriod))[
            "rows"
            ][0]["id"];

        const vlastitaOdMaila = (await createVlasitaAnketa(slanjeId, email))[
            "rows"
            ][0]["id"];

        const mailDetails = {
            from: "anketica.noreply@gmail.com",
            to: email,
            subject: title,
            text: `${text}\n\nhttp://localhost:3000/survey/${vlastitaOdMaila}`,
        };

        console.log(`http://localhost:3000/survey/${vlastitaOdMaila}`);

        // Sending Email
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log("Error Occurs", err);
            } else {
                console.log(`Email sent successfully to ${email}`);
            }
        });
    }
};

const stvoriAnketu = async (title, description, questions) => {
    let idAnkete = (await createAnketa(title, description))["rows"][0]["id"];

    console.log("STVOREN ENTRY ANKETA, ID: " + idAnkete);

    for (const questionIter of questions) {
        let {mode, question, answers, isRequired} = questionIter;

        let questionID = (
            await createQuestion(
                question,
                questionTypeStringToInt(mode),
                idAnkete,
                isRequired
            )
        )["rows"][0]["id"];

        await createAnswers(questionID, answers);
    }
    return idAnkete;
};

// mozda ubuduce budemo imali startdate pa cemo iz toga dobiti i vrijeme u koliko sati da se obavi
const jobRule = (howOften) => {
    howOften = parseInt(howOften)
    let now = new Date();
    let rule = "";
    switch (howOften) {
        // every day at current time
        case 0:
            // return `${now.getMinutes} ${now.getHours} * * *`;

            // za demonstraciju svake minute, inace koristiti ovo iznad
            rule =  `* * * * *`;
            break
        // every week at current time
        case 1:
            rule = `${now.getMinutes()} ${now.getHours()} * * ${now.getDay()}`;
            break
        // every month at current time
        case 2:
            rule = `${now.getMinutes()} ${now.getHours()} * */1 *}`;
            break
        // every year at current time
        case 3:
            rule =  `${now.getMinutes()} ${now.getHours()} * ${now.getMonth()} *`;
            break
        // ako nema rulea jednostavno nije periodicna anketa
        default:
            console.log("U DEFAULTU SAM")
            break;
    }
    console.log("RULE ZA" ,howOften, "-", rule)
    return rule;
};

const endDate = (howOften, recurrences) => {
    howOften = parseInt(howOften)
    recurrences = parseInt(recurrences, 10)
    let now = new Date();
    now = add(now,{hours:1})
    switch (howOften) {
        case 0:
            now = add(now, {minutes: recurrences + 1});
            break;
        case 1:
            now = add(now, {days: recurrences * 7});
            break;
        case 2:
            now = add(now, {months: recurrences});
            break;
        case 3:
            now = add(now, {years: recurrences});
            break;
        default:
            console.log("Ne radim nista ");
    }
    return now;
};

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

let getMailsByGroupName = async function (groupName) {
    return db.query(`SELECT o.mail
                     from osoba_grupa
                              join grupe g on g.id = osoba_grupa.id_grupa
                              join osobe o on osoba_grupa.id_osoba = o.id
                     where g.ime = '${groupName}'`);
};

let updateIspunjenaAnketa = async function (id_slanja_ankete, mailOsobe) {
    db.query(`UPDATE vlastite_ankete
              SET ispunjena = true
              where id_slanje_ankete = ${id_slanja_ankete}
                and mail = '${mailOsobe}'`)
}

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
    return db.query(`SELECT *
                     from ankete
                              join slanje_ankete sa on ankete.id = sa.id_ankete
                              join vlastite_ankete va on sa.id = va.id_slanje_ankete
                     where mail = '${mail_osobe}'
    `);
};

let getVlastiteAnketeByMail = async function (mail_osobe) {
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
