const lyricsFinder = require("lyrics-finder");
const { MessageEmbed } = require("discord.js");
const { MUTE_CHANNEL } = require("../../json/config.json");

module.exports = {
  commands: ["lyrics", "lyric", "l"],
  expectedArgs: "<nome da música> - <artista>",
  permissionError: "",
  minArgs: 1,
  maxArgs: null,
  callback: async (message, args) => {
    if (message.channel.id === MUTE_CHANNEL) return;
    const lyricFinder = async (title, artist) => {
      const lyrics = await lyricsFinder(title, artist);
      console.log(await lyrics);
      if (!lyrics) {
        return message.channel.send(
          "Não encontrei o lyrics dessa música. Tente usar >l <artista> - <música>"
        );
      }
      let embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("♪ Lyrics ♪")
        .setDescription(lyrics);
      return message.channel.send({ embeds: [embed] });
    };
    let [title, artist] = args.join("").split("-");

    lyricFinder(title, artist);
  },
  permissions: "",
  requiredRoles: [],
};
