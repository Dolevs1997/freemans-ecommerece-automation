import db from "./db";
import { FormField } from "../models/formFields";

const fields: FormField[] = [
  // Registration form fields
  {
    page: "register",
    selector: "select[name='Title']",
    property: "select",
    value: "Mr",
  },
  {
    page: "register",
    selector: "input[name='FirstName']",
    property: "value",
    value: "Steve",
  },
  {
    page: "register",
    selector: "input[name='LastName']",
    property: "value",
    value: "Rosenblum",
  },
  {
    page: "register",
    selector: "select[name='dob_day']",
    property: "select",
    value: "15",
  },
  {
    page: "register",
    selector: "select[name='dob_month']",
    property: "select",
    value: "08",
  },
  {
    page: "register",
    selector: "select[name='dob_year']",
    property: "select",
    value: "1990",
  },
  {
    page: "register",
    selector: "input[name='DayTimeTelephone']",
    property: "value",
    value: "07700900123",
  },
  {
    page: "register",
    selector: "input[name='houseId']",
    property: "value",
    value: "Buckingham Palace",
  },
  {
    page: "register",
    selector: "input[name='postCode']",
    property: "value",
    value: "SW1A 1AA",
  },
  {
    page: "register",
    selector: "select[name='addressSelect']",
    property: "select",
    value: "Buckingham Palace#",
  },
  {
    page: "register",
    selector: "input[name='Email']",
    property: "value",
    value: "steve.rosenblum@example.com",
  },
  {
    page: "register",
    selector: "input[name='ConfirmEmail']",
    property: "value",
    value: "steve.rosenblum@example.com",
  },
  {
    page: "register",
    selector: "input[name='Password']",
    property: "value",
    value: "Steve1990!",
  },
  {
    page: "register",
    selector: "input[name='confirmPassword']",
    property: "value",
    value: "Steve1990!",
  },

  // Payment form fields
  {
    page: "payment",
    selector: "input[name='CardHolderName']",
    property: "value",
    value: "Steve Rosenblum",
  },
  {
    page: "payment",
    selector: "input[name='CardNumber']",
    property: "value",
    value: "4111111111111111",
  },
  {
    page: "payment",
    selector: "input[name='ExpiryDateMonthYear']",
    property: "value",
    value: "12/26",
  },
  {
    page: "payment",
    selector: "input[name='CardSecurityCode']",
    property: "value",
    value: "123",
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
    INSERT INTO form_fields ( page, selector, property, value)
    VALUES ( @page, @selector, @property, @value)
  `);
  fields.forEach((field) => {
    insert.run({
      page: field.page,
      selector: field.selector,
      property: field.property,
      value: field.value,
    });
  });
  console.log(`Seeded ${fields.length} records into database.`);
}
