"use strict";
const FileSystem = require("fs");
const express = require("express"); 
const { client } = require("./postgresql/dbConfig");

const cors = require('cors');
require("dotenv").config();

const app = express(); 
app.use(cors())

// Cache for Phrases and counters
let LanguageData = {};

async function fetchPhrase(language) {
    // Connect to the database
    client.connect();
    // Query the database for all Italian phrases
    const data = await client.query(`SELECT * FROM ${language}_Phrases`);
    // Cache the results in the LanguageData variable
    LanguageData[language] = {
        phrases: data.rows,
        counter: 0
    };
    // Disconnect from the database
    await client.end();
}

app.get("/italianPhrase", languagePhrase);

// Fetch a phrase from the database (Currently only supports Italian)
async function languagePhrase(req, res) {  
    try {
        // Get the language from the query string
        const language = req.query.language || "Italian";

        // Check if the phrases for the specified language are cached
        if (LanguageData[language] === undefined) {
            await fetchPhrase(language);
        }
         
        // Get a phrase from the cached phrases for the specified language
        const phrase = LanguageData[language].phrases[LanguageData[language].counter];

        // Increment the counter and reset it if it exceeds the length of the phrases for the specified language
        LanguageData[language].counter = (LanguageData[language].counter + 1) % LanguageData[language].phrases.length;

        // Return the selected phrase and its translation
        res.json({
            phrase: phrase[language.toLowerCase() + "_phrase"],
            translatedPhrase: phrase["english_translation"]
        });   
    } catch (error) {
        console.error(`Error fetching ${language} phrase:`, error);    

        // Return an error response with a status code
        res.status(500).json({
            error: `An error occurred while fetching a ${language} phrase. Please try again later.`
        });
    }
}

app.get("*", function(req, res){
    res.status(404).redirect("/");
});  

app.set("port", (process.env.DATABASE_PORT || 4000));
app.listen(app.get("port"), function() { 
  console.log("Server running at:" + app.get("port")); 
});