import { Page } from "puppeteer";

async function searchProduct(page: Page, keyword: string) {
  await page.$("input[type='text']");
  await page.type("input[type='text']", keyword);

  (page.keyboard.press("Enter"),
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }),
    ]));
}

async function getProductLinks(page: Page) {
  await page.waitForSelector("li.productContainer");
  const links = await page.$$eval(
    "li.productContainer a.listItemLink",
    (items) => items.map((item) => item.getAttribute("href")),
  );

  return links.filter((link) => link != null);
}
async function selectSize(page: Page) {
  // Wait for size options to appear
  await page.waitForSelector(".productOptionsContainer");

  // Find and click the first size that is NOT out of stock
  const selected = await page.evaluate(() => {
    const options = document.querySelectorAll(
      ".boxOptionOuter > .productOptionItem",
    );
    for (const option of options) {
      if (!option.classList.contains("outOfStockOption")) {
        (option as HTMLElement).click();

        return option.textContent?.trim();
      }
    }
    return null;
  });

  if (!selected) {
    throw new Error("No available sizes found for this product");
  }

  await page.waitForFunction(
    () => {
      const selected = document.querySelector(
        ".productOptionItem.selectedOption",
      );
      return selected && !selected.classList.contains("disabledOption");
    },
    { timeout: 15000 },
  );

  return selected;
}
async function openProductLink(page: Page, links: string[]) {
  if (links.length === 0) {
    throw new Error("No products found");
  }
  const productLink = links[0];
  try {
    await page.goto(productLink, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForSelector(".productSummaryContainer", {
      timeout: 15000,
    });

    const product = await page.evaluate(() => {
      const title =
        document
          .querySelector(".productNameContainer > h1")
          ?.textContent?.trim() || "";
      const price =
        document.querySelector(".productPrice")?.textContent?.trim() || "";
      const size = "N/A";
      return { title, price, size };
    });
    product.size = await selectSize(page);

    return product;
  } catch (error) {
    throw new Error("Failed to open product page: " + error);
  }
}

export async function displayProducts(page: Page, keyword: string) {
  await searchProduct(page, keyword);
  const links = await getProductLinks(page);
  const product = await openProductLink(page, links);
  return product;
}
