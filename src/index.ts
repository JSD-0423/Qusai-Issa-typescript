import express, { Request, Response } from "express";
import { getData } from "../utils/filesystem";
import * as mysql from "mysql";
import { Book } from "../models/book";
const app = express();
const port = 3000;

app.get("/books/", async (req: Request, res: Response) => {
  let query = req.query.name as string;

  try {
    const books = await getData();

    if (!query) {
      res.json(books);
      res.end();
    } else {
      const filteredBooks = books.filter((book: any) =>
        book.name.toLowerCase().startsWith(query.toLowerCase())
      );

      res.json(filteredBooks);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "db",
  port: 3306,
});

app.get("/books-db", (req, res) => {
  console.log("QQQQQQQQQQQ");
  pool.query("SELECT * FROM books", (error: string, results: Book[]) => {
    if (error) {
      console.error("Error fetching users from database:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error please connect the devaloper" });
      return;
    }

    const books: Book[] = results;
    // Process the fetched users as needed
    res.json(books);
  });
});
