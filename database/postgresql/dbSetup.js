"use strict";
const { client } = require("./dbConfig");
const FileSystem = require("fs");

const sql = FileSystem.readFileSync(__dirname + "/init.sql").toString();
 
client.connect()
.then(() => client.query(sql))
.catch(e => console.log(e))
.finally(() => client.end());