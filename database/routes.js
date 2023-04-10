"use strict";
const express = require("express"); 
const { languagePhrase } = require('./language/phrases');

const cors = require('cors');
require("dotenv").config();

const app = express(); 
app.use(cors())

app.get("/italianPhrase", languagePhrase);

app.get("*", function(req, res){
    res.status(404).redirect("/");
});  

app.set("port", (process.env.DATABASE_PORT || 4000));
app.listen(app.get("port"), function() { 
  console.log("Server running at:" + app.get("port")); 
});