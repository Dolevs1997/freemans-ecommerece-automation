# Freemans Checkout Automation

A Puppeteer + TypeScript automation script that navigates Freemans.com, selects a product, adds it to the cart, and fills in the multi-page checkout form. All form selectors and values are stored in a local SQLite database.

---

## Project Structure

```
freemans-checkout-automation/
├── src/
│   ├── index.ts                  # Main entry point
│   ├── automation/
│   │   ├── product.ts            # Search and select a product
│   │   ├── cart.ts               # Add to cart and navigate to checkout
│   │   ├── form.ts               # Fill form fields from database
│   │   └── checkout.ts           # Handle payment page
│   ├── database/
│   │   ├── db.ts                 # Database connection and query helpers
│   │   ├── seed.ts               # Seed initial form data
│   │   └── queries.ts            # All SQL query functions
│   └── models/
│       └── formFields.ts         # TypeScript interface for FormField
├── form_selectors.sqlite          # Auto-generated SQLite database
├── queries.sql                    # Raw SQL queries for the assignment
├── package.json
├── tsconfig.json
└── README.md
```

---

## Prerequisites

- Node.js v18 or higher
- npm

---

## Installation

**1. Clone the repository:**

```bash
git clone https://github.com/your-username/freemans-checkout-automation.git
cd freemans-checkout-automation
```

**2. Install dependencies:**

```bash
npm install
```

---

## Running the Project

```bash
npm start
```

On first run this will:

1. Create `form_selectors.sqlite` and seed it with form data
2. Open a browser and navigate to Freemans.com
3. Search for a dress, select the first available product and size
4. Add the product to cart and proceed to checkout
5. Fill in the registration form using values from the database
6. Navigate to the payment page and fill in card details

---

## Database

The project uses a single SQLite file (`form_selectors.sqlite`) to store all form field data.

### Table Schema

```sql
CREATE TABLE form_fields (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  page      TEXT    NOT NULL,
  selector  TEXT    NOT NULL,
  property  TEXT    NOT NULL,
  value     TEXT    NOT NULL
);
```

| Column     | Description                     | Example                          |
| ---------- | ------------------------------- | -------------------------------- |
| `id`       | Unique identifier               | `1`                              |
| `page`     | Which page the field belongs to | `"register OR payment"`          |
| `selector` | CSS selector to find the input  | `"input[name='FirstName']"`      |
| `property` | How to interact with it         | `"value"`, `"select"`, `"click"` |
| `value`    | What to fill in                 | `"Steve"`                        |

### SQL Queries

See `queries.sql` for all queries. Summary:

```sql
-- Retrieve all records
SELECT * FROM form_fields;

-- Search by field name
SELECT * FROM form_fields WHERE selector LIKE '%FirstName%';

-- Update a record
UPDATE form_fields SET value = 'John' WHERE selector = "input[name='FirstName']";

-- Delete table and drop it after browser is closed
DELETE FROM form_fields ;
DROP TABLE IF EXISTS form_fields
```

---

## How It Works

### 1. Database is seeded first

`seed.ts` inserts all form field rows into SQLite on the first run. If the database already has data it skips seeding to avoid duplicates.

### 2. Automation reads from the database

`form.ts` reads rows from the database and uses each selector and value to fill the corresponding input on the page — no values are hardcoded in the automation code.

```
seedDatabase()
    ↓ inserts rows into form_selectors.sqlite

searchByField()
updateFormField();
    ↓ performing querying interactions with database

initWebsite()
    ↓ openning browser

displayProducts()
    ↓ searches "dress", opens first result, selects available size

addToCart()
    ↓ clicks add to cart, navigates to bag, proceeds to checkout

fillForm(page, "register")
    ↓ reads register fields from DB → fills registration form

fillCheckoutForm(page, "payment")
    ↓ selects Pay Now → reads payment fields from DB → fills card details

      browser.close(); closing browser and deleting database
      deleteRecord();
```

---

## Tech Stack

- [Puppeteer](https://pptr.dev/) — browser automation
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — SQLite database
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [ts-node](https://typestrong.org/ts-node/) — run TypeScript directly

---

## Notes

- The browser runs in **headful mode** (visible) so you can see the automation in action
- The script automatically choose product and fills the blanked form input
- All personal details used are fake test data
