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

          // // Wait for address dropdown to appear
          // await page.waitForSelector("#addressSelect", {
          //   visible: true,
          //   timeout: 50000,
          // });
          // console.log("Address dropdown appeared");
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

        console.log("Email section appeared");
      }
    } else {
      throw new Error(`Unsupported property type: ${field.property}`);
    }
  } catch (error) {
    console.error(`Error filling field ${field.selector}:`, error);
    throw error;
  }
}
export async function fillForm(page: Page) {
  const formFields = getAllFormFields();
  if (formFields.length === 0) {
    throw new Error("No fields found in database for checkout_register");
  }
  console.log(`Found ${formFields.length} fields in DB. Filling form...`);

  for (const field of formFields) {
    // console.log("field selector: ", field.selector);
    // console.log("field property: ", field.property);
    // console.log("field value: ", field.value);
    await fillField(page, field);
  }
  console.log("Form filled successfully!");
  await page.$("#applybutton").then((button) => button?.click());
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 });
}
