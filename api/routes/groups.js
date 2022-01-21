const express = require("express");
const router = express.Router();
const db = require("../db/index.js");
var format = require('pg-format');

router.get("/", async function (req, res, next) {
    var sql = await db.query(`SELECT grupe.id, grupe.ime, osobe.mail
                              FROM grupe
                                       LEFT JOIN osoba_grupa ON grupe.id = osoba_grupa.id_grupa
                                       LEFT JOIN osobe ON osoba_grupa.id_osoba = osobe.id
                              ORDER BY grupe.id `);

    console.log(sql.rows);
    res.json(sql.rows);
});

router.post("/", async function (req, res) {
    var count = Object.keys(req.body).length;

    for (var i = 0; i < count; i++) {
        var id = req.body[i].id;
        var ime = req.body[i].ime;
        var mails = req.body[i].mail.split(", ");

        var sqlIme = await db.query(format(`SELECT ime
                                            FROM grupe
                                            WHERE id = '%s'`, id));
        if (ime !== sqlIme.ime) {
            await db.query(format(`UPDATE grupe
                                   SET ime = '%s'
                                   WHERE id = '%s'`, ime, id));
        }

        var sqlMail = await db.query(format(`SELECT osobe.mail
                                             FROM grupe
                                                      LEFT JOIN osoba_grupa ON grupe.id = osoba_grupa.id_grupa
                                                      LEFT JOIN osobe ON osoba_grupa.id_osoba = osobe.id
                                             WHERE grupe.id = '%s'
                                               AND grupe.ime LIKE '%s'`, id, ime));

        if (mails.length === sqlMail.rowCount) {
            console.log("sve oke");
        } else if (mails.length < sqlMail.rowCount) {
            console.log("obrisan je mail iz grupe");

            var sql = await db.query(format(`SELECT osobe.mail
                                             FROM grupe
                                                      LEFT JOIN osoba_grupa ON grupe.id = osoba_grupa.id_grupa
                                                      LEFT JOIN osobe ON osoba_grupa.id_osoba = osobe.id
                                             WHERE grupe.id = '%s'
                                               AND grupe.ime LIKE '%s'`, id, ime));

            for (row of sql.rows) {
                if (!mails.includes(row.mail)) {
                    await db.query(format(`DELETE
                                           FROM osoba_grupa
                                           WHERE id_grupa = '%s'
                                             AND id_osoba = (SELECT id FROM osobe WHERE mail LIKE '%s')`, id, row.mail));
                }
            }
        } else if (mails.length > sqlMail.rowCount) {
            console.log("dodan je mail u grupu");

            var sql = await db.query(format(`SELECT osobe.mail
                                             FROM grupe
                                                      LEFT JOIN osoba_grupa ON grupe.id = osoba_grupa.id_grupa
                                                      LEFT JOIN osobe ON osoba_grupa.id_osoba = osobe.id
                                             WHERE grupe.id = '%s'
                                               AND grupe.ime LIKE '%s'`, id, ime));

            var sqlmails = [];
            for (row of sql.rows) {
                sqlmails.push(row.mail);
            }

            for (var mail of mails) {
                if (!sqlmails.includes(mail)) {
                    await db.query(format(`INSERT INTO osoba_grupa (id_grupa, id_osoba)
                                           VALUES ('%s', (SELECT id FROM osobe WHERE mail LIKE '%s')) `, id, mail));
                }
            }
        }

    }
});

router.post("/:id", async function (req, res) {
    const id = req.params.id;
    console.log(id);

    await db.query(format(`DELETE
                           FROM osoba_grupa
                           WHERE id_grupa = '%s'`, id));
    await db.query(format(`DELETE
                           FROM grupe
                           WHERE id = '%s'`, id));
});

module.exports = router;