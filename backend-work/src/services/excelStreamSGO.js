const XlsxStreamReader = require("xlsx-stream-reader");
const fs = require("fs");

var workBookReader = {};

var linhas = [];
var props = {};
var funCallback = undefined;

function newStreamReader() {
  workBookReader = new XlsxStreamReader();

  workBookReader.on("worksheet", function(workSheetReader) {
    if (workSheetReader.id > 1) {
      workSheetReader.skip();
      return;
    }

    props = {};
    linhas = [];

    console.log("Inicio do Processamento " + workSheetReader.name);
    exported.setNameWorkbookSheet(workSheetReader.name);

    // workSheetReader.on("row", function(row) {
    //   if (row.attributes.r > 1) {
    //     var obj = {};
    //     row.values.forEach(function(rowVal, colNum) {
    //       obj[props[colNum]] = rowVal;
    //     });
    //     linhas.push(obj);
    //   }
    // });

    workSheetReader.on("row", function(row) {
      if (row.attributes.r == 1) {
        row.values.forEach(function(rowVal, colNum) {
          props[colNum] = rowVal
            .split(" ")
            .join("")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        });
        console.log(props);
      } else {
        var obj = {};
        row.values.forEach(function(rowVal, colNum) {
          obj[props[colNum]] = rowVal;
        });
        linhas.push(obj);
      }
    });

    workSheetReader.on("end", function() {
      console.log("Final do Processamento");
    });

    workSheetReader.process();
  });

  workBookReader.on("end", function() {
    console.log("texto");
    if (funCallback) funCallback(linhas, props);
  });

  workBookReader.on("error", function(error) {
    throw error;
  });
}

let exported = {
  _workSheetName: "",
  createStream: async () => await newStreamReader(),
  load: async function(filePath, callback) {
    funCallback = callback;
    fs.createReadStream(filePath).pipe(workBookReader);
  },
  obter: function() {
    console.log(linhas.length);
  },
  setNameWorkbookSheet: function(name) {
    this._workSheetName = name;
  },
  getNameWorkbookSheet: function() {
    return this._workSheetName;
  }
};

module.exports = exported;
