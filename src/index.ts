import puppeteer, { Browser, Page } from "puppeteer";
import { displayProducts } from "./automation/product";
async function initWebsite(): Promise<{ page: Page }> {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: false, // try with visible browser first
      defaultViewport: null,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000); // Sets default navigation timeout to 60 seconds
    await page.goto("https://www.freemans.com", { waitUntil: "networkidle2" });
    return { page };
  } catch (error) {
    console.error("Error init website: ", error);
    if (browser) {
      await browser.close();
    }

    throw error;
  }
}

async function main() {
  try {
    const { page } = await initWebsite();

    await displayProducts(page, "dress");
  } catch (err) {
    console.error("Fatal error:", err);
  }
}
main();
