import express, { Request, Response } from "express";
import { getData } from "../utils/filesystem";
//const expressValidator = require('express-validator')

const app = express();
const port = 3000;
//app.use(expressValidator());

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
