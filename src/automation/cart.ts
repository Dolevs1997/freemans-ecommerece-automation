import { Page } from "puppeteer";

type Product = {
  title: string;
  price: string;
  size: string;
};

export async function addToCart(page: Page, product: Product) {
  try {
    const addToCartButtonElementHandle = await page.$(".bagButton");
    addToCartButtonElementHandle?.click();
    // Wait for the cart link to appear and navigate to the cart page
    await page.waitForSelector(".xfoBagLink");
    const link = await page.$eval(".xfoBagLink", (el) =>
      el.getAttribute("href"),
    );
    if (link) {
      console.log("Navigating to cart page: ", link);
      await page.goto(link, { waitUntil: "networkidle2", timeout: 60000 });
      showCartDetails(page, product);
    } else {
      throw new Error("Cart link not found");
    }
  } catch (error) {
    throw new Error("failed to add product to cart: " + error);
  } finally {
    console.log("Product added to cart: ", product);
  }
}

export async function showCartDetails(page: Page, product: Product) {
  await page.waitForSelector(".bagTitleContainer-Qty");

  const quantity = await page.$eval(".bagTitleContainer-Qty", (el) => {
    const text = el.textContent?.trim() || "(0 Items)";
    // extract just the number using regex
    const match = text.match(/\((\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });

  if (quantity === 0) {
    throw new Error("Cart is empty - product was not added successfully");
  }
  const checkout = await page.waitForSelector(".bagPrimaryButton");
  checkout?.click();
}
