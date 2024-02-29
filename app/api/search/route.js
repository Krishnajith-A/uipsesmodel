import { NextResponse } from "next/server";
const jwt = require("jsonwebtoken");
import { cookies } from "next/headers";
const categories = require("../../../lib/utils/defaultCategory.json");
import { getDuckDuckGoResults } from "../../../lib/utils/functions/duckduckgo";
import axios from "axios";
import { query } from "../../../lib/utils/db";

const basePythonUrl = "http://127.0.0.1:8000";
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const chromaClient = new ChromaClient();
// const embedder = new GoogleGenerativeAiEmbeddingFunction({
//   googleApiKey: process.env.GEMINI_API_KEY,
// });

const userNameFunction = async () => {
  try {
    const cookieStore = cookies();
    const auth = cookieStore.get("auth");
    console.log("auth", auth);
    const decoded = jwt.verify(auth.value, process.env.TOKEN_SECRET);
    console.log("decoded", decoded);
    let username = decoded.email;
    let sessionId = cookieStore.get("sessionId").value;
    console.log(sessionId, username);
    return { username, sessionId };
  } catch (err) {
    console.log(err);
    return null;
  }
};

export async function POST(request) {
  const { username, sessionId } = await userNameFunction();
  const { searchterm } = await request.json();
  let categoriesJson = await query(
    `SELECT * FROM sessions s JOIN users u ON s.user_id = u.id WHERE u.email = $1`,
    [username]
  );

  let categoriesList = categoriesJson[0].categories;
  if (Object.keys(categoriesList).length === 0) {
    console.log("no categories");
    categoriesList = "[]";
  } else {
    categoriesList = Object.keys(categoriesList);
    let categoriesListstring = "[";
    for (let i = 0; i < categoriesList.length; i++) {
      categoriesListstring = categoriesList[i].toLowerCase();
    }
    categoriesListstring = categoriesListstring.slice(0, -1);
    categoriesListstring += "]";
    categoriesList = categoriesListstring;
  }

  console.log(categoriesList);
  //   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  let duckduckgoResults = await getDuckDuckGoResults(searchterm);
  duckduckgoResults = duckduckgoResults.results;

  //to be replaced

  console.log("sessionId", sessionId);
  const response = await axios.post(`${basePythonUrl}/search`, {
    duckduckgoResults,
    searchterm,
    username,
    sessionId,
    categoriesList,
  });

  const notTrimmedjson = response.data.responseJson;
  let trimmedString = notTrimmedjson
    .substring(7, notTrimmedjson.length - 3)
    .replace(/\\/g, "");
  trimmedString = trimmedString.replace(/\n/g, "");
  console.log(trimmedString);
  let trimmedJson = "";
  let summary = response.data.summary;
  summary = summary.replace(/\\n/g, "").replace(/\n/g, "").replace(/\*\*/g, "");
  try {
    trimmedJson = JSON.parse(trimmedString);
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: "error",
      message: "Error in parsing the response from the server",
      trimmedString,
      trimmedJson,
    });
  }
  let categoriesListTobeUpdated = categoriesJson[0].categories;
  for (let i = 0; i < Object.keys(trimmedJson).length; i++) {
    if (trimmedJson[i] in categoriesListTobeUpdated) {
      continue;
    }
    categoriesListTobeUpdated[trimmedJson[i]] = 0;
  }
  console.log("categoriesListtobe updated", categoriesListTobeUpdated);
  console.log(duckduckgoResults.length);
  await query(
    `UPDATE sessions SET categories = $1 WHERE user_id = (SELECT id FROM users WHERE email = $2)`,
    [categoriesListTobeUpdated, username]
  );

  return NextResponse.json({
    trimmedJson,
    summary,
    response: response.data,
    duckduckgoResults,
    searchterm,
    username,
    sessionId,
  });
}
//   const wikiresponse = await wikiapiCall(searchterm);
//   const searchResults = wikiresponse.data.query.search;

//   //Got the generative ai
//   let searchResultSnippets = "";
//   for (let i = 0; i < searchResults.length; i++) {
//     searchResultSnippets += `${i + 1}.${searchResults[i].snippet}\n`;
//   }
//   let categoriesList = Object.keys(categories);
//   let categoriesString = "";
//   for (let i = 0; i < categoriesList.length; i++) {
//     categoriesString += `${i + 1}.${categoriesList[i]}\n`;
//   }
//    let prompt =
//     "From the below list of numbered results of 10 and the 100 categories listed below, give the categories corresponding to each of the results.only one category is needed for each results.give it in the json format and only that is needed and json format should be pure json string without \n.\n";
//   let prompt = `I have 10 text snippets, each containing the word '${searchterm}' My goal is to categorize each snippet using a predefined list of 100 categories. Please analyze each snippet and predict the most likely category from the list and if you think that any other category which is not in the list is the most appropriate for this use it then. Provide the results in a JSON format with snippet ID (1 to 10) as keys and the corresponding predicted category as values.Here are the snippets\n ${searchResultSnippets}\nHere are the categories\n${categoriesString}`;
//   let searchResultSnippets = "[";
//   for (let i = 0; i < searchResults.length; i++) {
//     searchResultSnippets += `"${searchResults[i].snippet}",`;
//   }
//   searchResultSnippets = searchResultSnippets.slice(0, -1);
//   searchResultSnippets += "]";
//   let categoriesList = Object.keys(categories);
//   let categoriesString = "[";
//   for (let i = 0; i < categoriesList.length; i++) {
//     categoriesString += `"${categoriesList[i]}",`;
//   }
//   categoriesString = categoriesString.slice(0, -1);
//   categoriesString += "]";
//   prompt += `1. ${searchResultSnippets}\n2. ${categoriesString}`;
//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   let responseText = response.text();
//   console.log(responseText);
//   responseText = responseText.replace(/```json\n|```|\n/g, "");
//   const responseData = JSON.parse(responseText);
