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
