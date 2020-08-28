'use strict';

const fs = require('fs')
const https = require('https');
const puppeteer = require('puppeteer');

/* ============================================================
  Promise-Based Download Function
  ============================================================ */

const download = (url, destination) => new Promise((resolve, reject) => {
  const file = fs.createWriteStream(destination);

  https.get(url, response => {
    response.pipe(file);

    file.on('finish', () => {
      file.close(resolve(true));
    });
  }).on('error', error => {
    fs.unlink(destination);

    reject(error.message);
  });
});


/* ============================================================
Download All Images
============================================================ */



const robot = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let interMediaryObject = {};
  const episodesInfos = [];

  for (let i = 1; i < 17; i++) {

    await page.goto(`https://www.megafono.host/podcast/sociedade-primitiva?page=${i}`, { waitUntil: 'load' });

    await page.waitFor(1000);

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
        interMediaryObject = {
          cover: episodesCoverImage[k],
          fileName: episodesFileName[k],
        }
        episodesInfos.push(interMediaryObject)
      }
      console.log(`${i}`)
    }
    writeEpisodesInfosToObject();

    let result;
    for (let i = 0; i < episodesInfos.length; i++) {
      const coverEp = episodesInfos[i].fileName.replace(".mp3", ".jpg")
      result = await download(episodesInfos[i].cover, `./content/images/${coverEp}`);
      if (result === true) {
        console.log('Success:', episodesInfos[i].cover, 'en downloaded successfully.');
      } else {
        console.log('Error:', episodesInfos[i].cover, 'ot downloaded.');
        console.error(result);
      }
    }
  }

  await browser.close();
};

robot();


module.exports = robot;