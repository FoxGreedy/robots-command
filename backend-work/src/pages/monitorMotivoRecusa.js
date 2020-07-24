const components = require("../util/components");

module.exports = {
  page: {},
  initialize: async function(page) {
    this.page = page;
    components.initialize(this.page);
    // await this.accessPage();
  },
  accessPage: async function() {
    await components.clickOn("#menusup3");
    await components.clickOn("#menusup3_2");
  },
  leavePage: async function() {
    await components.clickOn("#navNode_2_0");
  },
  searchSGO: async function(sgo) {
    const elementHandle = await this.page.$("#janela");
    const frame = await elementHandle.contentFrame();

    await components.clickOn("input[id='idSolicitacao']", frame);
    await components.setTextInputValue("input[id='idSolicitacao']", sgo, frame);
    await components.clickOn("input[id='button']", frame);
  },

  getInformacoesSGO: async function() {
    // const elementHandle = await this.page.$("#janela");
    // const frame = await elementHandle.contentFrame();
    const page = this.page;

    await components.waitVisible("body > fieldset > table");

    const element = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "body > fieldset > table > tbody > tr:nth-child(20) > td:nth-child(2) > li"
        ),
        element => element.innerText
      )
    );

    const idElement = await page.evaluate(
      () =>
        document.querySelector(
          "body > fieldset > table > tbody > tr:nth-child(1) > td"
        ).firstChild.nodeValue
    );

    let retorno = [];
    let obj = {
      SGO: idElement.split(': ')[1],
      MotivoRecusa: element.join('; ')
    };

    retorno.push(obj);
    return retorno;
  }
  // navegarTelaCadeia: async function () {
  //   let frame = await components.getFrame();

  //   await components.clickOn(
  //     "#idSolicitacao",
  //     frame,
  //     1000
  //   );

  //   await components.clickOn(
  //     "#idSolicitacao",
  //     frame,
  //     1000
  //   );

  //   await components.waitVisible(
  //     'body > form > fieldset:nth-child(3) > table',
  //     frame
  //   );
  // },
};
