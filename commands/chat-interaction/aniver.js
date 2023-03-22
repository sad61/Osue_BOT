const jason = require("../..//json/Undergrounds.json");

module.exports = {
  commands: ["aniver"],
  expectedArgs: "<pessoa>",
  permissionError: "",
  minArgs: 1,
  maxArgs: null,
  callback: async (message, args) => {
    const today = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    const member = jason.find((element) => element.userName === args.join(" "));
    if (!member) return;

    function getNumberOfDays(month, day, aniversariante) {
      const aniver = new Date(today.getFullYear(), month, day);
      if (
        today.getMonth() > month ||
        (today.getMonth() == month && today.getDate() > day)
      ) {
        aniver.setFullYear(aniver.getFullYear() + 1);
      }

      var diffInTime = today.getTime() - aniver.getTime();

      var diffInDays = Math.floor(diffInTime / oneDay);
      diffInDays = Math.abs(diffInDays);

      if (diffInDays == 0)
        return message.channel.send(
          "Aniversário do " + aniversariante + " é hoje!!!🥳"
        );
      if (diffInDays > 0)
        return message.channel.send(
          diffInDays > 1
            ? "Faltam " +
                diffInDays +
                " dias pro aniversário do(a) " +
                aniversariante +
                "!!! 🥳"
            : "Falta " +
                diffInDays +
                " dia pro aniversário do(a) " +
                aniversariante +
                "!!! 🥳"
        );
    }
    getNumberOfDays(member.aniverMonth, member.aniverDay, member.userName);
  },
  permissions: "",
  requiredRoles: [],
};
