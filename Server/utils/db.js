import mysql from "mysql";
import colors from "colors";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "avidela",
  database: "vinyl_record",
});

db.connect(function (err) {
  if (err) {
    console.log(`Error Connected to MySQL database`.bgRed);
  } else {
    console.log(`Connected to MySQL database`.bgBlue);
  }
});

export default db;