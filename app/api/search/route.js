import { NextResponse } from "next/server";
const jwt = require("jsonwebtoken");
import { cookies } from "next/headers";
import wikiapiCall from "../../../lib/utils/functions/wikiapicall";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const categories = require("../../../lib/utils/defaultCategory.json");
import { getDuckDuckGoResults } from "../../../lib/utils/functions/duckduckgo";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  // GETTING THE USER  TO BE REFACTORED
  const cookieStore = cookies();
  const auth = cookieStore.get("auth");
  const decoded = jwt.verify(auth.value, process.env.TOKEN_SECRET);
  let username = decoded.value;
  // END OF REFACTOR
  // GET THE SESSION NAME
  const sessionId = cookieStore.get("sessionId").value;
  // GOT THE SESSION NAME
  const { searchterm } = await request.json();
  const wikiresponse = await wikiapiCall(searchterm);
  const searchResults = wikiresponse.data.query.search;

  //Got the generative ai
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  let searchResultSnippets = "";
  for (let i = 0; i < searchResults.length; i++) {
    searchResultSnippets += `${i + 1}.${searchResults[i].snippet}\n`;
  }
  let categoriesList = Object.keys(categories);
  let categoriesString = "";
  for (let i = 0; i < categoriesList.length; i++) {
    categoriesString += `${i + 1}.${categoriesList[i]}\n`;
  }

  //    let prompt =
  //     "From the below list of numbered results of 10 and the 100 categories listed below, give the categories corresponding to each of the results.only one category is needed for each results.give it in the json format and only that is needed and json format should be pure json string without \n.\n";
  let prompt = `I have 10 text snippets, each containing the word '${searchterm}' My goal is to categorize each snippet using a predefined list of 100 categories. Please analyze each snippet and predict the most likely category from the list and if you think that any other category which is not in the list is the most appropriate for this use it then. Provide the results in a JSON format with snippet ID (1 to 10) as keys and the corresponding predicted category as values.Here are the snippets\n ${searchResultSnippets}\nHere are the categories\n${categoriesString}`;
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
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let responseText = response.text();
  console.log(responseText);
  //   responseText = responseText.replace(/```json\n|```|\n/g, "");
  //   const responseData = JSON.parse(responseText);
  const duckduckgoResults = await getDuckDuckGoResults(searchterm);
  //   console.log(responseData);
  return NextResponse.json({
    prompt: prompt,
    data: searchResults,
    searchResults,
    categories: Object.keys(categories),

    duckduckgoResults,
  });
}
