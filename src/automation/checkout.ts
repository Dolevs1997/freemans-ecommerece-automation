import { Page } from "puppeteer";
import { fillForm } from "./form";
export async function fillCheckoutForm(page: Page, pageName: string) {
  await page.waitForNavigation({
    waitUntil: "networkidle2",
    timeout: 10000,
  });
  // Click the "Pay Now" radio button (cash payment)
  await page.waitForSelector("input[value='cash']", {
    timeout: 30000,
  });
  await page.evaluate(() => {
    const radio = document.querySelector(
      "input[value='cash']",
    ) as HTMLInputElement;
    radio.click();
  });
  // Wait for card details form to appear
  await page.waitForSelector("#enterCardDetails", {
    visible: true,
    timeout: 30000,
  });

  await fillForm(page, pageName); // fills only payment fields
}
