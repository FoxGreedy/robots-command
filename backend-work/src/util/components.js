const configs = require("./configs");

module.exports = {
  page: {},
  initialize: function(page) {
    this.page = page;
  },
  wait: async function(selector, parentElement) {
    let parent = parentElement || this.page;
    console.log("Procurando o componente: " + selector);
    await parent.waitForSelector(selector);
    return await this.waitVisible(selector, parent);
  },
  waitVisible: async function(selector, parentElement) {
    let parent = parentElement || this.page;
    console.log("Esperando o componente: " + selector + " Ficar visivel");
    return await parent.waitForSelector(selector, {
      visible: true
    });
  },
  delay: async function(time = 10, parentElement) {
    let parent = parentElement || this.page;
    await parent.waitFor(time);
  },
  sendEnterOn: async function(selector, parentElement, delay) {
    await this.sendKeyOn(selector, 13, parentElement, delay);
  },

  sendKeyOn: async function(selector, keyCode, parentElement, delay) {
    var p = parentElement || this.page;
    await this.delay(delay, p);
    await this.wait(selector, p);
    await p.type(selector, String.fromCharCode(keyCode));
  },

  setTextInputValue: async function(selector, value, parentElement, delay) {
    //if (delay) await this.page.waitFor(delay);
    await this.delay(delay);

    var p = parentElement || this.page;
    await p.waitFor(selector);
    await this.waitVisible(selector, parentElement);

    console.log("Setando valor '" + value + "' no componente: " + selector);
    //await this.clearInput(selector, p);
    //await p.type(selector, value);

    await p.evaluate(
      data => {
        return (document.querySelector(data.selector).value = data.value);
      },
      { selector, value }
    );
  },
  inputTextValue: async function(selector, value, parentElement, delay) {
    //if (delay) await this.page.waitFor(delay);
    await this.delay(delay);

    var p = parentElement || this.page;
    await p.waitFor(selector);
    await this.waitVisible(selector, parentElement);

    console.log("Setando valor '" + value + "' no componente: " + selector);
    await this.clearInput(selector, p);
    await p.type(selector, value);
  },
  getTextInputValue: async function(selector, parentElement) {
    var p = parentElement || this.page;
    await p.waitFor(selector);
    await this.waitVisible(selector, parentElement);
    console.log("Obtendo valor no componente: " + selector);
    await p.evaluate(
      data => {
        return document.querySelector(data.selector).value;
      },
      { selector }
    );
  },

  getAltValue: async function(selector, parentElement) {
    var p = parentElement || this.page;
    await p.waitFor(selector);
    console.log("Obtendo valor no componente: " + selector);
    return await p.evaluate(
      selector => document.querySelector(selector).title,
      selector
    );
  },

  getInnerValue: async function(selector, parentElement) {
    var p = parentElement || this.page;

    var exists = await this.exists(selector, p);
    if (exists === false) return "";

    await p.waitFor(selector);
    console.log("Obtendo valor no componente: " + selector);
    return await p.evaluate(
      selector => document.querySelector(selector).innerText,
      selector
    );
  },

  clearInput: async function(selector, parentElement) {
    let parent = parentElement || this.page;
    await parent.evaluate(
      selector => (document.querySelector(selector).value = ""),
      selector
    );
  },

  clickOn: async function(selector, parentElement, delay) {
    let parent = parentElement || this.page;
    //if (delay)
    await this.delay(delay, parent);

    await this.wait(selector, parentElement);
    console.log("Clicando no componente: " + selector);
    await parent.evaluate(
      selector => document.querySelector(selector).click(),
      selector
    );
  },

  dbClickOn: async function(selector, parentElement, delay) {
    //if (delay) await this.page.waitFor(delay);
    await this.delay(delay);

    let parent = parentElement || this.page;
    await this.wait(selector, parentElement);
    console.log("Clicando no componente: " + selector);
    await parent.evaluate(
      selector => document.querySelector(selector).click({ clickCount: 2 }),
      selector
    );
  },

  focusOn: async function(selector, parentElement) {
    await this.wait(selector, parentElement);
    let parent = parentElement || this.page;
    console.log("Clicando no componente: " + selector);
    await parent.evaluate(
      selector => document.querySelector(selector).focus(),
      selector
    );
  },

  takeScreenshot: async function(path) {
    let filePath = path || configs.SCREENSHOT_NAME;
    //await this.page.screenshot({ path: filePath });
  },

  getFrameByName: async function(frameName) {
    await this.page.waitForSelector("iframe#ivuFrm_page0ivu2");
    //await this.page.waitFor(1000);
    await this.delay(500);
    const frameBase = this.page.mainFrame().childFrames();

    for (const frame of frameBase) {
      if (frame.name().includes(frameName)) {
        return frame;
        break;
      }
    }
    // frameBase.forEach(element => {
    //   console.log(element.name());
    //   if (element.name().includes(frameName)) return element;
    // });
  },
  getFrame: async function() {
    await this.page.waitForSelector("iframe#ivuFrm_page0ivu2");
    console.log("achou o frame ivuFrm_page0ivu2");
    //await this.page.waitFor(1000);
    await this.delay(500);
    //const frameBase = this.page.mainFrame().childFrames();

    //alterar para não interferir o idioma
    for (const frame of this.page.mainFrame().childFrames()) {
      if (frame.name().includes("interna de desktop")) {
        console.log("achou o frame Desktop Innerpage");
        for (const frameSub of frame.childFrames()) {
          if (frameSub.name().includes("isolatedWorkArea")) {
            console.log("achou o frame isolatedWorkArea");
            return frameSub;
            break;
          }
        }
        break;
      }
    }
  },
  exists: async function(selector, parentElement) {
    let parent = parentElement || this.page;
    await this.delay(100);
    console.log("Verificando se o componente " + selector + " existe");
    return (await parent.$(selector)) !== null;
  }
};

//-- 9561
