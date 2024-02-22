import { query } from "../../../lib/utils/db";
const bcrypt = require("bcrypt");
const saltrounds = Number(process.env.SALT_ROUNDS) || 10;
import { NextResponse } from "next/server";
const jwt = require("jsonwebtoken");
export async function POST(request) {
  const { name, email, password } = await request.json();
  console.log(email, password);
  const user = await query("SELECT * FROM users WHERE email = $1 ", [email]);
  if (user.length === 0) {
    bcrypt.hash(password, saltrounds, async function (err, hash) {
      if (err) {
        console.log(err);
        return NextResponse.json("error");
      }
      console.log(hash);
      const newusercheck = await query(
        "INSERT INTO users (name,email, password) VALUES ($1, $2,$3)",
        [name, email, hash]
      );
      const newuser = await query("SELECT * FROM users WHERE email = $1 ", [
        email,
      ]);
      const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
        expiresIn: "12h",
      });
      const response = NextResponse.json("new user created");
      response.cookies.set("auth", token, {
        maxAge: 60 * 60 * 12,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return response;
    });
  } else {
    if (await bcrypt.compare(password, user[0].password)) {
      const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
        expiresIn: "12h",
      });
      const response = NextResponse.json("user exists");
      response.cookies.set("auth", token, {
        maxAge: 60 * 60 * 12,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return response;
    } else {
      return NextResponse.json("wrong password");
    }
  }
  return NextResponse.json(user);
}
