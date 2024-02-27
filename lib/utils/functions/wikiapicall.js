import axios from "axios";
const wikiApicall = async (searchterm) => {
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
export default wikiApicall;
