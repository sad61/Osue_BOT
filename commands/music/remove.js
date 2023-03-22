const { PREFIX, MUTE_CHANNEL } = require("../../json/config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  commands: ["remove"],
  expectedArgs: `<número> da música ou ${PREFIX}remove <número> <número2>`,
  permissionError: "",
  minArgs: 1,
  maxArgs: 2,
  callback: async (message, args, client) => {
    if (message.channel.id === MUTE_CHANNEL) return;
    const player = client.manager.get(message.guild.id);
    const voice_channel = message.member?.voice?.channel?.id;
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
      .setTitle(" ♪ Tocando Agora ")
      .setColor("#0099ff");
    if (!player.queue.current) {
      return message.channel.send({
        embeds: [embed.setDescription("Nem tem nada tocando man")],
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
      let [from, to] = fromToArr.splice(0, fromToArr.length);
      console.log({ from, to });
      player.queue.remove(from - 1, to);
      return message.channel.send(
        `As músicas de index **${from}** à **${to}** foram removidas da fila`
      );
    }
    let index = parseInt(fromToArr[0]) - 1;
    let removed = player.queue.remove(index);
    return message.channel.send(
      `A track **${removed[0].title}** foi removida da fila`
    );
  },
  permissions: "",
  requiredRoles: [],
};
