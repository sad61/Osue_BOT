module.exports = {
  commands: ["disconnect", "dc"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: 0,
  callback: async (message) => {
    //if (message.channel.id === MUTE_CHANNEL) return;
    const bot_channel = await message.guild.me.voice.channel;
    const voice_channel = await message.member.voice.channel;
    const player = await message.client?.manager.get(message.guild.id);

    if (!bot_channel) return message.channel.send("nem to em call 🙄");

    if (bot_channel.id !== voice_channel.id) {
      return message.channel.send("voce nem ta na mesma call que eu 🙄");
    }

    if (player) {
      player.destroy();
    }

    bot_channel.leave;
  },
  permissions: "",
  requiredRoles: [],
};
