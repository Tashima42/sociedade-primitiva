const puppeteer = require('puppeteer');
const fs = require('fs');
const fsCookies = fs.promises;

const episodesInfo = JSON.parse(fs.readFileSync("./content/infos/colectorCode3.json"))

const robot = async () => {

  let episodesWithLink = JSON.parse(fs.readFileSync("./content/infos/colectorCode4.json"))

  let intermediaryObject = {}

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://www.archive.org/`, { waitUntil: 'load' });

  const cookiesString = await fsCookies.readFile('./content/credentials/cookies-archive.json');
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);

  //await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  for (i = 62; i < episodesInfo.length; i++) {


    await page.goto(`https://www.archive.org/upload`, { waitUntil: 'load' });

    await page.waitForSelector('input[type=file]');
    await page.waitFor(1000);
    const inputUploadHandle = await page.$('input[type=file]');
    let fileToUpload = `./content/episodes/${episodesInfo[i].fileName}`;
    //let fileToUpload = `./content/episodes/test1.mp3`;
    inputUploadHandle.uploadFile(fileToUpload);

    await page.waitFor(5000);

    // Set title
    await page.evaluate((title) => {
      document.getElementById("page_title").innerHTML = title;
    }, episodesInfo[i].title)

    // Set URL
    /*     await page.evaluate((url) => {
          document.getElementById("item_id").innerHTML = url;
        }, episodesInfo[i].fileName) */

    // Set description
    await page.$eval('#description', btn => btn.click());

    await page.evaluate((description) => {
      document.querySelector("iframe").contentDocument.querySelector("html body").innerHTML = description;
    }, episodesInfo[i].description)

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

    await page.waitFor(4000);

    // Upload
    await page.$eval('button#upload_button', btn => btn.click());

    // Wait redirect happens
    await page.waitForSelector('.download-pill', { visible: true, timeout: 0 });
    const mp3Link = await page.evaluate(() => document.querySelectorAll(".download-pill")[2].href)

    intermediaryObject = {
      title: episodesInfo[i].title,
      date: episodesInfo[i].date,
      cover: episodesInfo[i].cover,
      fileName: episodesInfo[i].fileName,
      description: episodesInfo[i].description,
      episodeLink: mp3Link

    }
    episodesWithLink.push(intermediaryObject)

    let arrayToJson = JSON.stringify(episodesWithLink);

    fs.writeFile(`./content/infos/colectorCode4.json`, arrayToJson, 'utf8', function (err) {
      if (err) {
        console.log("error");
        return console.error(err);
      }
      console.log(`${i - 1}/${episodesInfo.length}`);
    })

  };
}

robot();

module.exports = robot;

/*
<?xml version='1.0' encoding='UTF-8'?>
<Error><Code>SlowDown</Code><Message>Please reduce your request rate.</Message><Resource>Your upload of numero-125-falsaacusaocomcaveiragames from username pedrotashima@protonmail.com appears to be spam. If you believe this is a mistake, contact info@archive.org and include this entire message in your email.</Resource><RequestId>c6832542-3482-4ba1-ad6f-a5e4c040f2d3</RequestId></Error>
*/