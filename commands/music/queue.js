const { MUTE_CHANNEL } = require("../../json/config.json");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { embedQueueCompiler } = require("../../models/discord/embedCompiler.js");

module.exports = {
  commands: ["q", "queue"],
  expectedArgs: "<page>",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: async (message, args, client) => {
    if (message.channel.id === MUTE_CHANNEL) return;
    const player = await client.manager.get(message.guild.id);
    let embedDefault = new MessageEmbed()
      .setTitle("♪ Queue de música ♪")
      .setColor("#0099ff");
    if (!player) {
      return message.channel.send({
        embeds: [embedDefault.setDescription("Nem tem nada tocando man")],
      });
    }
    if (!player.queue.length)
      return message.channel.send({
        embeds: [embedDefault.setDescription("Nem tem música na fila man")],
      });

    let { embed, queueArray, totalDuration } = embedQueueCompiler(player.queue);
    let page = 1;

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
        .setStyle("SECONDARY")
    );
    let embedMsg = await message.channel.send({
      embeds: [embed],
      components: [row],
    });

    const filter = (i) =>
      i.member.voice === message.member.voice && i.message.id === embedMsg.id;

    const buttonCollector = message.channel.createMessageComponentCollector({
      filter,
      idle: 15000,
      time: 30000,
    });

    buttonCollector.on("collect", async (i) => {
      try {
        switch (i.customId) {
          case "firstPage":
            page = 1;
            embed.setDescription(queueArray[0].join("")).setFooter({
              text: `página ${page} de ${queueArray.length}, duração da fila ${totalDuration}`,
            });

            await i.update({ embeds: [embed], components: [row] });
            break;
          case "previousPage":
            if (page !== 1) {
              page--;
              embed.setDescription(queueArray[page - 1].join("")).setFooter({
                text: `página ${page} de ${queueArray.length}, duração da fila ${totalDuration}`,
              });

              await i.update({ embeds: [embed], components: [row] });
            }
            break;
          case "nextPage":
            if (page < queueArray.length) {
              page++;
              embed.setDescription(queueArray[page - 1].join("")).setFooter({
                text: `página ${page} de ${queueArray.length}, duração da fila ${totalDuration}`,
              });

              await i.update({ embeds: [embed], components: [row] });
            }
            break;
          case "lastPage":
            page = queueArray.length;
            embed.setDescription(queueArray[page - 1].join("")).setFooter({
              text: `página ${page} de ${queueArray.length}, duração da fila ${totalDuration}`,
            });

            await i.update({ embeds: [embed], components: [row] });
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
