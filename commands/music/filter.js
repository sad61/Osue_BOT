const { MessageEmbed } = require("discord.js");
const { PREFIX } = require("../../json/config.json");
const filters = [
  "reset",
  "nightcore",
  "vaporwave",
  "bassBoost",
  "pop",
  "soft",
  "treblebass",
  "eightD",
  "karaoke",
  "vibrato",
  "tremolo",
];

module.exports = {
  commands: ["filter", "filtro"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    const voice_channel = message.member?.voice.channel.id;
    const bot_channel = await message.guild.me.voice.channel?.id;
    if (!voice_channel)
      return message.channel.send(
        "Voce precisa estar em uma call pra usar esse comando troxa"
      );
    if (!bot_channel)
      return message.channel.send("Não estou conectado a uma call");
    if (bot_channel && bot_channel !== voice_channel)
      return message.channel.send(
        "Você precisa estar na mesma call que o bot para usar esse comando burro"
      );

    let embed = new MessageEmbed()
      .setAuthor({ name: "♪ Filtros ♪" })
      .setColor("#0099ff");
    if (!args.length) {
      embed.setDescription(
        " Nightcore, Vaporwave, BassBoost, Pop, Soft, Treblebass, EightD, Karaoke, Vibrato, Tremolo "
      );
      embed.setFooter({ text: `\n Use ${PREFIX}filter reset para resetar` });
      return message.channel.send({ embeds: [embed] });
    }

    let filterArg = filters.filter(
      (element) => element.toLowerCase() === args.join("").toLowerCase()
    );
    filterArg = filterArg.join("");
    if (!filterArg) {
      embed.setAuthor({ text: "Filtro não encontrado!" });
    }
    switch (filterArg) {
      case "reset":
        player.reset();
        embed.setTitle("Filtros Resetados!");
        return message.channel.send({ embeds: [embed] });
      default:
        player[filterArg] ^= true;
        embed.setTitle(
          `Filtro: ${capitalizeFirstLetter(filterArg)} ` +
            (player[filterArg] ? "Ligado" : "Desligado")
        );
        return message.channel.send({ embeds: [embed] });
    }
  },
  permissions: "",
  requiredRoles: [],
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
