const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { MUTE_CHANNEL } = require("../../json/config.json");
const { embedQueueCompiler } = require("../../models/discord/embedCompiler.js");

module.exports = {
  commands: ["find", "f"],
  expectedArgs: "<titulo do video a ser procurado>",
  permissionError: "",
  minArgs: 1,
  maxArgs: null,
  callback: async (message, args, client) => {
    if (message.channel.id === MUTE_CHANNEL) return;
    const bot_channel = message.guild.me.voice.channel;
    const player = await client.manager.get(message.guild.id);
    let embed = new MessageEmbed()
      .setTitle(" ♪ Músicas Encontradas ♪")
      .setColor("#0099ff");
    if (!bot_channel)
      return message.channel.send("nem to em call pra ter música brother");
    if (!player.queue) {
      return message.channel.send({
        embeds: [embed.setDescription("Nem tem nada na fila man")],
      });
    }
    args = args.join(" ");
    let tracksFound = [];
    let content = [];
    let { queueObj } = embedQueueCompiler(player.queue),
      page = 1;

    queueObj.forEach(({ index, length, title, uri, requester }) => {
      if (title.toLowerCase().includes(args.toLowerCase())) {
        tracksFound.push({
          index: index,
          length: length,
          title: title,
          uri: uri,
          requester: requester,
        });
      }
    });

    if (!tracksFound.length)
      return message.channel.send({
        embeds: [
          embed.setDescription("nenhuma musica com esse titulo encontrada :/"),
        ],
      });

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

    tracksFound.forEach(({ index, length, title, uri, requester }) => {
      content.push(
        `${
          index - 1
        }. [${length}] [${title}](${uri}) requested by: ${requester}` + "\n\n"
      );
    });
    content = separate(content, 10);
    let embedMsg = await message.channel.send({
      embeds: [
        embed
          .setDescription(`${content[0].join(" ")}`)
          .setFooter({ text: `página ${page} de ${content.length}` }),
      ],
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
            embed.setDescription(content[0].join(" ")).setFooter({
              text: `página ${page} de ${content.length}`,
            });

            await i.update({ embeds: [embed], components: [row] });
            break;
          case "previousPage":
            if (page !== 1) {
              page--;
              embed.setDescription(content[page - 1].join(" ")).setFooter({
                text: `página ${page} de ${content.length}`,
              });

              await i.update({ embeds: [embed], components: [row] });
            }
            break;
          case "nextPage":
            if (page < content.length) {
              page++;
              embed.setDescription(content[page - 1].join(" ")).setFooter({
                text: `página ${page} de ${content.length}`,
              });

              await i.update({ embeds: [embed], components: [row] });
            }
            break;
          case "lastPage":
            page = content.length;
            embed.setDescription(content[page - 1].join(" ")).setFooter({
              text: `página ${page} de ${content.length}`,
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

function separate(arr, size) {
  if (size <= 0) throw "Invalid chunk size";
  var R = [];
  for (var i = 0, len = arr.length; i < len; i += size)
    R.push(arr.slice(i, i + size));
  return R;
}
