const { Pool } = require("pg");

const pool = new Pool({
  user: "projektadmin",
  host: "161.53.18.24",
  database: "Ankete",
  password: process.env.DB_PASSWORD,
});

module.exports = {
  query: (text, params) => {
    const start = Date.now();
    return pool.query(text, params).then((res) => {
      const duration = Date.now() - start;
      //console.log('executed query', {text, params, duration, rows: res.rows});
      return res;
    });
  },
  pool: pool,
};
