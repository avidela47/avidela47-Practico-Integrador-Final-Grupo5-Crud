import mysql from "mysql";
import colors from "colors";
import * as dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "avidela",
  database: process.env.DB_NAME || "vinyl_record",
});

db.connect(function (err) {
  if (err) {
    console.log(`Error Connected to MySQL database`.bgRed);
  } else {
    console.log(`Connected to MySQL database`.bgBlue);
  }
});

export default db;
