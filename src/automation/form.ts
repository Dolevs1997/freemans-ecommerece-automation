import { Page } from "puppeteer";
import { FormField } from "../models/formFields";
import { getAllFormFields } from "../database/db";
async function fillField(page: Page, field: FormField) {
  try {
    await page.waitForSelector(field.selector, { timeout: 10000 });

    if (field.property === "value") {
      await page.type(field.selector, field.value);

      if (field.selector === "input[name='postCode']") {
        const findAddressButton = await page.$("#searchAddressImageButton");
        if (findAddressButton) {
          await findAddressButton.click();
        }
      }
    } else if (field.property === "select") {
      await page.select(field.selector, field.value);

      // After selecting address, wait for email section to become visible
      if (field.selector === "select[name='addressSelect']") {
        await page.waitForSelector("#Email", {
          visible: true,
          timeout: 10000,
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } else {
      throw new Error(`Unsupported property type: ${field.property}`);
    }
  } catch (error) {
    console.error(`Error filling field ${field.selector}:`, error);
    throw error;
  }
}
export async function fillForm(page: Page, pageName: string) {
  const formFields = getAllFormFields(pageName);
  if (formFields.length === 0) {
    throw new Error(`No fields found in database for page: ${pageName}`);
  }
  console.log(`Found ${formFields.length} fields in DB. Filling form...`);

  for (const field of formFields) {
    await fillField(page, field);
  }
  console.log("Form filled successfully!");
  await page.$("#applybutton").then((button) => button?.click());
  await page.waitForNavigation({
    waitUntil: "networkidle2",
    timeout: 10000,
  });
}
