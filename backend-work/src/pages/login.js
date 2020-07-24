const components = require("../util/components");
const constants = require("../util/configs");

module.exports = {
  page: {},
  initialize: function(page) {
    this.page = page;
    components.initialize(this.page);
  },
  doLogin: async function() {
    await components.wait("#logonuidfield");
    //-- Usuario e Senha
    await components.waitVisible(
      "#logonuidfield"      
    );
    await components.inputTextValue("#logonuidfield", constants.PORTAL_USER);

    await components.waitVisible(
      "#logonpassfield"      
    );
    await components.inputTextValue(
      "#logonpassfield",
      constants.PORTAL_PASS
    );
    //-- Captcha
    await components.wait("#mainCaptcha");
    await components.waitVisible(
      "#mainCaptcha"      
    );
    const valorCaptcha = await this.page.evaluate(
      () => document.querySelector("#mainCaptcha").value
    );
    await components.inputTextValue(
      "#resposta",
      valorCaptcha.split(" ").join("")
    );
    await components.takeScreenshot();
    await components.clickOn("#Button1");
  },

  doLogout: async function() {
    await components.clickOn(
      "img[src$='/br.com.claro.Recursos/images/fechar.gif']"
    );
  }
};
