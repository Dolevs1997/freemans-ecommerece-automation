import { Page } from "puppeteer";

async function searchProduct(page: Page, keyword: string) {
  await page.waitForSelector("input[type='text']");
  await page.type("input[type='text']", keyword);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();
  console.log("Search results loaded");
}

async function getProductLinks(page: Page) {
  await page.waitForSelector("li.productContainer");
  const links = await page.$$eval(
    "li.productContainer a.listItemLink",
    (items) => items.map((item) => item.getAttribute("href")),
  );

  return links.filter((link) => link != null);
}

async function processProducts(page: Page, links: string[]) {}

export async function displayProducts(page: Page, keyword: string) {
  await searchProduct(page, keyword);
  const links = await getProductLinks(page);
  await processProducts(page, links);
}
