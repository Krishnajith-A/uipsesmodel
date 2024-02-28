const DDG = require("duck-duck-scrape");
const getDuckDuckGoResults = async (searchterm) => {
  const searchResults = await DDG.search(searchterm, {
    safeSearch: DDG.SafeSearchType.STRICT,
  });
  return searchResults;
};

module.exports = { getDuckDuckGoResults };
