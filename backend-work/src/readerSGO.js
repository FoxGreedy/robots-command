const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");

const configs = require("./util/configs");
// const configs = require("./util/configs");

// Nome do file de teste
const saida = configs.FOLDER_SGO_OUTPUT;
const entrada = configs.FOLDER_SGO_INPUT;

const excelService = require("./services/excelStreamSGO");
const leituraWorksheet = require("./worksheetsSGO");
const server = require("../../backend/server/server");

// const column = require("./services/columnConfigs");

const extensions = [".xlsx", ".xls"];

require("./util/log")();

let arrayFileName = [];

async function extractDataFromFile(filename, callback) {
  await excelService.createStream();
  await excelService.load(filename, function(rows, props) {
    // const SGO = server.models.SGO;
    var items = [];

    leituraWorksheet.encaixarLeitura.setProps(props);

    rows.forEach(element => {
      items.push(
        leituraWorksheet.encaixarLeitura[excelService.getNameWorkbookSheet()](
          element
        )
      );
    });

    processaLista(items, callback);
  });
}

async function loadFile(filename) {
  console.log("Começando a analisar o arquivo: " + filename);

  await extractDataFromFile(filename, function() {
    let name = path.basename(filename);
    let basePath = saida;

    let newPath = path.join(basePath, name);

    fs.rename(filename, newPath, err => {
      if (err) console.log(err);
      console.log("Arquivo foi movido para: " + newPath);
    });

    arrayFileName.shift();
    if (arrayFileName.length > 0) {
      loadFile(arrayFileName[0]);
    }
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
  let watcher = chokidar.watch(entrada, {
    ignoreInitial: true,
    persistent: true,
    ignored: ["importados"]
  });

  watcher.on("error", error => log(`Watcher error: ${error}`));

  watcher.on("add", (filename, stats) => {
    if (!filename) return;
    if (!extensions.includes(path.extname(filename))) return;
    const comeco = arrayFileName.length === 0;
    arrayFileName.push(filename);
    if (comeco) loadFile(filename);
  });

  watcher.on("change", (filename, stats) => {
    if (!stats) return;
    if (!extensions.includes(path.extname(filename))) return;
    const comeco = arrayFileName.length === 0;
    arrayFileName.push(filename);
    if (comeco) loadFile(filename);
  });
}

startProcess();
