module.exports = {
  commands: ["foda"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: async (message) => {
    message.channel.send("😎");
  },
  permissions: "",
  requiredRoles: [],
};
