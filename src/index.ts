import express, { Request, Response } from "express";
import { getData } from "../utils/filesystem";
//const expressValidator = require('express-validator')
import * as mysql from "mysql";
import { Book } from "../models/book";
import { error } from "console";
const app = express();
const port = 8000;
//app.use(expressValidator());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  
  //password: "Root123",
  password: "pass123",
  database: "db",
});

app.get("/books-file/", async (req: Request, res: Response) => {
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

app.get("/books/", async (req: Request, res: Response) => {
  let limit = 5;
  let offset = 0;
  const isbn = req.query.isbn;
  //check if we have a limit default 5
  if (req.query.limit) {
    limit = +req.query.limit;
  }
  //check if we have a page number default 1
  if (req.query.pageNumber) {
    offset = (+req.query.pageNumber - 1) * limit;
  }
  //validate limit and offset value

  if (limit < 1 || offset < 0) {
    res.status(400).json({
      error: "not acceptabil value for limit or page number",
      hint: "minimum value for limit and page number are 1 and 0 respectively",
    });
    return;
  }

  let query = "SELECT * FROM books WHERE isbn = ?";

  if (!isbn) {
    query = "SELECT * FROM books limit ? OFFSET " + offset;
  }
  try {
    const result: mysql.Query = await pool.query(
      query,
      [isbn || limit],
      (error, results) => {
        if (error) {
          console.error("Error fetching users from database:", error);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        const books: Book[] = results;
        if (books.length == 0) {
          res.status(404).json("The book was not found!");
        } else {
          res.json(books);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/books", async (req: Request, res: Response) => {
  try {
    const { name, author, isbn } = req.body;
    //TODO:: if isbn exist dont creat new one

    if (typeof isbn !== "number") {
      res.status(400).json({ error: "not acceptabil value for isbn" });
      return;
    }
    const query = "INSERT INTO books (name, author , isbn) VALUES (?, ?, ?)";
    const result: mysql.Query = await pool.query(
      query,
      [name, author, isbn],

      (error, results) => {
        if (error?.code == "ER_DUP_ENTRY") {
          console.error("Error fetching users from database:", error);
          res
            .status(500)
            .json({ error: "there is a book exist with the same isbn" });
          return;
        } else if (error) {
          console.error("Error fetching users from database:", error);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        } else {
          const responseData = {
            success: true,
            message: "Book created successfully",
            record: {
              name: name,
              author: author,
              isbn: isbn,
            },
          };
          res.json(responseData);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/books", async (req: Request, res: Response) => {
  const { name, author, isbn } = req.body;
  const query = "UPDATE books SET name=? ,author=? WHERE isbn =?;";

  await pool.query(query, [name, author, isbn], (error, results) => {
    if (error) {
      console.error("Error fetching users from database:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    // Process the fetched users as needed
    if (results.affectedRows) {
      res.json("The book is updated!");
    } else {
      res.status(404).json("The book was not found!");
    }
  });
});

app.delete("/books", async (req: Request, res: Response) => {
  const isbn = req.query.isbn;
  const query = "DELETE FROM books WHERE isbn =?;";
  await pool.query(query, [isbn], (error, results) => {
    if (error) {
      console.error("Error fetching users from database:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    // Process the fetched users as needed
    if (results.affectedRows) {
      res.json("The book is deleted!");
    } else {
      res.json("The book was not found!");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
