/* eslint-disable no-unused-vars */
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { Client } = require("discord.js");
const { lavalinkInit } = require("./lavalink_dependencies/login/index.js");
const { mongoLogin } = require("./mongo_dependencies/login/index.js");
const schedule = require("node-schedule");
const underground = require("./json/Undergrounds.json");
const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_MEMBERS"],
});

client.on("ready", async () => {
  console.log(
    `\u001b[1;36m${client.user.username}` +
      "\u001b[1;34m entrou no servidor. oikkkk\u001b[0m"
  );

  client.manager.init(client.user.id);

  const baseFile = "commands-base.js";
  const commandBase = require(`./commands/${baseFile}`);

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file)); // Vai checar se o diretório é uma folder ou archive.
      if (stat.isDirectory()) {
        // Se for uma folder vai chamar a função de novo e rodar para os archives dentro dela.
        readCommands(path.join(dir, file));
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file));
        commandBase(option);
      }
    }
  };
  readCommands("commands");
  commandBase.listen(client);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const date = new Date();
  try {
    console.log(
      `${date.toLocaleString()}{${message.guild.name}}[${
        message.channel.name
      }](${message.member.user.tag}): ${message.content}`
    );
    /*console.log(
      `\u001b[32m${date.toLocaleString()}\u001B[1m\u001B[35m{${
        message.guild.name
      }}\u001B[36m[${message.channel.name}]\u001B[21m\u001B[34m(${
        message.member.user.tag
      }):\u001B[0m${message.content}`
    );*/
  } catch (err) {
    console.log(err);
  }
});

client.on("raw", (d) => client.manager.updateVoiceState(d));

let y = process.openStdin();
y.addListener("data", async (res) => {
  res = res.toString();
  const channelID = "753413520606887967";
  const aniverRoleId = "1069759062822109317";
  const channel = client.channels.cache.get(channelID);
  const guild = client.guilds.cache.get("636913623582769172");
  const member = await guild.members.fetch("370346029553287178");
  //console.log({ member });
  //channel.send(res);
  //console.log({ member });
  member.roles.remove(aniverRoleId);
  /*channel.fetchMessage("991385705223831642").then((msg) => msg.delete());
  const channelS = client.channels.cache.get("753413520606887967");

  channelS.messages.fetch("991385705223831642").then((msg) => msg.delete());*/
});

lavalinkInit(client);
mongoLogin();
client.login(process.env.DISCORD_BOT_TOKEN);

schedule.scheduleJob("40 27 * * * *", async () => {
  const date = new Date();
  const aniverRoleId = "674452167251329025";
  const channelId = "753413520606887967";
  const guildId = "636913623582769172";
  let aniverJason = [];
  let aniversariantes = [];
  aniverJason = underground.filter(
    (element) =>
      element.aniverDay === date.getDate() &&
      element.aniverMonth === date.getMonth()
  );

  const guild = client.guilds.cache.get(guildId);
  const members = await guild.members.fetch();
  const channel = await client.channels.fetch(channelId);
  for (let i = 0; i < aniverJason.length; i++) {
    let member = await guild.members
      .fetch(aniverJason[i].userID)
      .catch((err) => {
        console.log("Uma aniversariante n ta no server");
      });
    aniversariantes = aniversariantes.concat(member);
  }

  let exAniversariantes = guild.roles.cache.get(aniverRoleId).members;
  exAniversariantes.forEach((member) => member.roles.remove(aniverRoleId));
  if (aniversariantes.length >= 1) {
    channel.send(
      `@everyone Hoje é aniversário do(a) ${aniversariantes}!!! Feliz versário 🥳`
    );
  }

  for (let i = 0; i < aniversariantes.length; i++) {
    await aniversariantes[i].roles.add(aniverRoleId);
  }
});
