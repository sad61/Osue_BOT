module.exports = {
  commands: ["add", "addition"],
  expectedArgs: "<num1> <num2> ...",
  permissionError: "Você nem tem permissão pra usar isso man",
  minArgs: 2,
  maxArgs: null,
  callback: (message, args) => {
    if (message.channel.id === "753413520606887967") return;
    let sum = 0;
    for (let i = 0; i < args.length; i++) {
      if (!Number.isInteger(+args[i])) {
        return message.reply(
          "mano você passou coisas quem nem é numero inteiro"
        );
      }
    }
    for (let i = 0; i < args.length; i++) {
      sum += +args[i];
    }
    return message.reply(`a soma é ${sum}`);
  },
  permissions: "",
  requiredRoles: [],
};
