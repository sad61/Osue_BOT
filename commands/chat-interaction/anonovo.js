module.exports = {
  commands: ["anonovo"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: (message) => {
    const today = new Date();
    const anonovo = new Date(today.getFullYear() + 1, 0, 1);
    if (today.getMonth() == 0 && today.getDate() > 1) {
      anonovo.setFullYear(anonovo.getFullYear() + 1);
    }
    var result =
      Math.round(anonovo.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    var remainingDays = Math.ceil(result);

    if (remainingDays == 0) return message.channel.send("Feliz ano novo!!! 🥳");
    else
      return message.channel.send(
        "Faltam " + remainingDays + " dias para o ano novo!!! 🥳"
      );
  },
  permissions: "",
  requiredRoles: [],
};
