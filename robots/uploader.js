const puppeteer = require('puppeteer');
const fs = require('fs');
const fsCookies = fs.promises;

const episodesInfo = JSON.parse(fs.readFileSync("./content/infos/colector.json"))

const robot = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://www.archive.org/`, { waitUntil: 'load' });

  const cookiesString = await fsCookies.readFile('./content/credentials/cookies-archive.json');
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);

  //await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

  await page.goto(`https://www.archive.org/upload`, { waitUntil: 'load' });

  await page.waitForSelector('input[type=file]');
  await page.waitFor(1000);
  const inputUploadHandle = await page.$('input[type=file]');
  //let fileToUpload = `./content/episodes/${episodesInfo[1].fileName}`;
  let fileToUpload = `./content/episodes/test1.mp3`;
  inputUploadHandle.uploadFile(fileToUpload);

  await page.waitFor(1500);

  // Set title
  await page.evaluate((title) => {
    document.getElementById("page_title").innerHTML = title;
  }, episodesInfo[1].title)

  // Set URL
  await page.evaluate((url) => {
    document.getElementById("item_id").innerHTML = url;
  }, episodesInfo[1].fileName)

  // Set description
  await page.$eval('#description', btn => btn.click());

  await page.evaluate((description) => {
    document.querySelector("iframe").contentDocument.querySelector("html body").innerHTML = description;
  }, episodesInfo[1].description)

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

  await page.waitFor(9000);

  // Upload
  await page.$eval('button#upload_button', btn => btn.click());

  // Wait redirect happens
  await page.waitForSelector('.download-pill', { visible: true, timeout: 0 });
  const mp3Link = await page.evaluate(() => document.querySelectorAll(".download-pill")[2].href)
  console.log(mp3Link)
};

robot();

module.exports = robot;