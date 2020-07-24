module.exports = {
  SITE_URL: "https://portaldenotas.claro.com.br/irj/portal",
  SITE_SGO_URL: "http://10.119.231.253/sgo/pagina/index.php",

  PORTAL_USER: "005382680001",
  PORTAL_PASS: "Ceragon@2020",

  PORTAL_SGO_USER: "93617403",
  PORTAL_SGO_PASS: "Ceragon@12",

  // \\fssp\Sales_Operations\04-Controles\Robo
  // \\fssp\Sales_Operations\04-Controles\Robo\importados\
  FOLDER_INPUT: "C:\\OneDrive\\Robo\\PO\\Pendente",
  FOLDER_OUTPUT: "C:\\OneDrive\\Robo\\PO\\Importado",

  FOLDER_INPUT: "C:\\OneDrive\\Robo\\SGO\\Pendente",
  FOLDER_OUTPUT: "C:\\OneDrive\\Robo\\SGO\\Importado",

  FILE_INPUT: "./src/files/POCONTROL.xlsx",
  FILE_OUTPUT: "./src/files/OUTPUT-{0}.xlsx".replace(
    "{0}",
    new Date().getTime()
  ),

  SCREENSHOT_NAME: "./src/files/evidencias/evidencia-{0}.png".replace(
    "{0}",
    new Date().getTime()
  )
};
