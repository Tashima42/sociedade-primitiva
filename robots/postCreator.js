const puppeteer = require('puppeteer');
const fs = require('fs');
const fsCookies = fs.promises;

const robot = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://www.blogger.com`, { waitUntil: 'load' });

  await page.waitFor(50000);

  // Save Session Cookies
  const cookiesObject = await page.cookies()
  // Write cookies to temp file to be used in other profile pages
  fs.writeFile('./content/credentials/cookies-blogger.json', cookiesObject, { spaces: 2 },
    function (err) {
      if (err) {
        console.log('The file could not be written.', err)
      }
      console.log('Session has been successfully saved')
    })

};

robot();

module.exports = robot;

