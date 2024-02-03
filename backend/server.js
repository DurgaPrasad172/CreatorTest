const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

let db = null;
const dbPath = path.join(__dirname, "books.db");


const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server getting started");
    });
  } catch (e) {
    console.log(`Error : ${e.message}`);
    process.exit(1);
  }
};
initializeDBandServer();



const convertBookDBObject = (object) => {
  return {
    bookId:object.book_id,
    title: object.title,
    author: object.author,
    price: object.price,
    description: object.description,
  };
};

const convertPoemDBObject = (object) => {
  return {
    poemId:object.poem_id,
    poemTitle:object.poem_title,
    poemBody:object.poem_body,
    poemAuthor:object.poem_author,
  };
};

app.get("/api/books", async (request, response) => {
  const query = `
    SELECT * from books_table;
    `;
  const playersArray = await db.all(query);
  const converted = playersArray.map((eachObj) => convertBookDBObject(eachObj));
  response.send(converted);
});

app.post("/api/poem", async (request, response) => {
  const poemDetails = request.body;
  const { poemId,poemTitle,poemBody,poemAuthor} = poemDetails;

  const sqlQuery = `
    INSERT INTO Poem_table (poem_id,poem_title,poem_body,poem_author)
    VALUES(
       '${poemId}',${poemTitle},''${poemBody},'${poemAuthor}'
    );
    `;
  const dbResponse = await db.run(sqlQuery);
  response.send("Poem Added to Database");
});
