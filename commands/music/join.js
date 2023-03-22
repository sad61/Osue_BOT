const { MUTE_CHANNEL } = require("../../json/config.json");

module.exports = {
  commands: ["join", "entrar"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: (message, args, client) => {
    if (message.channel.id === MUTE_CHANNEL) return;
    let player = client.manager.get(message.guild.id);
    const voice_channel = message.member?.voice.channel.id;
    if (!voice_channel)
      return message.channel.send(
        "Voce precisa estar em uma call pra usar esse comando troxa"
      );
    if (!player) {
      let player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: voice_channel,
        textChannel: message.channel.id,
      });
      player.connect();
      return;
    }
    if (player.playing)
      return message.channel.send("to tocando em outra call man :/");

    if (player && player.voiceChannel !== voice_channel) {
      player.destroy();
      player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: voice_channel,
        textChannel: message.channel.id,
      });
      player.connect();
    }
  },
  permissions: "",
  requiredRoles: [],
};
