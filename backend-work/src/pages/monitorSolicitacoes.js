const components = require("../util/components");
const Moment = require("moment");

module.exports = {
  page: {},
  initialize: async function(page) {
    this.page = page;
    components.initialize(
      this.page,
      "http://localhost:8081/static/solicitacoes.html"
    );
    await this.accessPage();
  },
  accessPage: async function() {
    await components.clickOn("#menusup3");
    await components.clickOn("#menusup3_5");
  },
  leavePage: async function() {
    await components.clickOn("#navNode_2_0");
  },
  searchSGO: async function(sgo) {
    const elementHandle = await this.page.$("#janela");
    const frame = await elementHandle.contentFrame();

    await components.clickOn("input[id='id_solicitacao']", frame);
    await components.setTextInputValue(
      "input[id='id_solicitacao']",
      sgo,
      frame
    );
    await components.clickOn(
      "body > form > fieldset:nth-child(1) > table > tbody > tr > td:nth-child(2) > input[type=submit]:nth-child(15)",
      frame
    );
  },
  getInformacoesSolicitacoes: async function() {
    const elementHandle = await this.page.$("#janela");
    const frame = await elementHandle.contentFrame();

    await components.waitVisible("#listasolicitacao > table", frame);

    const gvdKeys = await frame.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#listasolicitacao > table > thead > tr > th"
        ),
        element => element.innerText
      )
    );

    const gvdItens = await frame.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#listasolicitacao > table > tbody > tr > td"
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
    // '2': 'ItemCapexDescricao',
    // '4': 'ValorSolicitacao',
    // '5': 'DataSolicitacao',
    // '7': 'GerenteMatriz',
    // '9': 'Diretor',
    // '11': 'GPCN1',
    // '13': 'GPCN2',
    // '14': 'StatusProcessamento',
    // '15': 'StatusSolicitacoesVerba',

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
    let obj = {
      SGO: auxiliar[mapa[1]],
      ItemCapexDescricao: takeOffBreak(auxiliar[mapa[2]]),
      ValorSolicitacao: Number(renderNumber(auxiliar[mapa[4]])),
      GerenteMatriz: takeOffBreak(auxiliar[mapa[7]]),
      Diretor: takeOffBreak(auxiliar[mapa[9]]),
      GPCN1: takeOffBreak(auxiliar[mapa[11]]),
      GPCN2: takeOffBreak(auxiliar[mapa[13]]),
      StatusProcessamento: takeOffBreak(auxiliar[mapa[14]]),
      StatusSolicitacoesVerba: takeOffBreak(auxiliar[mapa[15]]),
      UltimaAtualizacao: new Date()
    };

    let DataSolicitacao = Moment(auxiliar[mapa[5]], "DD/MM/YY mm:ss");

    if (
      DataSolicitacao.toDate() instanceof Date &&
      !isNaN(DataSolicitacao.toDate().getTime())
    ) {
      obj.DataSolicitacao = DataSolicitacao.toDate();
    }

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
