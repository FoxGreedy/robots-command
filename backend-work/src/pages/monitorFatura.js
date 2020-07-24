const components = require("../util/components");

module.exports = {
  page: {},
  frame: {},
  initialize: async function (page) {
    this.page = page;
    components.initialize(this.page);
    this.frame = await components.getFrame();
    await this.accessPage();
  },
  accessPage: async function () {
    await components.clickOn("#navNode_2_7");
  },
  leavePage: async function () {
    await components.clickOn("#navNode_2_0");
  },
  searchProtocolo: async function (protocolo) {
    let frame = await components.getFrame();
    //let frame = parentFrame == undefined? this.frame : parentFrame;

    await components.delay(1000);
    // await components.waitVisible("#aaaa\\.MonitorPrefaturaView\\.ToolBarItems_Pesquisa_Avancada-r",
    // frame);
    
    await components.clickOn(
      "#aaaa\\.MonitorPrefaturaView\\.ToolBarItems_Pesquisa_Avancada-r",
      frame,
      1000
    );

    await components.setTextInputValue(
      "#aaaa\\.MonitorPrefaturaView\\.InputField_Protocolo",
      protocolo,
      frame
    );

    await components.sendEnterOn(
      "#aaaa\\.MonitorPrefaturaView\\.InputField_Protocolo",
      frame
    );

    //await components.takeScreenshot();
  },

  getInformacoesSAP: async function () {
    let frame = await components.getFrame();

    await components.waitVisible(
      'a[id^="aaaa\\.MonitorPrefaturaView\\.Protocolo_editor\\."]',
      frame
    );

    const gvdItens = await frame.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          'a[id^="aaaa\\.MonitorPrefaturaView\\.Protocolo_editor\\."]'
        ),
        element => {
          return {
            selector: element.id,
            valor: element.innerText,
            index: element.id.replace(
              "aaaa.MonitorPrefaturaView.Protocolo_editor.",
              ""
            )
          };
        }
      )
    );

    let retorno = [];
    for (let element of gvdItens) {
      //Status Capa
      //aaaa.MonitorPrefaturaView.Image_Status.0
      let statusCapa = await components.getAltValue(
        `#aaaa\\.MonitorPrefaturaView\\.Image_Status\\.${element.index}`,
        frame
      );

      //Obter Informação da Cidade
      let localServico = await components.getInnerValue(
        `#aaaa\\.MonitorPrefaturaView\\.Loc_Ser_editor\\.${element.index}`,
        frame
      );
      //Obter Informação da NFe
      let chaveNF = await components.getInnerValue(
        `#aaaa\\.MonitorPrefaturaView\\.Zxml_editor\\.${element.index}`,
        frame
      );
      //Obter Informação do Aprovador
      let nomeAprovador = await components.getInnerValue(
        `#aaaa\\.MonitorPrefaturaView\\.Aprovador_TextView\\.${element.index}`,
        frame
      );
      //Obter Informação da Email do Aprovador
      let emailAprovador = await components.getInnerValue(
        `#aaaa\\.MonitorPrefaturaView\\.Email_Aprovador_TextView\\.${
        element.index
        }`,
        frame
      );

      let obj = {
        Protocolo: element.valor,
        LocalServico: localServico,
        ChaveNF: chaveNF,
        NomeAprovador: nomeAprovador,
        EmailAprovador: emailAprovador,
        StatusCapa: statusCapa
      };
      retorno.push(obj);
    }
    return retorno;
  },

  getOutrasInformacoes: async function () {
    let frame = await components.getFrame();

    const gvdItens = await frame.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          'span[id^="aaaa\\.MonitorDetalheView\\.Protocolo_editor1."]'
        ),
        element => {
          return {
            selector: element.id,
            valor: element.innerText,
            index: element.id.replace(
              "aaaa.MonitorDetalheView.Protocolo_editor1.",
              ""
            )
          };
        }
      )
    );

    let retorno = [];
    for (let element of gvdItens) {
      //O status deve ser obtido aqui 
      //aaaa.MonitorDetalheView.Image1.0
      let status = await components.getAltValue(
        `#aaaa\\.MonitorDetalheView\\.Image1\\.${element.index}`,
        frame
      );

      //aaaa.MonitorDetalheView.Name_editor1.0              - Filial
      let filial = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Name_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Ztpprot_editor1.0           - Tipo Protocolo
      let tipoProtocoloSAP = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Ztpprot_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Cgc_editor1.0               - Cnpj
      let cnpj = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Cgc_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Name1_editor1.0             - Fornecedor
      let fornecedor = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Name1_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Desc_MtvRec_editor1.0       - Motivo Recusa
      let motivoRecusa = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Desc_MtvRec_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Belnr_editor1.0             - Fatura
      let fatura = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Belnr_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Zdtprot1_editor1.0          - Data Recebimento
      let dataRecebimento = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Zdtprot1_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Zdtprot3_editor1.0          - Data Lançamento
      let dataLancamento = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Zdtprot3_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Qtd_Disp_editor1.0          - Quantidade
      let quantidade = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Qtd_Disp_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Po_Unit_editor1.0           - Unidade
      let unidade = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Po_Unit_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Valor_Liq_Uni_editor1.0     - Valor Unitario
      let valorUnitario = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Valor_Liq_Uni_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Valor_Total_Item_editor1.0  - Valor Total
      let valorTotal = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Valor_Total_Item_editor1\\.${
        element.index
        }`,
        frame
      );
      //aaaa.MonitorDetalheView.Currency_editor1.0          - Moeda
      let moeda = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Currency_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Znfnum_editor1.0            - Numero Nota
      let numeroNota = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Znfnum_editor1\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Agenda_Data_editor.0        - Data Agendamento
      let dataAgendamento = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Agenda_Data_editor\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Nf_Origem_view.0            - NFe Origem
      let nfOrigem = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Nf_Origem_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Dt_origem_view.0            - Data NFe Origem
      let dataNfOrigem = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Dt_origem_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Aliquota_IR_view.0          - Aliquota IR
      let aliquotaIR = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Aliquota_IR_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Valor_IR_view.0             - Valor IR
      let valorIR = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Valor_IR_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Aliquota_INSS_view.0        - Aliquota INSS
      let aliquotaINSS = await components.getInnerValue(
        `#aaa\\.MonitorDetalheView\\.Aliquota_INSS_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Base_Calculo_INSS_view.0    - Base Calculo INSS
      let baseCalculoINSS = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Base_Calculo_INSS_view\\.${
        element.index
        }`,
        frame
      );
      //aaaa.MonitorDetalheView.Valor_INSS_view.0           - Valor INSS
      let valorINSS = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Valor_INSS_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Aliquota_ISS_view.0         - Aliquota ISS
      let aliquotaISS = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Aliquota_ISS_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Base_Calculo_ISS_view.0     - Base ISS
      let baseCalculoISS = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Base_Calculo_ISS_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Valor_ISS_view.0            - Valo ISS
      let valorISS = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Valor_ISS_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Aliquota_PCC_view.0         - Aliquota PCC
      let aliquotaPCC = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Aliquota_PCC_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Valor_PCC_view.0            - Valor PCC
      let valorPCC = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Valor_PCC_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Aliquota_ICMS_view.0        - Aliquota ICMS
      let aliquotaICMS = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Aliquota_ICMS_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Valor_ICMS_view.0           - Valor ICMS
      let valorICMS = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Valor_ICMS_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Aliquota_IPI_view.0         - Aliquota IPI
      let aliquotaIPI = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Aliquota_IPI_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Valor_IPI_view.0            - Valor IPI
      let valorIPI = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Valor_IPI_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Valor_ICMS_STI_view.0       - Valor ICMS ST
      let valorICMSST = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Valor_ICMS_STI_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Indice_Inflacao_view.0      - Indice Inflacao
      let indiceInflacao = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Indice_Inflacao_view\\.${element.index}`,
        frame
      );
      //aaaa.MonitorDetalheView.Dt_Inflacao_view.0          - Data Indice Inflacao
      let dataIndiceInflacao = await components.getInnerValue(
        `#aaaa.MonitorDetalheView.Dt_Inflacao_view\\.${element.index}`,
        frame
      );

      let pedido = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Ebeln_editor1\\.${element.index}`,
        frame
      );
      let item = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Ebelp_editor1\\.${element.index}`,
        frame
      );

      let material = await components.getInnerValue(
        `#aaaa\\.MonitorDetalheView\\.Material_Txt_editor1\\.${element.index}`,
        frame
      );

      let obj = {
        Protocolo: element.valor,
        Pedido: pedido,
        Item: item,
        dataIndiceInflacao: dataIndiceInflacao,
        indiceInflacao: indiceInflacao,
        valorICMSST: valorICMSST,
        valorIPI: valorIPI,
        aliquotaIPI: aliquotaIPI,
        valorICMS: valorICMS,
        aliquotaICMS: aliquotaICMS,
        valorPCC: valorPCC,
        aliquotaPCC: aliquotaPCC,
        valorISS: valorISS,
        baseCalculoISS: baseCalculoISS,
        baseCalculoINSS: baseCalculoINSS,
        aliquotaISS: aliquotaISS,
        valorINSS: valorINSS,
        aliquotaINSS: aliquotaINSS,
        valorIR: valorIR,
        aliquotaIR: aliquotaIR,
        dataNfOrigem: dataNfOrigem,
        nfOrigem: nfOrigem,
        dataAgendamento: dataAgendamento,
        numeroNota: numeroNota,
        moeda: moeda,
        valorTotal: valorTotal,
        valorUnitario: valorUnitario,
        unidade: unidade,
        quantidade: quantidade,
        dataLancamento: dataLancamento,
        dataRecebimento: dataRecebimento,
        fatura: fatura,
        motivoRecusa: motivoRecusa,
        fornecedor: fornecedor,
        cnpj: cnpj,
        tipoProtocoloSAP: tipoProtocoloSAP,
        filial: filial,
        material: material,
        index: element.index,
        Status: status
      };
      retorno.push(obj);
    }


    //-- Verifica se existe outros itens ocultos
    let exists = await components.exists(
      "#aaaa\\.MonitorDetalheView\\.Table_Detalhes-scrollV-Nxt",
      frame
    );

    if (exists === true) {
      let lastItem = false;

      while (lastItem === false) {
        let lastIndex = retorno[retorno.length - 1].index;
        lastIndex++;
        let lastProtocolo = retorno[retorno.length - 1].Protocolo;
        //let ultimoItem = retorno[retorno.length - 1].Item;

        await components.clickOn(
          "#aaaa\\.MonitorDetalheView\\.Table_Detalhes-scrollV-Nxt",
          frame,
          200
        );

        await components.delay(700);
        let existeNovoItem = await components.exists(`#aaaa\\.MonitorDetalheView\\.Ebelp_editor1\\.${lastIndex}`,
          frame);

        lastItem = !existeNovoItem;

        if (existeNovoItem == true) {
          let item = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Ebelp_editor1\\.${lastIndex}`,
            frame
          );

          //aaaa.MonitorDetalheView.Image1.0
          let status = await components.getAltValue(
            `#aaaa\\.MonitorDetalheView\\.Image1\\.${lastIndex}`,
            frame
          );

          // console.log("Ultimo item: " +  item)        
          // if(item === "" || parseInt(item) === parseInt(ultimoItem)){
          //   console.log("achou o ultimo item");
          //   //lastItem = true;
          // }


          let filial = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Name_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Ztpprot_editor1.0           - Tipo Protocolo
          let tipoProtocoloSAP = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Ztpprot_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Cgc_editor1.0               - Cnpj
          let cnpj = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Cgc_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Name1_editor1.0             - Fornecedor
          let fornecedor = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Name1_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Desc_MtvRec_editor1.0       - Motivo Recusa
          let motivoRecusa = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Desc_MtvRec_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Belnr_editor1.0             - Fatura
          let fatura = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Belnr_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Zdtprot1_editor1.0          - Data Recebimento
          let dataRecebimento = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Zdtprot1_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Zdtprot3_editor1.0          - Data Lançamento
          let dataLancamento = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Zdtprot3_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Qtd_Disp_editor1.0          - Quantidade
          let quantidade = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Qtd_Disp_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Po_Unit_editor1.0           - Unidade
          let unidade = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Po_Unit_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Valor_Liq_Uni_editor1.0     - Valor Unitario
          let valorUnitario = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Valor_Liq_Uni_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Valor_Total_Item_editor1.0  - Valor Total
          let valorTotal = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Valor_Total_Item_editor1\\.${
            lastIndex
            }`,
            frame
          );
          //aaaa.MonitorDetalheView.Currency_editor1.0          - Moeda
          let moeda = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Currency_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Znfnum_editor1.0            - Numero Nota
          let numeroNota = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Znfnum_editor1\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Agenda_Data_editor.0        - Data Agendamento
          let dataAgendamento = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Agenda_Data_editor\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Nf_Origem_view.0            - NFe Origem
          let nfOrigem = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Nf_Origem_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Dt_origem_view.0            - Data NFe Origem
          let dataNfOrigem = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Dt_origem_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Aliquota_IR_view.0          - Aliquota IR
          let aliquotaIR = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Aliquota_IR_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Valor_IR_view.0             - Valor IR
          let valorIR = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Valor_IR_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Aliquota_INSS_view.0        - Aliquota INSS
          let aliquotaINSS = await components.getInnerValue(
            `#aaa\\.MonitorDetalheView\\.Aliquota_INSS_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Base_Calculo_INSS_view.0    - Base Calculo INSS
          let baseCalculoINSS = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Base_Calculo_INSS_view\\.${
            lastIndex
            }`,
            frame
          );
          //aaaa.MonitorDetalheView.Valor_INSS_view.0           - Valor INSS
          let valorINSS = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Valor_INSS_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Aliquota_ISS_view.0         - Aliquota ISS
          let aliquotaISS = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Aliquota_ISS_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Base_Calculo_ISS_view.0     - Base ISS
          let baseCalculoISS = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Base_Calculo_ISS_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Valor_ISS_view.0            - Valo ISS
          let valorISS = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Valor_ISS_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Aliquota_PCC_view.0         - Aliquota PCC
          let aliquotaPCC = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Aliquota_PCC_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Valor_PCC_view.0            - Valor PCC
          let valorPCC = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Valor_PCC_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Aliquota_ICMS_view.0        - Aliquota ICMS
          let aliquotaICMS = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Aliquota_ICMS_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Valor_ICMS_view.0           - Valor ICMS
          let valorICMS = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Valor_ICMS_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Aliquota_IPI_view.0         - Aliquota IPI
          let aliquotaIPI = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Aliquota_IPI_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Valor_IPI_view.0            - Valor IPI
          let valorIPI = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Valor_IPI_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Valor_ICMS_STI_view.0       - Valor ICMS ST
          let valorICMSST = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Valor_ICMS_STI_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Indice_Inflacao_view.0      - Indice Inflacao
          let indiceInflacao = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Indice_Inflacao_view\\.${lastIndex}`,
            frame
          );
          //aaaa.MonitorDetalheView.Dt_Inflacao_view.0          - Data Indice Inflacao
          let dataIndiceInflacao = await components.getInnerValue(
            `#aaaa.MonitorDetalheView.Dt_Inflacao_view\\.${lastIndex}`,
            frame
          );

          let pedido = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Ebeln_editor1\\.${lastIndex}`,
            frame
          );

          let material = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Material_Txt_editor1\\.${lastIndex}`,
            frame
          );

          item = await components.getInnerValue(
            `#aaaa\\.MonitorDetalheView\\.Ebelp_editor1\\.${lastIndex}`,
            frame
          );

          let obj = {
            Protocolo: lastProtocolo,
            Pedido: pedido,
            Item: item,
            dataIndiceInflacao: dataIndiceInflacao,
            indiceInflacao: indiceInflacao,
            valorICMSST: valorICMSST,
            valorIPI: valorIPI,
            aliquotaIPI: aliquotaIPI,
            valorICMS: valorICMS,
            aliquotaICMS: aliquotaICMS,
            valorPCC: valorPCC,
            aliquotaPCC: aliquotaPCC,
            valorISS: valorISS,
            baseCalculoISS: baseCalculoISS,
            baseCalculoINSS: baseCalculoINSS,
            aliquotaISS: aliquotaISS,
            valorINSS: valorINSS,
            aliquotaINSS: aliquotaINSS,
            valorIR: valorIR,
            aliquotaIR: aliquotaIR,
            dataNfOrigem: dataNfOrigem,
            nfOrigem: nfOrigem,
            dataAgendamento: dataAgendamento,
            numeroNota: numeroNota,
            moeda: moeda,
            valorTotal: valorTotal,
            valorUnitario: valorUnitario,
            unidade: unidade,
            quantidade: quantidade,
            dataLancamento: dataLancamento,
            dataRecebimento: dataRecebimento,
            fatura: fatura,
            motivoRecusa: motivoRecusa,
            fornecedor: fornecedor,
            cnpj: cnpj,
            tipoProtocoloSAP: tipoProtocoloSAP,
            filial: filial,
            material: material,
            index: lastIndex,
            Status: status
          };
          retorno.push(obj);
        }
      }
    }

    return retorno;
  },
  navegarTelaDetalhes: async function () {
    let frame = await components.getFrame();

    await components.clickOn(
      "#aaaa\\.MonitorPrefaturaView\\.ToolBarItems_Selecao-r",
      frame,
      1000
    );

    await components.clickOn(
      "#aaaa\\.MonitorPrefaturaView\\.ToolBarItems_Detail-r",
      frame,
      1000
    );

    await components.waitVisible(
      'span[id^="aaaa\\.MonitorDetalheView\\.Protocolo_editor1."]',
      frame
    );
  },
  // getResults: async function () {
  //   let frame = await components.getFrame();

  //   await components.clickOn(
  //     "#aaaa\\.MonitorPrefaturaView\\.ToolBarItems_Selecao-r",
  //     frame,
  //     1000
  //   );

  //   await components.clickOn(
  //     "#aaaa\\.MonitorPrefaturaView\\.ToolBarItems_Detail-r",
  //     frame,
  //     1000
  //   );

  //   await components.waitVisible(
  //     'span[id^="aaaa\\.MonitorDetalheView\\.Protocolo_editor1."]',
  //     frame
  //   );

  //   const gvdItens = await frame.evaluate(() =>
  //     Array.from(
  //       document.querySelectorAll(
  //         'span[id^="aaaa\\.MonitorDetalheView\\.Protocolo_editor1."]'
  //       ),
  //       element => {
  //         return {
  //           selector: element.id,
  //           valor: element.innerText,
  //           index: element.id.replace(
  //             "aaaa.MonitorDetalheView.Protocolo_editor1.",
  //             ""
  //           )
  //         };
  //       }
  //     )
  //   );

  //   let retorno = [];
  //   for (let index = 0; index < gvdItens.length; index++) {
  //     const element = gvdItens[index];
  //     //aaaa.MonitorDetalheView.Image1. - Status
  //     //aaaa.MonitorDetalheView.Ebelp_editor1. - Item
  //     let status = await components.getAltValue(
  //       `#aaaa\\.MonitorDetalheView\\.Image1\\.${element.index}`,
  //       frame
  //     );
  //     let pedido = await components.getInnerValue(
  //       `#aaaa\\.MonitorDetalheView\\.Ebeln_editor1\\.${element.index}`,
  //       frame
  //     );
  //     let item = await components.getInnerValue(
  //       `#aaaa\\.MonitorDetalheView\\.Ebelp_editor1\\.${element.index}`,
  //       frame
  //     );

  //     let obj = {
  //       Protocolo: element.valor,
  //       Pedido: pedido,
  //       Item: item,
  //       Status: status
  //     };
  //     retorno.push(obj);
  //   }
  //   return retorno;
  // }
};
