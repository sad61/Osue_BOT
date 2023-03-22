module.exports = {
  commands: ["festa"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: (message) => {
    return message.channel.send("🥳");
  },
  permissions: "",
  requiredRoles: [],
};
