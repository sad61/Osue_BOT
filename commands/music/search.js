const { MessageActionRow, MessageButton } = require("discord.js");
const { MUTE_CHANNEL } = require("../../json/config.json");
const {
  embedSearchCompiler,
} = require("../../models/discord/embedCompiler.js");
//const play = require("./p.js");

module.exports = {
  commands: ["search"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 1,
  maxArgs: null,
  callback: async (message, args, client) => {
    if (message.channel.id === MUTE_CHANNEL) return;
    let player = client.manager.get(message.guild);
    if (!player) {
      player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
      });
    }
    const voice_channel = message.member?.voice.channel.id;
    const bot_channel = await message.guild.me.voice.channel?.id;
    if (!voice_channel)
      return message.channel.send(
        "Voce precisa estar em uma call pra usar esse comando troxa"
      );
    if (bot_channel && bot_channel !== voice_channel)
      return message.channel.send(
        "Você precisa estar na mesma call que o bot para usar esse comando burro"
      );
    const res = await client.manager.search(args.join(""), message.author);

    if (!res.tracks.length)
      return message.channel.send("não encontrei nada man :|");
    let { embed, searchArray, tracks } = embedSearchCompiler(res.tracks),
      page = 1;

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("firstPage")
        .setLabel("First")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId("previousPage")
        .setLabel("Back")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId("nextPage")
        .setLabel("Next")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId("lastPage")
        .setLabel("Last")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId("done")
        .setLabel("Done ✔️")
        .setStyle("SUCCESS")
    );
    let embedMsg = await message.channel.send({
      embeds: [embed],
      components: [row],
    });

    const filter = (m) =>
      m.member === message.member &&
      m.member.voice.channel === message.member.voice.channel;

    const messageCollector = message.channel.createMessageCollector({
      filter,
      time: 30000,
      idle: 15000,
    });

    messageCollector.on("collect", (m) => {
      m.content = m.content.toLowerCase();
      if (m.content !== "done" && m.content !== "cancel") return;
      messageCollector.stop();
    });

    messageCollector.on("end", async (collected) => {
      embedMsg.delete();
      let options = [];
      collected.forEach(({ content }) => {
        if (content.toLowerCase() === "cancel") options.push(content);
        if (!Number.isInteger(parseInt(content))) return;
        if (content > tracks.length || content < 0) return;
        options.push(content);
      });

      if (options.some((element) => element === "cancel")) return;

      options.forEach(async (element) => {
        player.queue.add(tracks[element - 1]);
        if (player.state !== "CONNECTED") player.connect();
        if (!player.playing && !player.paused && !player.queue.size)
          player.play();
      });
    });

    // Collecting Buttons
    const filterB = (i) =>
      i.member === message.member && i.message.id === embedMsg.id;
    const buttonCollector = message.channel.createMessageComponentCollector({
      filterB,
      idle: 30000,
      time: 20000,
    });

    buttonCollector.on("collect", async (i) => {
      try {
        switch (i.customId) {
          case "firstPage":
            page = 1;
            embed.setDescription(searchArray[0].join("")).setFooter({
              text: `página ${page} de ${searchArray.length}, selecione as tracks e aperte o botão verde 🟩 ou digite "done" para adicionar na fila, ou digite "cancel" para cancelar o search`,
            });

            await i.update({ embeds: [embed], components: [row] });
            break;

          case "previousPage":
            if (page !== 1) {
              page--;
              embed.setDescription(searchArray[page - 1].join("")).setFooter({
                text: `página ${page} de ${searchArray.length}, selecione as tracks e aperte o botão verde 🟩 ou digite "done" para adicionar na fila, ou digite "cancel" para cancelar o search`,
              });

              await i.update({ embeds: [embed], components: [row] });
            }
            break;

          case "nextPage":
            if (page < searchArray.length) {
              page++;
              embed.setDescription(searchArray[page - 1].join("")).setFooter({
                text: `página ${page} de ${searchArray.length}, selecione as tracks e aperte o botão verde 🟩 ou digite "done" para adicionar na fila, ou digite "cancel" para cancelar o search`,
              });

              await i.update({ embeds: [embed], components: [row] });
            }
            break;

          case "lastPage":
            page = searchArray.length;
            embed.setDescription(searchArray[page - 1].join("")).setFooter({
              text: `página ${page} de ${searchArray.length}, selecione as tracks e aperte o botão verde 🟩 ou digite "done" para adicionar na fila, ou digite "cancel" para cancelar o search`,
            });

            await i.update({ embeds: [embed], components: [row] });
            break;

          case "done":
            messageCollector.stop();
            break;
        }
      } catch (err) {
        console.log();
      }
    });
  },
  permissions: "",
  requiredRoles: [],
};
