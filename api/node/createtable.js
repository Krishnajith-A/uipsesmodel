const { Client } = require("pg");
// const express = require("express");
const { getCreateTableQuery } = require("./model/userModel.js");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: "5432",
});

client
  .connect()
  .then(() => {
    console.log("connected");
    let query = getCreateTableQuery();
    return client.query(query);
  })
  .then(() => {
    console.log("table created");
  })
  .catch((err) => console.log("connection error or creation error", err));
