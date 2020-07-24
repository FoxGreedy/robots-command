const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");

//const configs = require("./util/configs");
const excelService = require("./services/excelStream");
const server = require("../../backend/server/server");

const extensions = [".xlsx", ".xls"];

require("./util/log")();

async function extractDataFromFile(filename, callback) {
  excelService.load(filename, function(rows, props) {
    const PO = server.models.PO;

    var items = [];
    rows.forEach(element => {
      if (element[props[1]] === "" || element[props[1]] === undefined) {
        return;
      }

      var obj = new PO();
      //-- Cria o objeto que será salvo no banco
      for (let prop in props) {
        if (
          element[props[prop]] !== undefined &&
          element[props[prop]] !== "null"
        ) {
          obj[props[prop]] = element[props[prop]];
        }
      }
      items.push(obj);
    });
    processaLista(items, callback);
  });
}

async function processaLista(array, callback) {
  console.log("Criando as PO's no Banco de Dados");
  const PO = server.models.PO;
  for (const item of array) {
    await PO.atualizarInformacoesHistorico(item);
  }
  console.log("Termino da criaçao das PO's");
  if (callback) callback();
}

async function loadFile(filename) {
  console.log("Começando a analisar o arquivo: " + filename);
  await extractDataFromFile(filename, function() {});
}

async function startProcess() {
  let watcher = chokidar.watch(
    "\\\\fssp\\Sales_Operations\\04-Controles\\_atualizar",
    {
      ignoreInitial: false,
      persistent: true
    }
  );

  watcher.on("error", error => log(`Watcher error: ${error}`));

  watcher.on("add", (filename, stats) => {
    if (!filename) return;
    if (!extensions.includes(path.extname(filename))) return;
    loadFile(filename);
  });

  watcher.on("change", (filename, stats) => {
    if (!stats) return;
    if (!extensions.includes(path.extname(filename))) return;
    loadFile(filename);
  });
}

startProcess();
