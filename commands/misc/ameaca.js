const { MUTE_CHANNEL } = require("../../json/config.json");

module.exports = {
  commands: ["ameaça", "ameaca"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: (message) => {
    if (message.channel.id === MUTE_CHANNEL) return;
    return message.channel.send(
      "Bem Vindo ao meu server se comporte porfavor isso e uma ameaça"
    );
  },
  permissions: "",
  requiredRoles: [],
};
