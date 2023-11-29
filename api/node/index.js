const exp = require("constants");
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const app = express();
app.use(express.json());
user1 = {
  id: 1,
  name: "John Johnson",
  features: [],
};

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
