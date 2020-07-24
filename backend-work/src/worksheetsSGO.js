const server = require("../../backend/server/server");
const Moment = require("moment");
const SGO = server.models.SGO;
const columnConfig = require("./services/columnsConfigsSGO");

module.exports = {
  encaixarLeitura: {
    _props: {},
    setProps: props => (this._props = props),
    po: element => {
      const { po } = columnConfig;
      let obj = new SGO();

      if (!!element[this._props[6]]) {
        obj.PNSGO = `${element[this._props[po.ItemPN]]} - ${
          element[this._props[po.SGO]]
        }`;
        obj.ItemPN = element[this._props[po.ItemPN]];
        obj.StatusPO = element[this._props[po.StatusPO]];
        obj.SGO = element[this._props[po.SGO]];

        if (element[this._props[po.DataPO]] !== "") {
          let momento = Moment(element[this._props[po.DataPO]], "MM/DD/YY");
          obj.DataPO = momento.toDate();
        }

        return obj;
      }
    },
    resumo: element => {
      let obj = new SGO();
      const { resumo } = columnConfig;

      if (!!element[this._props[resumo.SGO]]) {
        obj.Item = element[this._props[resumo.Item]];
        obj.SGO = element[this._props[resumo.SGO]];
        obj.Regional = element[this._props[resumo.Regional]];
        obj.Tipo = element[this._props[resumo.TipoPV]];

        if (element[this._props[1]] !== "") {
          let momento = Moment(
            element[this._props[resumo.DataPv]],
            "DD/MM/YYYY"
          );
          obj.DataPV = momento.toDate();
        }
      }

      return obj;
    },
    alinhamento: element => {
      const { alinhamento } = columnConfig;
      let obj = new SGO();

      if (!!element[this._props[alinhamento.SGO]]) {
        obj.SGO = element[this._props[alinhamento.SGO]];
        obj.StatusAlinhamento =
          element[this._props[alinhamento.StatusAlinhamento]];

        if (element[this._props[3]] !== "") {
          let momento = Moment(
            element[this._props[alinhamento.DataAlinhamento]],
            "DD/MM/YYYY"
          );
          obj.DataAlinhamento = momento.toDate();
        }

        return obj;
      }
    }
  }
};
