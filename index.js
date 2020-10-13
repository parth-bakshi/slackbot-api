const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
// PORT
const port = process.env.PORT || 8000;

const app = express();

// body parser
app.use(bodyParser.json());

const db = require("./config/mongoose");

//passport jwt strategy for json webs tokens security
const passportJwtStrategy = require("./config/passport_JWT_Strategy");

// enable cross origin requests
app.use(cors());

//to extract info from url
app.use(express.urlencoded());

// routes
app.use('/',require("./routes"));

//run scheduler
require("./config/scheduler");

// start server
app.listen(port, (err) => {
    if(err){
        console.log(err);
        return;
    }
    console.log(`server is running at ${port}`);
});