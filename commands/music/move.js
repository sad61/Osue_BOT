const { MUTE_CHANNEL } = require("../../json/config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  commands: ["move"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 1,
  maxArgs: 2,
  callback: async (message, args, client) => {
    if (message.channel.id === MUTE_CHANNEL) return;
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
      .setTitle(" ♪ Tocando Agora ♪")
      .setColor("#0099ff");
    if (!player.queue) {
      return message.channel.send({
        embeds: [embed.setDescription("Nem tem nada na fila man")],
      });
    }

    const checkIfNotNumber = (element) => {
      return (
        Number.isNaN(parseInt(element)) || !Number.isInteger(parseInt(element))
      );
    };
    const checkIfNotInRange = (element) => {
      return parseInt(element) > player.queue.length || parseInt(element) < 1;
    };

    let fromToArr = args.splice(0, args.length);
    if (fromToArr.some(checkIfNotNumber))
      return message.channel.send("Voce passou algum valor que não é número");
    if (fromToArr.some(checkIfNotInRange))
      return message.channel.send(
        "Voce passou algum valor fora do range da queue"
      );

    if (fromToArr.length === 2) {
      let from = fromToArr[0] - 1,
        to = fromToArr[1] - 1;
      [player.queue[from], player.queue[to]] = [
        player.queue[to],
        player.queue[from],
      ];
      return message.channel.send(
        `**${player.queue[to].title}** movida para a posição **${to + 1}**`
      );
    }
    let from = fromToArr[0] - 1,
      to = 0;
    [player.queue[from], player.queue[to]] = [
      player.queue[to],
      player.queue[from],
    ];
    return message.channel.send(
      `**${player.queue[to].title}** movida para a posição **1**`
    );
  },
  permissions: "",
  requiredRoles: [],
};
