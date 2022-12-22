const { client } = require("./dbConfig");
const FileSystem = require("fs");

const sql = FileSystem.readFileSync(__dirname + "/init.sql").toString();
 
client.connect()
.then(() => console.log("Connected successfuly")) 
.then(() => client.query(sql))
.then(() => console.log("Table phrases Created")) 
.catch(e => console.log(e))
.finally(() => client.end());