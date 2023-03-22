/* eslint-disable no-unused-vars */
const { MUTE_CHANNEL } = require("../../json/config.json");
const { embedCompiler } = require("../../models/discord/embedCompiler.js");
//const queue = new Map(); // Cada server vai ter um map (queue) diferente
//(message, guild.id, queue_constructor { voice channel, text channel, connection, song[]})*/

const regYoutubePlaylist = /[?&]list=([^#&?]+)/;
const regSpotifyPlaylist =
  /^(https:\/\/open.spotify.com\/playlist\/|spotify:user:spotify:playlist:)([a-zA-Z0-9]+)(.*)$/;

module.exports = {
  commands: ["play", "p"],
  expectedArgs: "<url do video>",
  permissionError: "",
  minArgs: 1,
  maxArgs: null,
  callback: async (message, args, client) => {
    if (message.channel.id === MUTE_CHANNEL) return;
    //const serverQueue = await queue.get(message.guild.id);
    const voice_channel = await message.member.voice.channel;
    const bot_channel = await message.guild.me.voice.channel;
    const limit = 300;
    if (!voice_channel)
      return message.channel.send(
        "Voce precisa estar em uma call pra usar esse comando troxa"
      );
    if (bot_channel && bot_channel !== voice_channel)
      return message.channel.send(
        "Você precisa estar na mesma call que o bot para usar esse comando burro"
      );

    try {
      const player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
      });
      const res = await client.manager.search(args.join(""), message.author);
      if (res.tracks.length > limit)
        return message.channel.send(
          `Limite de tracks por playlist(${limit}) excedida man`
        );

      if (player.playing && res.tracks[0])
        message.channel.send({
          embeds: [
            embedCompiler(res.tracks[0]).setTitle("♪ Adicionado à fila ♪"),
          ],
        });

      switch (res.loadType) {
        case "NO_MATCHES":
          return message.channel.send("não encontrei nada man :| ");

        case "PLAYLIST_LOADED":
          player.queue.add(res.tracks);
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === res.tracks.length
          ) {
            player.play();
          }
          break;

        case "TRACK_LOADED":
        case "SEARCH_RESULT":
          player.queue.add(res.tracks[0]);

          if (!player.playing && !player.paused && !player.queue.size)
            player.play();
          break;
      }

      if (player.state !== "CONNECTED") player.connect();
    } catch (e) {
      console.log(e);
    }
  },
  permissions: "",
  requiredRoles: [],
};
