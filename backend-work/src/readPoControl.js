const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");

// const configs = require("./util/configs");

// Nome do file de teste
const substitutoConfigPath = "C:\\procedimento3";

const excelService = require("./services/excelStream");
const server = require("../../backend/server/server");
const Moment = require("moment");
// const column = require("./services/columnConfigs");

const extensions = [".xlsx", ".xls"];

require("./util/log")();

async function extractDataFromFile(filename, callback) {
  excelService.load(filename, function(rows, props) {
    const SGO = server.models.SGO;
    var items = [];

    // console.log(props);
    rows.forEach(element => {
      let obj = new SGO();

      // props = {
      //   "1": "ItemPN",
      //   "2": "PO2018",
      //   "3": "DATADEVALIDACAO",
      //   "4": "STATUSVALIDACAO",
      //   "5": "CARTADECANCELAMENTO",
      //   "6": "SGO"
      // };

      if (!!element[props[6]]) {
        obj.PNSGO = `${element[props[1]]} - ${element[props[6]]}`;
        obj.ItemPN = element[props[1]];
        obj.StatusPO = element[props[4]];
        obj.SGO = element[props[6]];

        if (element[props[3]] !== "") {
          let momento = Moment(element[props[3]], "MM/DD/YY");
          obj.DataPO = momento.toDate();
        }

        items.push(obj);
      }
    });

    processaLista(items, callback);
  });
}

async function loadFile(filename) {
  console.log("Começando a analisar o arquivo: " + filename);
  await extractDataFromFile(filename, function() {
    let name = path.basename(filename);
    let basePath = substitutoConfigPath;

    let newPath = path.join(basePath, "importados", name);

    fs.rename(filename, newPath, err => {
      if (err) console.log(err);
      console.log("Arquivo foi movido para: " + newPath);
    });
  });
}

async function processaLista(array, callback) {
  console.log("Criando as PO's no Banco de Dados");
  const SGO = server.models.SGO;
  for (const item of array) {
    // Criação da model para salvar resultados no banco de dados
    await SGO.createOrUpdate(item);
  }
  console.log("Termino da criaçao das PO's");
  if (callback) callback();
}

async function startProcess() {
  let watcher = chokidar.watch(substitutoConfigPath, {
    ignoreInitial: true,
    persistent: true,
    ignored: ["importados"]
  });

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
