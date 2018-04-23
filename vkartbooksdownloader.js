//file do nothing, just save as example.
const puppeteer = require('puppeteer');
const winston = require('winston');
const jsonfile = require('jsonfile');

const URL = 'https://vk.com/topic-4918594_27696136';
const CONFIG_FILE = 'config.json';
let booksCount;
let docsOnPage = [];
// const wantedElement = 0;
// let config = {};

(async () => {
  const logger = await winston.createLogger({
    transports: [
      new winston.transports.Console({ colorize: true }),
      new winston.transports.File({
        filename: 'logs/log.log',
        colorize: true,
        json: true,
      }),
    ],
  });
  const browser = await puppeteer.launch({ headless: false });
  const conf = await jsonfile.readFileSync(CONFIG_FILE);

  booksCount = await conf.booksCount;


  const page = await browser.newPage();
  await page.setViewport({
    width: 1366,
    height: 768,
  });
  await page.goto(URL);

  const pageTitle = await page.title();
  docsOnPage = await page.$$('.page_doc_title');
  // await console.info(docsOnPage.length);
  await logger.info(`Открыта страница: ${pageTitle}`);
  await logger.info(`Число скачанных книг: ${booksCount}`);
  await logger.info(`Число документов на странице: ${docsOnPage.length}`);


  await browser.close();
})();
