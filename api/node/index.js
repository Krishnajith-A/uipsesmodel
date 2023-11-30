const exp = require("constants");
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
    "From the below list of numbered results of 10 and the 100 categories listed below, give the categories corresponding to each of the results.\n";
  for (let i = 0; i < unsortedSearch.length; i++) {
    prompt += `${i + 1}. ${unsortedSearch[i].snippet}\n`;
  }
  prompt += "\nCategories:\n";
  prompt += JSON.stringify(interestedCategoriesList);
  console.log("The prompt is", prompt);
  return prompt;
};

OpenAIcompletion = async (prompt) => {
  const gptResponse = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });
  return gptResponse.choices[0].message;
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
    let resultInterests = await OpenAIcompletion(prompt);
    res.json({ unsortedResults: unsortedResults.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/scrape", async (req, res) => {
  try {
    let websites = req.body.websites;
    console.log(websites);
    if (!Array.isArray(websites)) {
      console.log("not array");
    }
    const metadataPromises = websites.map(async (url) => {
      try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const title = $("head title").text();
        const description = $('meta[name="description"]').attr("content");
        const ogTitle = $('meta[property="og:title"]').attr("content");
        const ogDescription = $('meta[property="og:description"]').attr(
          "content"
        );

        return {
          url,
          title,
          description,
          ogTitle,
          ogDescription,
        };
      } catch (error) {
        return { url, error: "Unable to fetch metadata" };
      }
    });

    const metadata = await Promise.all(metadataPromises);
    res.json({ metadata });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => console.log("Listening on port 3000..."));
