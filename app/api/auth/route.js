import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
const jwt = require("jsonwebtoken");
export async function POST(request) {
  const auth = request.cookies.get("auth");
  console.log(auth);
  try {
    const decoded = jwt.verify(auth.value, process.env.TOKEN_SECRET);
    return NextResponse.json({ status: "success" });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ status: "fail" });
  }
}
