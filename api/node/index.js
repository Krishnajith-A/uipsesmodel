const exp = require("constants");
const { Client } = require("pg");
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const { parse } = require("path");
const { userSelectQuery } = require("./model/query/selectUser.js");
const dbconfig = require("./model/pgDBconnction.json");

const app = express();
app.use(express.json());

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

app.post("/api/search", async (req, res) => {
  let searchterm = req.body.searchterm;
  let userid = req.body.userid;
  userid = parseInt(userid);

  try {
    let unsortedResults = await wikiApicall(searchterm);

    const client = new Client(dbconfig);
    await client.connect();
    let user = await client.query(userSelectQuery(userid));
    console.log(user.rows[0]);
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
