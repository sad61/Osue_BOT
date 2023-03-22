const { MUTE_CHANNEL } = require("../../json/config.json");

module.exports = {
  commands: ["clear"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, client) => {
    if (message.channel.id === MUTE_CHANNEL) return;
    const voice_channel = message.member.voice.channel;
    const bot_channel = message.guild.me.voice.channel;
    const player = client.manager.get(message.guild.id);
    if (!bot_channel)
      return message.channel.send("Nem to conectado a uma call");
    if (!player) return message.channel.send("Nem tem nada tocando man");
    if (bot_channel && bot_channel !== voice_channel)
      return message.channel.send(
        "Voce tem que ta na mesma call que o bot pra usar esse comando troxa"
      );
    if (!player.queue) return message.channel.send("Não tem nada pra clearar");
    player.queue.clear();
    message.channel.send("Queue clearada");
  },
  permissions: "",
  requiredRoles: [],
};
