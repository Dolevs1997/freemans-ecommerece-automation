import db from "./db";
import { FormField } from "../models/formFields";
export function getAllFormFields(pageName: string): FormField[] {
  return db
    .prepare("SELECT * FROM form_fields WHERE page = ?")
    .all(pageName) as FormField[];
}
