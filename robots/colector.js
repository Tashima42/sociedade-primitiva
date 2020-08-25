const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let output = {};
  const episodesInfos = [];

  for (let i = 1; i < 17; i++) {


    await page.goto(`https://www.megafono.host/podcast/sociedade-primitiva?page=${i}`, { waitUntil: 'load' });

    const episodesTitle = await page.evaluate(() => {
      let names = [...document.querySelectorAll('.episode__title a')];
      return Array.prototype.map.call(names, function (t) {
        return t.textContent;
      });
    })

    const episodesDate = await page.evaluate(() => {
      let date = [...document.querySelectorAll('time')];
      return Array.prototype.map.call(date, function (t) {
        return t.dateTime;
      });
    })

    const episodesDescription = await page.evaluate(() => {
      let description = [...document.querySelectorAll('.episode__body div')]
      return Array.prototype.map.call(description, function (t) {
        return t.innerHTML.replace(/<br>/ig, "\n");
      })
    })

    const episodesCoverImage = await page.evaluate(() => {
      let coverImage = [...document.querySelectorAll('.player-embed__artwork-image')];
      return Array.prototype.map.call(coverImage, function (t) {
        return t.src;
      });
    })

    const episodesFileName = await page.evaluate(() => {
      let fileName = [...document.querySelectorAll('.player-embed__share-box .share')];
      return Array.prototype.map.call(fileName, function (t) {
        const url = new URL(t.href)
        const urlPath = url.pathname
        return urlPath.substring(urlPath.lastIndexOf('/') + 1)
      });
    });


    const writeEpisodesInfosToObject = () => {
      for (let k = 0; k < 10; k++) {
        for (let j = 0; j < 5; j++) {
          output = {
            title: episodesTitle[k],
            date: episodesDate[k],
            cover: episodesCoverImage[k],
            fileName: episodesFileName[k],
            description: episodesDescription[k]
          }
        }
        episodesInfos.push(output)
      }
      console.log(`${i}`)
    }
    writeEpisodesInfosToObject();
  }
  const arrayToJson = JSON.stringify(episodesInfos);

  fs.writeFile(`colector.json`, arrayToJson, 'utf8', function (err) {
    if (err) {
      console.log("error");
      return console.error(err);
    }
    console.log("saved");
  })

  await browser.close();
})();