const puppeteer = require('puppeteer');

const robot = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  //for (let i = 1; i < 17; i++) {

  await page.goto(`https://www.megafono.host/podcast/sociedade-primitiva?page=1`, { waitUntil: 'load' });

  // for (let j = 0; j < 3; j++) {
  await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: './content/episodes' });
  const episodesLink = await page.evaluate(() => {
    const episodeBtn = [...document.querySelectorAll('.share')];
    return Array.prototype.map.call(episodeBtn, function (t) {
      return t.href;
    });
  })
  await page.goto(episodesLink[4], { waitUntil: 'load' });
  //await page.waitForNavigation({ waitUntil: 'networkidle' });

  //}

  //};
}

robot();

module.exports = robot;