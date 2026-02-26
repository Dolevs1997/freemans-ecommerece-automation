import Database from "better-sqlite3";
import { FormField } from "../models/formFields";
import path from "path";

// Creates form_selectors.sqlite at project root
const DB_PATH = path.join(process.cwd(), "form_selectors.sqlite");
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS form_fields (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    selector  TEXT    NOT NULL,
    property  TEXT    NOT NULL,
    value     TEXT    NOT NULL
  )
`);

export default db;
