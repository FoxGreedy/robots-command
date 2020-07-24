const startup = require("./util/startup");
const login = require("./pages/login");
const monitorFatura = require("./pages/monitorFatura");
require("./util/log")();

//-- Models
const server = require("../../backend/server/server");

async function startProcess(callback) {
  const model = server.models.VwConsultaPO;

  let page = await startup.createBrowser();
  startup.initialize();

  login.initialize(page);
  await login.doLogin();

  let protocolos = await model.obterParaAtualizar();
  const unique = [...new Set(protocolos.map(item => item.Protocolo))];

  for (let item of unique) {
    try {
      await monitorFatura.initialize(page);
      await monitorFatura.searchProtocolo(item);

      let infoSAP = await monitorFatura.getInformacoesSAP();
      await atualizaInformacoesSAP(infoSAP);

      let statusCapa = infoSAP[infoSAP.length - 1].StatusCapa;
      await monitorFatura.navegarTelaDetalhes();

      let infos = await monitorFatura.getOutrasInformacoes();
      await atualizaOutrasInformacoes(infos, statusCapa);
    } catch (err) {
      console.error(err);
    }
  }

  await startup.terminate();
  if (callback) callback();
}

async function atualizaInformacoesSAP(array) {
  const PO = server.models.PO;

  for (let item of array) {
    await PO.atualizaInformacaoSAP(item);
  }
}

async function atualizaOutrasInformacoes(array, statusCapa) {
  const PO = server.models.PO;
  for (let item of array) {
    for (let prop of Object.keys(item)) {
      if (prop !== "index") {
        if (item[prop].trim() == "") delete item[prop];
      }
    }
    item.StatusCapa = statusCapa;
    await PO.atualizaOutrasInformacoesSAP(item);
  }
}

startProcess(function(err) {
  if (err) console.log(err);
  console.log("Terminou de atualizar todos os Status");
  process.exit();
});
