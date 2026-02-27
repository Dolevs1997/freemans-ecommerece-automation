import db from "./db";
import { FormField } from "../models/formFields";
// 1. Get all fields for a specific page
export function getAllFormFields(pageName: string): FormField[] {
  return db
    .prepare("SELECT * FROM form_fields WHERE page = ?")
    .all(pageName) as FormField[];
}
// 2. Search by field - find a record by its selector
export function searchByField(selector: string): FormField[] {
  return db
    .prepare("SELECT * FROM form_fields WHERE selector = ?")
    .all(selector) as FormField[];
}

export function updateFormField(selector: string, newValue: string): void {
  db.prepare("UPDATE form_fields SET value=? WHERE selector =?").run(
    newValue,
    selector,
  );
}

export function deleteRecord(): void {
  db.prepare("DELETE FROM form_fields").run();
  db.exec("DROP TABLE IF EXISTS form_fields");
}
