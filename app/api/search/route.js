import { NextResponse } from "next/server";
const jwt = require("jsonwebtoken");
import { cookies } from "next/headers";
import wikiapiCall from "../../../lib/utils/functions/wikiapicall";
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

  return NextResponse.json({ data: decoded });
}
