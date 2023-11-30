const exp = require("constants");
const cors = require("cors");
const OpenAI = require("openai");
const { Client } = require("pg");
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const { parse } = require("path");
const { userSelectQuery } = require("./model/query/selectUser.js");
const dbconfig = require("./model/pgDBconnction.json");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_APIKEY });

wikiApicall = async (searchterm) => {
  const wikiurlapi = "https://en.wikipedia.org/w/api.php";
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: searchterm,
    format: "json",
  });
  try {
    const response = await axios.get(`${wikiurlapi}`, { params });
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

LLMpromptcreation = (interestedCategoriesList, unsortedResults) => {
  let unsortedSearch = unsortedResults.data.query.search;
  // console.log("The unsorted results are given here", unsortedSearch);
  let prompt =
    "From the below list of numbered results of 10 and the 100 categories listed below, give the categories corresponding to each of the results.give it in the json format and only that is needed and json format should be pure json string.\n";
  for (let i = 0; i < unsortedSearch.length; i++) {
    prompt += `${i + 1}.title:${unsortedSearch[i].title} ${
      unsortedSearch[i].snippet
    }\n`;
  }
  prompt += "\nCategories:\n";
  prompt += JSON.stringify(interestedCategoriesList);
  // console.log("The prompt is", prompt);
  return prompt;
};

OpenAIcompletion = async (prompt) => {
  const gptResponse = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });
  return gptResponse.choices[0].message;
};

tempjson = {
  1: ["Business"],
  2: ["Technology"],
  3: ["Zoology"],
  4: ["Business"],
  5: ["Business"],
  6: [],
  7: ["Sports"],
  8: ["Business"],
  9: ["Zoology"],
  10: ["Sports"],
};

app.post("/api/search", async (req, res) => {
  let searchterm = req.body.searchterm;
  let userid = req.body.userid;
  userid = parseInt(userid);

  try {
    let unsortedResults = await wikiApicall(searchterm);
    const client = new Client(dbconfig);
    await client.connect();
    let user = await client.query(userSelectQuery(userid));
    // console.log(user.rows[0].categories);
    let interestedCategories = user.rows[0].categories;
    const interestedCategoriesList = Object.keys(interestedCategories);
    let prompt = LLMpromptcreation(interestedCategoriesList, unsortedResults);
    //trying not to finish the 5 dollars 🥲
    // let resultInterests = await OpenAIcompletion(prompt);
    // try {
    //   resultInterests = JSON.parse(resultInterests.content);
    // } catch (error) {
    //   console.log("not possible to parse");
    // }

    //setting the tempjson to
    resultInterests = tempjson;
    //
    let score = {};
    for (const key in resultInterests) {
      score[key] = 0;
      for (const catergory of resultInterests[key]) {
        if (interestedCategories[catergory] >= 1) {
          score[key] += interestedCategories[catergory];
        }
      }
    }
    // console.log(score);
    let unsortedResultsSearch = unsortedResults.data.query.search;
    const keys = Object.keys(unsortedResultsSearch);
    keys.forEach((key, index) => {
      console.log(index, unsortedResultsSearch[key].title);
      unsortedResultsSearch[key].score = score[index + 1];
      unsortedResultsSearch[key].categories = resultInterests[index + 1];
    });

    unsortedResultsSearch.sort((a, b) => {
      return b.score - a.score;
    });
    console.log(unsortedResultsSearch);
    res.json({ sortedResults: unsortedResultsSearch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/update", async (req, res) => {
  let userid = req.body.userid;
  let categories = req.body.categories;
  userid = parseInt(userid);
  try {
    const client = new Client(dbconfig);
    await client.connect();
    let user = await client.query(userSelectQuery(userid));
    let interestedCategories = user.rows[0].categories;
    for (const key in categories) {
      if (interestedCategories[key] === undefined) {
        interestedCategories[key] = 0;
      }
      interestedCategories[key] += categories[key];
    }
    await client.query(
      `UPDATE users SET categories = '${JSON.stringify(
        interestedCategories
      )}' WHERE id = ${userid}`
    );
    res.json({ message: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Listening on port 3000..."));
