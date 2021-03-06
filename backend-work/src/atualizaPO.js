const startup = require("./util/startup");
const login = require("./pages/login");
const monitorFatura = require("./pages/monitorFatura");
require("./util/log")();

//-- Models
const server = require("../../backend/server/server");

async function startProcess(callback) {
  const model = server.models.VwConsultaPO;
  //try {
  let page = await startup.createBrowser();
  startup.initialize();

  login.initialize(page);
  await login.doLogin();

  let protocolos = await model.obterParaConsulta();
  //const unique = [...new Set(protocolos.map(item => item.Protocolo))];

  for (let index = 0; index < protocolos.length; index++) {
    try {
      const protocolo = protocolos[index];
      await monitorFatura.initialize(page);
      await monitorFatura.searchProtocolo(protocolo.Protocolo);

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
  // } catch (err) {
  //   if (callback) callback(err);
  // }
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

async function atualizaInformacoesSAP(array) {
  const PO = server.models.PO;

  for (let item of array) {
    await PO.atualizaInformacaoSAP(item);
  }
}

async function atualizaStatus(array) {
  const PO = server.models.PO;

  for (let item of array) {
    await PO.atualizaStatus(item);
  }
}

startProcess(function(err) {
  if (err) console.log(err);
  console.log("Terminou de atualizar todos os Status");
  process.exit();
});
