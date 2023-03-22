const dicio = require("dicionario.js");

module.exports = {
  commands: ["piada", "piadoca", "anedota"],
  expectedArgs: "",
  permissionError: "",
  minArgs: null,
  maxArgs: null,
  callback: async (message) => {
    const piada = dicio.piada();
    message.channel.send(piada.properties.pergunta);
    message.channel.send("||" + piada.properties.resposta + "||");
  },
  permissions: "",
  requiredRoles: [],
};
