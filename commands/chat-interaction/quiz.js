/* eslint-disable no-unused-vars */
const quizJason = require("../../json/quizQuery.json");
const quizMap = new Map();
const embedMap = new Map();
const playersMap = new Map();
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  commands: ["quiz"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: async (message, args, client) => {
    const voice_channel = await message.member.voice.channel;
    const bot_channel = await message.guild.me.voice.channel;
    if (!voice_channel)
      return message.channel.send(
        "Voce precisa estar em uma call pra usar esse comando troxa"
      );
    if (bot_channel && bot_channel !== voice_channel)
      return message.channel.send(
        "Você precisa estar na mesma call que o bot para usar esse comando burro"
      );
    let player = client.manager.get(message.guild);
    if (!player) {
      player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
      });
    }

    let queue = [];
    var quiz = true;
    const roundsMax = 15;
    let rounds = 0;
    for (const musicArr of quizJason.items) queue = queue.concat(musicArr);

    playersMap.set(message.guild.id, voice_channel.members);

    let playersObj = [];
    playersMap.get(message.guild.id).forEach((element) => {
      console.log(element);
      let player = {
        name: element.displayName,
        id: element.id,
      };
      playersObj.push(player);
    });
    console.log({ playersObj });

    async function quizFunction() {
      if (rounds >= roundsMax) quiz = false;
      if (quiz) {
        let randomNumber = Math.floor(Math.random() * queue.length - 1);
        quizMap.set(message.guild.id, queue[randomNumber]);
        //const video = await videoFinder(quizMap.get(message.guild.id))
        try {
          let embed = new Discord.MessageEmbed()
            .setTitle("♪ Quiz Música ♪")
            .setColor("#0099ff")
            .setThumbnail(quizMap.get(message.guild.id).bestThumbnail.url)
            .setDescription(
              `[${quizMap.get(message.guild.id).title}](${
                quizMap.get(message.guild.id).shortUrl
              })`
            );
          embedMap.set(message.guild.id, embed);
          const connection = joinVoiceChannel({
            channelId: message.channel.id,
            guildId: message.channel.guild.id,
            adapterCreator: message.channel.guild.voiceAdapterCreator,
          });
          videoPlay(
            message.guild,
            quizMap.get(message.guild.id),
            connection,
            message,
            voice_channel,
            embed
          );
        } catch (err) {
          //message.channel.send('Houve um erro ao tentar se conectar à call');
          console.log(err);
        }
      }

      rounds++;
    }
    quizFunction();

    function checkGuesses(song, songAuthor, songName) {
      const filter = (m) =>
        m.member === message.member &&
        m.member.voice.channel === message.member.voice.channel;

      const messageCollector = message.channel.createMessageCollector({
        filter,
        time: 15000,
      });

      messageCollector.on("collect", async (m) => {
        m.content = m.content.toLowerCase();
        console.log(m.content);
        try {
          if (
            !m.content.includes(songName) &&
            !m.content.includes(songAuthor)
          ) {
            m.react("❌");
            return;
          }
          if (m.content.includes(songName)) {
            m.react("👍");
            songName = false;
          } else if (m.content.includes(songAuthor)) {
            m.react("👍");
            songAuthor = false;
          }

          if (songName === false && songAuthor === false) {
            quizFunction();
          }
        } catch (err) {
          console.log(err);
        }
      });
    }

    // Fazer rodar música aleatória
    const videoPlay = async (
      guild,
      song,
      connection,
      message,
      voice_channel,
      embed
    ) => {
      /*const res = await client.manager.search(song, message.author);
      player.queue.add(res.tracks[0]);

      if (!player.playing && !player.paused && !player.queue.size)
        player.play();

      if (player.state !== "CONNECTED") player.connect();*/
      var [songAuthor, songName] = song.title.split("-");
      console.log(`songAuthor: ${songAuthor}, songName: ${songName}`);

      const options = {
        filter: "audioonly",
        highWaterMark: 1048576 / 4,
        requestOptions: {
          headers: {
            cookie:
              "VISITOR_INFO1_LIVE=VLtTHNf2Dw8; CONSENT=YES+BR.pt-BR+20170806-09-0; _ga=GA1.2.330248734.1612800527; HSID=A9IOQJnsTRtKCQRJX; SSID=A_p0-CRSNTw6UL5RM; APISID=-zaxR6ht0xP7Y8jW/Aj-slbT0fKBG3oWs1; SAPISID=rh-8a_8Ps-NnBJ11/A-RKd5FkhsZRmHwNt; __Secure-1PAPISID=rh-8a_8Ps-NnBJ11/A-RKd5FkhsZRmHwNt; __Secure-3PAPISID=rh-8a_8Ps-NnBJ11/A-RKd5FkhsZRmHwNt; PREF=f6=40000400&hl=en&tz=America.Sao_Paulo&al=pt&f5=30000&f4=4000000&volume=100; SID=Gwg0M8fY9nq3mAIsk_eRBPMumwTdo3g6l3DfXyue6K4LCSejaiZsfucGI-vfKC4lG19zEg.; __Secure-1PSID=Gwg0M8fY9nq3mAIsk_eRBPMumwTdo3g6l3DfXyue6K4LCSejlAkUQYYGsULnXruoD4I7Kw.; __Secure-3PSID=Gwg0M8fY9nq3mAIsk_eRBPMumwTdo3g6l3DfXyue6K4LCSej1pOwKUdBxfVAWp-wDCNFLA.; wide=0; PREF=ID=1efd952b381dfeca:TM=1646612521:LM=1646612521:V=1:S=G4b-nMx70pO3fMSz; YSC=T_mRpd6tdHw; LOGIN_INFO=AFmmF2swRQIhAOfuQV0YuV0ckjRNsR5EqTyysYar85p7ADyxASngdiVBAiAw0q_Z56gUQkDZS0SWXaLKtp3I9twjQSODnEjlzeusDw:QUQ3MjNmd0h1MW9nZk1nVFJxR1FaS2RZVlM5c3FraGZJRGhsR3RJOFZ4aWtBcmVKcUI5N2kyVExHMjRkNVFvcXdJTk5GaEpjRmpDUWlBdlVmM2ota0w4VGZHenhwQ3ZMTzBnM3dncnB0b3E4VG5jNUp6TEZ4XzFQeDRKdU00dWlnNDdfejRmTkdfd3NxQzNxdUNTZjFHeFZqX0RtTVgwNFdR; SIDCC=AJi4QfHlLVRf9ATewmZL-6PQW6Kgj0nORIX3ctGJ9EPkstXfZptkGPt3Cy8MVXY2jq4aNMx-_D8A; __Secure-3PSIDCC=AJi4QfGSdKQvJySEde-t2uJNpK1dFGvRp0fLOo2SJ_e1RvXhbgIQYXc8qOfRl_AnNNeUayo-IWQ",
          },
        },
      };
      const stream = ytdl(song.shortUrl, options);
      const dispatcher = await connection
        .play(stream, { seek: 0, volume: 0.5, filter: "audioonly" })
        .on("speaking", () => {
          checkGuesses(song, songAuthor, songName);
        })
        .on("finish", () => {
          message.channel.send({ embeds: [embed] });
          quizMap.delete(message.guild.id);
          quizFunction();
        })
        .on("error", (err) => {});
    };
  },
  permissions: "",
  requiredRoles: [],
};
