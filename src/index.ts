import express, { Request, Response } from "express";
import { getData } from "../utils/filesystem";
//const expressValidator = require('express-validator')
import * as mysql from "mysql";
import {Book} from "../models/book"
import { error } from "console";
const app = express();
const port = 8000;
//app.use(expressValidator());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Root123",
  database: "db"
});


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

app.get("/books/:pageNumber", async (req: Request, res: Response) => {
  
  const pageNumber: string = req.params.id;
  let limit = 5;
  //pagenation

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

app.get("/db-books", (req, res) => {
  try{

  pool.query("SELECT * FROM books", (error, results) => {
    if (error) {
      console.error("Error fetching users from database:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const books: Book[] = results;
    // Process the fetched users as needed
    res.json(books);
  });}
  catch(e){
    console.log(e)
  }
});

app.get('/db-books/:id', async (req: Request, res: Response,) => {
  const isbn: string = req.params.id;
  try{
    const query = 'SELECT * FROM books WHERE isbn = ?';
    const result: mysql.Query = await pool.query(query, [isbn],(error, results) => {

      if (error) {
        console.error("Error fetching users from database:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      const books: Book[] = results;
      res.json(books);
    });
  }
  catch(error){
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/books', async (req: Request, res: Response) => {
  //TODO:: if isbn exist dont creat new one
  console.log("---------------------")
  console.log(req.body)
  try{
    const { name, author, isbn } = req.body;
    const query = 'INSERT INTO books (name, author , isbn) VALUES (?, ?, ?)';
    const result: mysql.Query = await pool.query(query, [name, author, isbn],(error, results) => {
      if (error) {
        console.error("Error fetching users from database:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      else{
        console.log("*-*-*-*-*-*-")
        console.log(results)
        const responseData = {
          success : true,
          message : "Book created successfully",
          record :{
             name: name,
             author: author,
             isbn: isbn
          }
         }
         res.json(responseData);

      }

    });

  }
  catch(error){
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
