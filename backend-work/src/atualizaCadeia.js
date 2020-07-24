const startup = require("./util/startupSGO");
const login = require("./pages/loginSGO");
const monitorCadeia = require("./pages/monitorCadeia");
require("./util/log")();

//-- Models
const server = require("../../backend/server/server");

async function startProcess(callback) {
  const model = server.models.SGO;
  //try {
  let page = await startup.createBrowser();
  //RETIRAR INITIALIZE
  startup.initialize(page, 'http://localhost:8081/static/cadeia.html');

  // FAZER LOGIN - DESCOMENTAR
  // login.initialize(page);
  // await login.doLogin();

  let codigosSGO = await model.obterParaConsulta();  
  //const unique = [...new Set(codigosSGO.map(item => item.Protocolo))];

  for (let index = 0; index < codigosSGO.length; index++) {
    try {
      const codigo = codigosSGO[index];

      await monitorCadeia.initialize(page);
      
      await monitorCadeia.searchSGO(codigo.SGO);
      // await monitorCadeia.navegarTelaCadeia();

      let infoSAP = await monitorCadeia.getInformacoesSAP();
      await atualizaInformacoesSGO(infoSAP);;      

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

async function atualizaInformacoesSGO(array) {
  const SGO = server.models.SGO;
  
  let itemAux = new SGO();
  for (let item of array) 
  {
    itemAux = {
      ...item
    }
    await SGO.createOrUpdate(itemAux);
  }
}

startProcess(function (err) {
  if (err) console.log(err);
  console.log("Terminou de atualizar todos os Status");
  process.exit();
});
