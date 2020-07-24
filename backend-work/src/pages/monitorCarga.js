const components = require("../util/components");

module.exports = {
  page: {},
  initialize: async function(page) {
    this.page = page;
    components.initialize(this.page);
    await this.accessPage();
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
    const elementHandle = await this.page.$("#janela");
    const frame = await elementHandle.contentFrame();

    await components.waitVisible(
      "body > form > fieldset:nth-child(3) > table",
      frame
    );

    const gvdKeys = await frame.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "body > form > fieldset:nth-child(3) > table > tbody > tr:nth-child(1) > td"
        ),
        element => element.innerText
      )
    );

    const gvdItens = await frame.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "body > form > fieldset:nth-child(3) > table > tbody > tr:nth-child(2) > td"
        ),
        element => element.innerText
      )
    );

    let mapa = {};
    let auxiliar = {};

    for (let k in gvdKeys) {
      for (let i in gvdItens) {
        if (k === i) {
          mapa[k] = gvdKeys[k];
          auxiliar[gvdKeys[k]] = gvdItens[i];
        }
      }
    }

    // '1': 'SGO',
    // '2': 'Estacao',
    // '3': 'Atividade',
    // '4': 'Identificador',
    // '5': 'LocalSite',
    // '6': 'ArquivoCarregado',
    // '7': 'Fornecedor',
    // '8': 'Solicitante',
    // '9': 'ValorBrutoPV',
    // '14': 'PrimeiraAprovacao',
    // '16': 'SegundaAprovacao',
    // '18': 'StatusPV',
    // '19': 'CargaPV',

    const takeOffBreak = item => {
      return item.split("\n").join(" ");
    };

    const renderNumber = number => {
      return number
        .split(".")
        .join("")
        .replace(/,/g, ".");
    };

    let retorno = [];

    console.log(mapa)

    let obj = {
      SGO: auxiliar[mapa[1]],
      Estacao: auxiliar[mapa[2]],
      Atividade: auxiliar[mapa[3]],
      Identificador: auxiliar[mapa[4]],
      LocalSite: auxiliar[mapa[5]],
      ArquivoCarregado: auxiliar[mapa[6]],
      Fornecedor: auxiliar[mapa[7]],
      Solicitante: takeOffBreak(auxiliar[mapa[8]]),
      ValorBrutoPV: Number(renderNumber(auxiliar[mapa[9]])),
      PrimeiraAprovacao: auxiliar[mapa[14]],
      SegundaAprovacao: auxiliar[mapa[17]],
      StatusPV: auxiliar[mapa[18]],
      CargaPV: auxiliar[mapa[19]]
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
