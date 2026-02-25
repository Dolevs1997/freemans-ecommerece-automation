import puppeteer from "puppeteer";
initWebsite();
async function initWebsite() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.freemans.com/");
  await page.setViewport({ width: 1080, height: 1024 });
}
