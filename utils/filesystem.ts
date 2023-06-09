import * as fs from "fs";
import path from "path";
import { Book } from "../models/book";
const FILEPATH: string = path.join(__dirname,"..",  "data", "books.json");

const getData = (): Book[] => {
  const isExist: boolean = fs.existsSync(FILEPATH);
  let books: Book[] = [];
  if (!isExist) {
    fs.writeFileSync(FILEPATH, "[]");
  } else {
    books = JSON.parse(fs.readFileSync(FILEPATH, "utf8"));
  }
  return books;
};

export { getData };