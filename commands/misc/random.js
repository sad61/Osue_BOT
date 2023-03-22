module.exports = {
  commands: ["random", "rd"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: 0,
  callback: async (message) => {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    return message.channel.send(getRandomInt(1, 3));
  },
  permissions: "",
  requiredRoles: [],
};
