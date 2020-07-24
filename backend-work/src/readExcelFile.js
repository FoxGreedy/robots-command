const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");

const configs = require("./util/configs");
const excelService = require("./services/excelStream");
const column = require("./services/columnConfigs");
const server = require("../../backend/server/server");

const extensions = [".xlsx", ".xls"];

require("./util/log")();

async function extractDataFromFile(filename, callback) {
  excelService.load(filename, function(rows, props) {
    const PO = server.models.PO;

    var items = [];
    rows.forEach(element => {
      if (
        element[props[column.Pedido]] === "" ||
        element[props[column.Pedido]] === undefined
      ) {
        return;
      }

      var obj = new PO();
      //-- Cria o objeto que será salvo no banco
      obj.Pedido = element[props[column.Pedido]];
      obj.Item = element[props[column.Item]];
      obj.ItemPN = element[props[column.ItemPN]];
      obj.CodigoSAPClaro = element[props[column.CodigoSap]];

      obj.Descricao = element[props[column.Descricao]];
      obj.TextoEngenharia = element[props[column.TextoEngenharia]];
      obj.UF = element[props[column.UF]];
      obj.Municipio = element[props[column.Municipio]];
      obj.NCM = element[props[column.NCM]];
      obj.Regional = element[props[column.Regional]];

      let dtCriacao = new Date();
      if (element[props[column.DataProtocolo]] !== "") {
        dtCriacao = new Date(
          (element[props[column.DataProtocolo]] - (25567 + 1)) * 86400 * 1000
        );
        dtCriacao.setDate(dtCriacao.getDate() - 1);
      }

      if (isNaN(dtCriacao.getDate()) === true) {
        dtCriacao = new Date();
      }

      obj.Criacao = dtCriacao;
      obj.UltimaAtualizacao = new Date();

      obj.QuantidadeFaturamento = element[props[column.QuantidadeFaturamento]];
      obj.CodigoStatus = 14;
      obj.ItemDescricao = element[props[column.ItemDescricao]];
      obj.Tipo = element[props[column.Tipo]];

      obj.Protocolo = element[props[column.Protocolo]];
      obj.Status = element[props[column.Status]];

      items.push(obj);
    });
    processaLista(items, callback);
  });
}

async function loadFile(filename) {
  console.log("Começando a analisar o arquivo: " + filename);
  await extractDataFromFile(filename, function() {
    let name = path.basename(filename);
    //let basePath = configs.FOLDER_INPUT;
    let basePathOut = configs.FOLDER_OUTPUT;

    let newPath = path.join(basePathOut, name);

    fs.rename(filename, newPath, err => {
      if (err) console.log(err);
      console.log("Arquivo foi movido para: " + newPath);
    });
  });
}

async function processaLista(array, callback) {
  console.log("Criando as PO's no Banco de Dados");
  const PO = server.models.PO;
  for (const item of array) {
    // console.log(item);
    await PO.criar(item);
  }
  console.log("Termino da criaçao das PO's");
  if (callback) callback();
}

async function startProcess() {
  let watcher = chokidar.watch(configs.FOLDER_INPUT, {
    ignoreInitial: false,
    persistent: true,
    ignored: "importados"
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
