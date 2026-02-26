import db from "./db";
import { FormField } from "../models/formFields";

const fields: FormField[] = [
  // Registration form fields
  {
    selector: "select[name='title']", // update after inspecting
    property: "select",
    value: "Mr",
  },
  {
    selector: "input[name='firstName']", // update after inspecting
    property: "value",
    value: "Steve",
  },
  {
    selector: "input[name='surname']", // update after inspecting
    property: "value",
    value: "Rosenblum",
  },
  {
    selector: "select[name='dobDay']", // update after inspecting
    property: "select",
    value: "15",
  },
  {
    selector: "select[name='dobMonth']", // update after inspecting
    property: "select",
    value: "6",
  },
  {
    selector: "select[name='dobYear']", // update after inspecting
    property: "select",
    value: "1990",
  },
  {
    selector: "input[name='contactNumber']", // update after inspecting
    property: "value",
    value: "07700900123",
  },
  {
    selector: "input[name='houseNumber']", // update after inspecting
    property: "value",
    value: "123",
  },
  {
    selector: "input[name='postcode']", // update after inspecting
    property: "value",
    value: "SW1A 1AA",
  },
];

export function seedDatabase() {
  const existingDB = db
    .prepare("SELECT COUNT(*) as count FROM form_fields")
    .get() as { count: number };
  if (existingDB.count > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }
  const insert = db.prepare(`
    INSERT INTO form_fields ( selector, property, value)
    VALUES ( @selector, @property, @value)
  `);
  fields.forEach((field) => {
    insert.run({
      selector: field.selector,
      property: field.property,
      value: field.value,
    });
  });
  console.log(`Seeded ${fields.length} records into database.`);
}
