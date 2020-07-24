const components = require("../util/components");
const Moment = require("moment");

module.exports = {
  page: {},
  initialize: async function(page) {
    this.page = page;
    components.initialize(this.page);
    await this.accessPage();
  },
  accessPage: async function() {
    await components.clickOn("#menusup3");
    await components.clickOn("#menusup3_4");
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
    await components.clickOn("input[id='button']", frame);
  },

  getInformacoesSAP: async function() {
    const elementHandle = await this.page.$("#janela");
    const frame = await elementHandle.contentFrame();

    await components.waitVisible(
      "body > form > fieldset:nth-child(3) > table",
      frame
    );

    const gvdKeys = await frame.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "body > form > fieldset:nth-child(3) > table > tbody > tr > td"
        ),
        element => element.innerText
      )
    );

    const gvdItens = await frame.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "body > form > fieldset:nth-child(3) > div:nth-child(5) > table > tbody > tr:nth-child(2) > td"
        ),
        element => element.innerText
      )
    );

    let mapa = {};
    let auxiliar = {};

    for (let k in gvdKeys) {
      for (let i in gvdItens) {
        if (k === i) {
          if (gvdKeys[k] === "Data") gvdKeys[k] = `${gvdKeys[k]}${k}`;

          mapa[k] = gvdKeys[k];
          auxiliar[gvdKeys[k]] = gvdItens[i];
        }
      }
    }

    // '0': 'SGO',
    // '4': 'Justificativa',
    // '6': 'StatusLPU',
    // '8': 'StatusTecnico',
    // '10': 'StatusImplantacao',
    // '12': 'StatusCarga',
    // '14': 'StatusGerencia',
    // '16': 'StatusDirecao',
    // '18': 'StatusGPC',
    // '20': 'StatusGPC2',
    // '22': 'StatusAlocacao',
    // '7': 'DataLPU',
    // '9': 'DataTecnico',
    // '11': 'DataImplantacao',
    // '13': 'DataCarga',
    // '15': 'DataGerencia',
    // '17': 'DataDirecao',
    // '19': 'DataGPC',
    // '21': 'DataGPC2',
    // '23': 'DataAlocacao',

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
      SGO: auxiliar[mapa[0]],
      Justificativa: auxiliar[mapa[4]],
      StatusLPU: auxiliar[mapa[6]],
      StatusTecnico: auxiliar[mapa[8]],
      StatusImplantacao: auxiliar[mapa[10]],
      StatusCarga: auxiliar[mapa[12]],
      StatusGerencia: auxiliar[mapa[14]],
      StatusDirecao: auxiliar[mapa[16]],
      StatusGPC: auxiliar[mapa[18]],
      StatusGPC2: auxiliar[mapa[20]],
      StatusAlocacao: auxiliar[mapa[22]],
      UltimaAtualizacao: new Date()
    };

    // '7': 'DataLPU',
    // '9': 'DataTecnico',
    // '11': 'DataImplantacao',
    // '13': 'DataCarga',
    // '15': 'DataGerencia',
    // '17': 'DataDirecao',
    // '19': 'DataGPC',
    // '21': 'DataGPC2',
    // '23': 'DataAlocacao',

    let DataLPU = Moment(auxiliar[mapa[7]], "DD/MM/YY mm:ss");
    let DataTecnico = Moment(auxiliar[mapa[9]], "DD/MM/YY mm:ss");
    let DataImplantacao = Moment(auxiliar[mapa[11]], "DD/MM/YY mm:ss");
    let DataCarga = Moment(auxiliar[mapa[13]], "DD/MM/YY mm:ss");
    let DataGerencia = Moment(auxiliar[mapa[15]], "DD/MM/YY mm:ss");
    let DataDirecao = Moment(auxiliar[mapa[17]], "DD/MM/YY mm:ss");
    let DataGPC = Moment(auxiliar[mapa[19]], "DD/MM/YY mm:ss");
    let DataGPC2 = Moment(auxiliar[mapa[21]], "DD/MM/YY mm:ss");
    let DataAlocacao = Moment(auxiliar[mapa[23]], "DD/MM/YY mm:ss");

    if (
      DataLPU.toDate() instanceof Date &&
      !isNaN(DataLPU.toDate().getTime())
    ) {
      obj.DataLPU = DataLPU.toDate();
    }
    if (
      DataTecnico.toDate() instanceof Date &&
      !isNaN(DataTecnico.toDate().getTime())
    ) {
      obj.DataTecnico = DataTecnico.toDate();
    }
    if (
      DataImplantacao.toDate() instanceof Date &&
      !isNaN(DataImplantacao.toDate().getTime())
    ) {
      obj.DataImplantacao = DataImplantacao.toDate();
    }
    if (
      DataCarga.toDate() instanceof Date &&
      !isNaN(DataCarga.toDate().getTime())
    ) {
      obj.DataCarga = DataCarga.toDate();
    }
    if (
      DataGerencia.toDate() instanceof Date &&
      !isNaN(DataGerencia.toDate().getTime())
    ) {
      obj.DataGerencia = DataGerencia.toDate();
    }
    if (
      DataDirecao.toDate() instanceof Date &&
      !isNaN(DataDirecao.toDate().getTime())
    ) {
      obj.DataDirecao = DataDirecao.toDate();
    }
    if (
      DataGPC.toDate() instanceof Date &&
      !isNaN(DataGPC.toDate().getTime())
    ) {
      obj.DataGPC = DataGPC.toDate();
    }
    if (
      DataGPC2.toDate() instanceof Date &&
      !isNaN(DataGPC2.toDate().getTime())
    ) {
      obj.DataGPC2 = DataGPC2.toDate();
    }
    if (
      DataAlocacao.toDate() instanceof Date &&
      !isNaN(DataAlocacao.toDate().getTime())
    ) {
      obj.DataAlocacao = DataAlocacao.toDate();
    }

    console.log(obj);
    retorno.push(obj);

    return retorno;
  }
};
