const jsonfile = require('jsonfile');
const puppeteer = require('puppeteer');
const fs = require('fs');
var path = require('path');

const DOWNLOAD_DIR = '/home/doublezero/books/';
const ARCHIVE_DIR = '/home/doublezero/arch/';

const downloadingSuffix = '.crdownload';

const LINKS_FILE = 'config.json';
const DELETE_FILE = 'delete.json';
const INC_FILE = 'inc.json'


const conf = jsonfile.readFileSync(LINKS_FILE);

const configLength = Object.keys(conf).length;

(async () => {
	const browser = await puppeteer.launch({ userDataDir:"/home/doublezero/.config/chromium",headless: false, executablePath: 'chromium-browser', args:[

  	]});

  	const page = await browser.newPage();
  	await page.setRequestInterception(true);
  	page.on('request', (request) => {
    	if (request.resourceType() === 'image') { request.abort(); } else { request.continue(); }
  	});

  	for (let i = 0; i < configLength;i++) {

  		console.log("Open page: "+conf[i][0]);

  		try {
  			await page.goto(conf[i][0]);
  		} catch (e) {

  		}
		console.log("Page is Opened.");

		let existOfDowloadedingMetaFile = null;
		do {
			await page.waitFor(4000);
			console.log("Wait For 4 seconds.");

			existOfDowloadedingMetaFile = false;

			fs.readdirSync(DOWNLOAD_DIR).forEach(file => {

			  if (path.extname(file) === downloadingSuffix) {
			  	existOfDowloadedingMetaFile = true;

			  	console.log("Wait Until file will downloaded")
			  } else {

			  	fs.renameSync(DOWNLOAD_DIR + file, ARCHIVE_DIR + file);
			  }
			})
		} while (existOfDowloadedingMetaFile === true);
		console.log("Write increment to config");
		console.log("Download next file");
		jsonfile.writeFileSync(INC_FILE, {i});
	}
  	await browser.close();

})();