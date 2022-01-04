require('dotenv').config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

//const mysql = require("mysql");



const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const testAPIRouter = require("./routes/testAPI");
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const anketaRouter = require('./routes/anketa');
const profileRouter = require('./routes/profile');
const surveysRouter = require('./routes/surveys');
const groupsRouter = require('./routes/groups');
const addGroupRouter = require('./routes/addGroup');

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));



app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/users", usersRouter);
app.use("/testAPI", testAPIRouter);
app.use("/anketa", anketaRouter);
app.use("/profile",profileRouter);
app.use("/surveys",surveysRouter);
app.use("/groups",groupsRouter);
app.use("/addGroup",addGroupRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    // res.status(err.status || 500);
    res.sendStatus(err.status ?? 500);
});


module.exports = app;
