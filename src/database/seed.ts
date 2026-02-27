import db from "./db";
import { FormField } from "../models/formFields";

const fields: FormField[] = [
  { selector: "select[name='Title']", property: "select", value: "Mr" },
  { selector: "input[name='FirstName']", property: "value", value: "Steve" },
  { selector: "input[name='LastName']", property: "value", value: "Rosenblum" },
  { selector: "select[name='dob_day']", property: "select", value: "15" },
  { selector: "select[name='dob_month']", property: "select", value: "08" },
  { selector: "select[name='dob_year']", property: "select", value: "1990" },
  {
    selector: "input[name='DayTimeTelephone']",
    property: "value",
    value: "07700900123",
  },
  {
    selector: "input[name='houseId']",
    property: "value",
    value: "Buckingham Palace",
  },
  { selector: "input[name='postCode']", property: "value", value: "SW1A 1AA" },
  {
    selector: "select[name='addressSelect']",
    property: "select",
    value: "Buckingham Palace#",
  },
  {
    selector: "input[name='Email']",
    property: "value",
    value: "steve.rosenblum@example.com",
  },
  {
    selector: "input[name='ConfirmEmail']",
    property: "value",
    value: "steve.rosenblum@example.com",
  },
  {
    selector: "input[name='Password']",
    property: "value",
    value: "Steve1990!",
  },
  {
    selector: "input[name='confirmPassword']",
    property: "value",
    value: "Steve1990!",
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
