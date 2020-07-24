require("./util/log")();

const startup = require("./util/startup");
const login = require("./pages/login");
const gerarPedido = require("./pages/gerarFatura");

//-- Models
const server = require("../../backend/server/server");

async function startProcess(callback) {
  let page = await startup.createBrowser();
  startup.initialize();

  login.initialize(page);
  await login.doLogin();

  let orders = await gerarPedido.obterPedidos();

  //let order = orders[0];
  for (const order of orders) {
    try {
      await gerarPedido.initialize(page);
      await gerarPedido.searchOrder(order, false);
      await gerarPedido.verificaLog(order);

      await gerarPedido.initialize(page);
      await gerarPedido.searchOrder(order);
      await gerarPedido.generate(order, "MATERIAL");

      await gerarPedido.initialize(page);
      await gerarPedido.searchOrder(order);
      await gerarPedido.generate(order, "SOFTWARE");

      await gerarPedido.initialize(page);
      await gerarPedido.searchOrder(order);
      await gerarPedido.generate(order, "SE-PRE");

      await gerarPedido.initialize(page);
      await gerarPedido.searchOrder(order);
      await gerarPedido.generate(order, "SE");

      await gerarPedido.initialize(page);
      await gerarPedido.searchOrder(order);
      await gerarPedido.generate(order, "SE-MI");

      await gerarPedido.initialize(page);
      await gerarPedido.searchOrder(order);
      await gerarPedido.generate(order, "SE-DES");

      await gerarPedido.initialize(page);
      await gerarPedido.searchOrder(order);
      await gerarPedido.generate(order, "SPARE");
    } catch (err) {
      console.error(err);
    }
  }

  console.log("Termino da criação das POs");
  await startup.terminate();
  if (callback) callback();
}

startProcess(function(err) {
  if (err) console.log(err);
  process.exit();
});
