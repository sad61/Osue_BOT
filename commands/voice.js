module.exports = {
  commands: ["voice"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: async (message) => {
    const bot_channel = await message.guild.me.voice.channel;
    if (bot_channel == null)
      return message.channel.send("nao to em nenhuma call");
    message.channel.send(`to no ${bot_channel}`);
  },
  permissions: "",
  requiredRoles: [],
};
