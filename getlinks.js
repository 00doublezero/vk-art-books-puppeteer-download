const jsonfile = require('jsonfile');
const puppeteer = require('puppeteer');
const URL = 'https://vk.com/topic-4918594_27696136';
const LINKS_FILE = 'config.json';

async function scroolToBottom(page) {
  let previousHeight = await page.evaluate('document.body.scrollHeight');
  let currentHeight = 0;
  try {
    while (previousHeight !== currentHeight) {
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(500);
      currentHeight = await page.evaluate('document.body.scrollHeight');
    }
  } catch (error) {
    let links = {};
    links = await page.evaluate(() => {
      let hrefs = {};
      const lnks = document.querySelectorAll('.page_doc_title');
      for (let i = 0; i < lnks.length; ++i) {
        hrefs[i] = [lnks[i].href, lnks[i].innerHTML];
      }
      return Promise.resolve(hrefs);
    });
    jsonfile.writeFileSync(LINKS_FILE, links);
  }
  console.log('Вся страница проскроллилась');
}
(async () => {
  const browser = await puppeteer.launch({ headless: false, executablePath: 'chromium-browser' });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.resourceType() === 'image') { request.abort(); } else { request.continue(); }
  });
  await page.setViewport({
    width: 1366,
    height: 768,
  });
  await page.goto(URL);
  await scroolToBottom(page);
  await browser.close();
})();
