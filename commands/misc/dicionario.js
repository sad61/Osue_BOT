const dicio = require("dicionario.js");
const Discord = require("discord.js");

module.exports = {
  commands: ["dic", "dicionario", "dicio"],
  expectedArgs: "<palavra>",
  permissionError: "",
  minArgs: 1,
  maxArgs: null,
  callback: async (message, args, text) => {
    if (message.channel.id === "753413520606887967") return;
    getWord(text.split(" ").join("_"))
      .then((resp) => {
        let word = resp;
        let embed = new Discord.MessageEmbed()
          .setTitle(capitalizeFirstLetter(args.join(" ")))
          .setDescription(capitalizeFirstLetter("*" + word.class + "*"))
          .setColor("#0099ff");

        for (var i = 0; i < word.meanings.length; i++) {
          embed.addField("\u200B", "" + word.meanings[i] + "", false);
        }

        if (word.etymology) {
          embed.setFooter("\u200B\n" + word.etymology + "");
        }
        message.channel.send(embed);
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        return message.channel.send("Erro ao encontrar a palavra");
      });
  },
  permissions: "",
  requiredRoles: [],
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function getWord(string) {
  const palavra = await dicio.significado(string);
  return palavra;
}
