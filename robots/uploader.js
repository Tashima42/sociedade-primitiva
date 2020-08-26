const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const epInfo = {
  title: "Número 175A - Emails com Bruno Brito (StallionsGames)",
  date: "2020-08-17",
  fileName: "NUMERO175EMAILSACOMBRUNOBRITO.mp3",
  description: "Deu só baixaria nessa primeira parte. Ouça por sua conta e risco.<br>\nStallionsGames\nhttps://www.youtube.com/channel/UCoIp5rRsHa7qygwvEsi8nIg\nhttps://www.facebook.com/stallionsgames/\nPerfil pessoal do Bruno: https://www.facebook.com/BrunoStallion99\n\nIntro: Momentos de descontração no programa Cadeia\nMúsicas: LPU 9\n\n\n\n"
}

const robot = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://www.archive.org/`, { waitUntil: 'load' });

  const cookiesString = await fs.readFile('cookies.json');
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);

  //await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

  await page.goto(`https://www.archive.org/upload`, { waitUntil: 'load' });

  await page.waitForSelector('input[type=file]');
  await page.waitFor(1000);

  const inputUploadHandle = await page.$('input[type=file]');
  let fileToUpload = 'test1.mp3';

  inputUploadHandle.uploadFile(fileToUpload);

  await page.waitFor(1500);

  // Set title
  await page.evaluate((title) => {
    document.getElementById("page_title").innerHTML = title;
  }, epInfo.title)

  // Set URL
  await page.evaluate((url) => {
    document.getElementById("item_id").innerHTML = url;
  }, epInfo.fileName)

  // Set description
  await page.$eval('#description', btn => btn.click());

  await page.evaluate((description) => {
    document.querySelector("iframe").contentDocument.querySelector("html body").innerHTML = description;
  }, epInfo.description)

  // Set Tags
  await page.$eval('#subjects', btn => btn.click());

  await page.evaluate(() => {
    document.querySelector(".input_field").value = "podcast, sociedade primitiva";
  })

  // Set Creator
  await page.$eval('#creator', btn => btn.click());

  await page.evaluate(() => {
    document.querySelector(".input_field").value = "Sociedade Primitiva";
  })

  // Set Date
  await page.$eval('#date_text', btn => btn.click());

  await page.evaluate(() => {
    document.querySelector("#date_year").value = "2020";
    document.querySelector("#date_month").value = "01";
    document.querySelector("#date_day").value = "12";
  })

  await page.$eval('body', btn => btn.click());

  await page.waitFor(1500);

  // Upload
  await page.$eval('button#upload_button', btn => btn.click());

};

robot();

module.exports = robot;