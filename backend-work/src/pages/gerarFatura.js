const components = require("../util/components");
const server = require("../../../backend/server/server");
const configs = require("../util/configs");

module.exports = {
  page: {},
  initialize: async function(page) {
    this.page = page;
    components.initialize(this.page);
    await this.accessPage();
  },
  obterPedidos: async function() {
    const PO = server.models.PO;
    let filter = {
      where: {
        and: [
          {
            or: [
              {
                Protocolo: ""
              },
              {
                Protocolo: null
              },
              {
                Protocolo: 0
              }
            ]
          }
        ],
        CodigoStatus: 16
      }
    };

    // let filter = {
    //   where: {
    //     CodigoStatus: 16,
    //     Protocolo: 0
    //   }
    // };
    let orders = await PO.find(filter);
    const unique = [...new Set(orders.map(item => item.Pedido))];
    return unique;
  },
  accessPage: async function() {
    await components.clickOn("#navNode_2_5");
  },
  leavePage: async function() {
    await components.clickOn("#navNode_2_0");
  },
  searchOrder: async function(orderNumber, seleciona = true) {
    await components.delay(1000);
    let frame = await components.getFrame();

    await components.waitVisible(
      "#aaaa\\.PedidosPendentesView\\.InputField_Pedido",
      frame
    );
    await components.setTextInputValue(
      "#aaaa\\.PedidosPendentesView\\.InputField_Pedido",
      orderNumber,
      frame,
      200
    );

    await components.clickOn(
      "#aaaa\\.PedidosPendentesView\\.InputField_Pedido",
      frame
    );

    await components.sendEnterOn(
      "#aaaa\\.PedidosPendentesView\\.InputField_Pedido",
      frame
    );

    // await components.clickOn(
    //   "#aaaa\\.PedidosPendentesView\\.ToolBarItems_Pesquisar-r",
    //   frame
    // );
    if (seleciona === true) {
      await components.waitVisible(
        "#aaaa\\.PedidosPendentesView\\.ToolBarButtonChoice_Selecao-r",
        frame
      );
      await components.clickOn(
        "#aaaa\\.PedidosPendentesView\\.ToolBarButtonChoice_Selecao-r",
        frame
      );

      var exist = await components.exists(
        "#aaaa\\.PedidosPendentesView\\.ToolBarButtonChoice_Selecao\\:Choice_Desmarcar",
        frame
      );

      if (exist === true) {
        await components.clickOn(
          "#aaaa\\.PedidosPendentesView\\.ToolBarButtonChoice_Selecao\\:Choice_Desmarcar",
          frame
        );
      }
    }
  },

  generate: async function(pedido, tipo) {
    const PO = server.models.PO;
    const POTipo = server.models.POTipo;
    const UnidadeFederativa = server.models.UnidadeFederativa;

    console.log("Iniciando o processamento do: " + tipo);

    let poTipo = await POTipo.findOne({
      where: { ValorExcel: tipo }
    });

    let frame = await components.getFrame();
    await components.delay(500, frame);
    let gvdItens = await this.obterValorGrid(frame);

    let filter = {
      where: {
        CodigoTipo: poTipo.Codigo,
        CodigoStatus: 16,
        Pedido: pedido,
        and: [
          {
            or: [
              {
                Protocolo: ""
              },
              {
                Protocolo: null
              },
              {
                Protocolo: 0
              }
            ]
          }
        ]
      },
      fields: ["Pedido", "Item", "UF", "Municipio"],
      order: "Item"
    };

    let orders = await PO.find(filter);
    if (orders.length == 0) return;

    let atualizar = [];
    let itemSelecionado = {};

    for (let order of orders) {
      for (let item of gvdItens) {
        if (item.valor == order.Item) {
          let seletor =
            "#aaaa\\.PedidosPendentesView\\.CheckBox_Selected\\." +
            item.index +
            "-img";
          await components.clickOn(seletor, frame);
          atualizar.push({ Pedido: order.Pedido, Item: order.Item });
          itemSelecionado = order;
        }
      }
      if (poTipo.Unico && atualizar.length > 0) break;
    }

    if (atualizar.length == 0) {
      console.log(tipo, `orders`, orders.length, `gvdItens`, gvdItens.length);
      return;
    }

    //Clica no botão avançar
    await components.clickOn(
      "#aaaa\\.PedidosPendentesView\\.ToolBarItems_Avancar-r",
      frame,
      500
    );

    //Clica no botão confirmar
    await components.clickOn(
      "#aaaa\\.AgrupaItensView\\.ToolBarButton_Aprovar_0-r",
      frame
    );

    //Clica no Botão Avançar
    await components.clickOn(
      "#aaaa\\.AgrupaItensView\\.Button_Avancar",
      frame,
      1000
    );

    await components.delay(1000, frame);
    //-- Estado
    let exists = await components.exists(
      "#aaaa\\.PerguntasServicosView\\.DropDownByKey_Estado_0",
      frame
    );

    let unidadeFederativa = await UnidadeFederativa.findOne({
      where: { UF: itemSelecionado.UF }
    });

    if (exists === true) {
      await components.inputTextValue(
        "#aaaa\\.PerguntasServicosView\\.DropDownByKey_Estado_0",
        unidadeFederativa.Nome,
        //'SP',
        frame
      );
    }
    //-- Municipio
    await components.delay(500, frame);
    exists = await components.exists(
      "#aaaa\\.PerguntasServicosView\\.DropDownByKey_Domicilio_0",
      frame
    );

    if (exists === true) {
      await components.clickOn(
        "#aaaa\\.PerguntasServicosView\\.DropDownByKey_Domicilio_0",
        frame,
        1000
      );

      await components.delay(500);
      let frameCidade = await components.getFrameByName("URLSPW-0");

      await components.setTextInputValue(
        "#aaaaKANF\\.EVSHandlerView\\.RootElement\\:2147483640",
        itemSelecionado.Municipio,
        frameCidade
      );

      await components.sendEnterOn(
        "#aaaaKANF\\.EVSHandlerView\\.RootElement\\:2147483640",
        frameCidade
      );

      frameCidade = await components.getFrameByName("URLSPW-0");
      await components.delay(500);
      await this.selecionarCidade(itemSelecionado.Municipio);

      //Aviso Imposto
      await components.delay(500, frame);
      frameCidade = await components.getFrameByName("URLSPW-0");
      exists = await components.exists(
        "#aaaa\\.AvisoView\\.Button_Fechar",
        frameCidade
      );
      if (exists === true) {
        await components.clickOn(
          "#aaaa\\.AvisoView\\.Button_Fechar",
          frameCidade
        );
      }
    }

    // Servico
    await components.delay(500, frame);
    exists = await components.exists(
      "#aaaa\\.PerguntasServicosView\\.DropDownByKey_Protocolo_0_Pergunta_0",
      frame
    );

    if (exists === true) {
      await components.inputTextValue(
        "#aaaa\\.PerguntasServicosView\\.DropDownByKey_Protocolo_0_Pergunta_0",
        "S - Serviço",
        frame,
        1000
      );
    }

    //await this.page.waitFor(500);
    await components.delay(500);
    // Parcial
    exists = await components.exists(
      "#aaaa\\.PerguntasServicosView\\.DropDownByKey_Protocolo_0_Pergunta_1",
      frame
    );

    if (exists === true) {
      await components.delay(500, frame);
      await components.inputTextValue(
        "#aaaa\\.PerguntasServicosView\\.DropDownByKey_Protocolo_0_Pergunta_1",
        "2 - Parcial",
        frame
      );
    }

    // Servico
    exists = await components.exists(
      "#aaaa\\.PerguntasServicosView\\.DropDownByKey_Protocolo_0_Pergunta_0",
      frame
    );

    // Avançar
    await components.delay(500, frame);
    exists = await components.exists(
      "#aaaa\\.PerguntasServicosView\\.Button_Avancar",
      frame
    );

    if (exists === true) {
      await components.clickOn(
        "#aaaa\\.PerguntasServicosView\\.Button_Avancar",
        frame,
        1000
      );
    }
    //INICIO - Termo de Aceite
    //Clica no Botão Termo de Aceite
    await components.delay(500, frame);
    frame = await components.getFrame();
    exists = await components.exists(
      "#aaaa\\.DeducaoImpostosView\\.ToolBarButton_buttonTermoAc_0-r",
      frame
    );

    if (exists === true) {
      await components.clickOn(
        "#aaaa\\.DeducaoImpostosView\\.ToolBarButton_buttonTermoAc_0-r",
        frame,
        1000
      );

      //Clica no Check Termo de Aceite
      await components.delay(500, frame);
      frame = await components.getFrame();
      frameTermoAceite = await components.getFrameByName("URLSPW-0");
      exists = await components.exists(
        "#aaaa\\.TermoDeAceiteView\\.CheckBox-img",
        frameTermoAceite
      );

      if (exists === true) {
        await components.clickOn(
          "#aaaa\\.TermoDeAceiteView\\.CheckBox-img",
          frameTermoAceite,
          1000
        );
      }
      //Clica no Botao Confirmar
      await components.delay(500, frame);

      exists = await components.exists(
        "#aaaa\\.TermoDeAceiteView\\.Button",
        frameTermoAceite
      );

      if (exists === true) {
        await components.clickOn(
          "#aaaa\\.TermoDeAceiteView\\.Button",
          frameTermoAceite,
          1000
        );
      }
    }
    // FIM - Termo de Aceite

    //Clica no Botão Avançar
    await components.delay(500, frame);
    frame = await components.getFrame();
    exists = await components.exists(
      "#aaaa\\.DeducaoImpostosView\\.Button_Avancar",
      frame
    );
    if (exists === true) {
      await components.clickOn(
        "#aaaa\\.DeducaoImpostosView\\.Button_Avancar",
        frame,
        1000
      );
    }

    //Ultimo botão Avançar
    await components.clickOn(
      "#aaaa\\.GravaProtocoloView\\.Button_Avancar",
      frame,
      1000
    );

    //Obter o protocolo
    await components.waitVisible(
      "#aaaa\\.FinalizaPrefaturaView\\.LinkToAction_Protocolo\\.0",
      frame
    );

    let protocolo = await components.getInnerValue(
      "#aaaa\\.FinalizaPrefaturaView\\.LinkToAction_Protocolo\\.0",
      frame
    );
    console.log(protocolo);
    await this.gravarProtocolo(atualizar, protocolo);

    if (poTipo.Unico) {
      await this.accessPage();
      await this.searchOrder(pedido);
      await this.generate(pedido, tipo);
    }
  },
  selecionarCidade: async function(cidade) {
    let frameCidade = await components.getFrameByName("URLSPW-0");

    const gvdItens = await frameCidade.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          'span[id^="aaaaKANF\\.EVSHandlerView\\.description_editor\\."]'
        ),
        element => {
          return {
            selector: element.id,
            valor: element.innerText,
            index: element.id.replace(
              "aaaaKANF.EVSHandlerView.description_editor.",
              ""
            )
          };
        }
      )
    );

    console.log(`Procurando pelo Municipio: ${cidade}`);
    for (let item of gvdItens) {
      console.log(`Achando o Municipio: ${item.valor}`);
      if (cidade.toLowerCase() === item.valor.toLowerCase()) {
        console.log("Cidade encontrada!");

        await components.sendEnterOn(
          `#aaaaKANF\\.EVSHandlerView\\.description_editor\\.${item.index}`,
          frameCidade
        );
      }
    }
  },
  verificaLog: async function(order) {
    const PO = server.models.PO;

    await components.delay(500);
    let frame = await components.getFrame();

    var exists = await components.exists(
      "#aaaa\\.PedidosPendentesView\\.MessageArea-txt",
      frame
    );

    if (exists === true) {
      await components.clickOn(
        "#aaaa\\.PedidosPendentesView\\.ToolBarItems_Log",
        frame
      );

      let frameLog = await components.getFrameByName("URLSPW-0");
      await components.waitVisible(
        'span[id^="aaaa.ExibeLogPedidosPendentesView.Ebeln_editor"]',
        frameLog
      );

      const gvdItens = await frameLog.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            'span[id^="aaaa.ExibeLogPedidosPendentesView.Ebeln_editor"]'
          ),
          element => {
            return {
              selector: element.id,
              valor: element.innerText,
              index: element.id.replace(
                "aaaa.ExibeLogPedidosPendentesView.Ebeln_editor.",
                ""
              )
            };
          }
        )
      );

      let retorno = [];
      for (let element of gvdItens) {
        let pedido = await components.getInnerValue(
          `#aaaa\\.ExibeLogPedidosPendentesView\\.Ebeln_editor\\.${element.index}`,
          frameLog
        );

        let item = await components.getInnerValue(
          `#aaaa\\.ExibeLogPedidosPendentesView\\.Ebelp_editor\\.${element.index}`,
          frameLog
        );

        let mensagem = await components.getInnerValue(
          `#aaaa\\.ExibeLogPedidosPendentesView\\.Msgret_editor\\.${element.index}`,
          frameLog
        );

        let obj = {
          Pedido: pedido,
          Item: item,
          Mensagem: mensagem
        };
        retorno.push(obj);
      }

      for (let item of retorno) {
        await PO.atualizaLog(item);
      }

      //--
      await components.clickOn(
        "#aaaa\\.ExibeLogPedidosPendentesView\\.ToolBarItems_Fechar",
        frameLog
      );
    }
  },
  gravarProtocolo: async function(orders, protocolo) {
    const PO = server.models.PO;

    for (let order of orders) {
      order.Protocolo = protocolo;
      order.Criacao = new Date();
      await PO.atualizaProtocolo(order);
    }
  },
  obterValorGrid: async function(frame) {
    const gvdItens = await frame.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          'span[id^="aaaa\\.PedidosPendentesView\\.Po_Item_editor"]'
        ),
        element => {
          return {
            selector: element.id,
            valor: element.innerText,
            index: element.id.replace(
              "aaaa.PedidosPendentesView.Po_Item_editor.",
              ""
            )
          };
        }
      )
    );

    return gvdItens;
  }
};
