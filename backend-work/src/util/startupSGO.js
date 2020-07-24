//const puppeteer = require("puppeteer");
const puppeteer = require("puppeteer");
const constants = require("./configs");

module.exports = {
  configs: {
    headless: false,
    defaultViewport: {
      width: 1024,
      height: 800,
      isMobile: false,
      hasTouch: false
    },
    args: ["--start-maximized"]
  },
  page: {},
  browser: {},
  createBrowser: async function(config) {
    var cfg = config || this.configs;
    var browser = await puppeteer.launch(cfg);
    let page = await browser.newPage();
    this.page = page;
    this.browser = browser;
    return page;
  },
  getBrowser: async function() {
    return this.browser;
  },
  getPage: async function() {
    return this.page;
  },
  initialize: async function(page, url = constants.SITE_SGO_URL) {
    await this.navigate(url, page);
  },
  navigate: async function(url, page) {
    var p = page || this.page;
    await p.goto(url);
  },
  terminate: async function() {
    await this.page.close();
    await this.browser.close();
  }
};
