module.exports = {
  commands: ["peça", "piece", "peças"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: async (message) => {
    message.channel.send("https://tenor.com/view/mfc-pirata-gif-18368150");
  },
  permissions: "",
  requiredRoles: [],
};
