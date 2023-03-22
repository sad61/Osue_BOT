/* eslint-disable no-unused-lets */
const Discord = require("discord.js");
const jason = require("../..//json/Undergrounds.json");

function secondsToDhms(seconds) {
  seconds = Number(seconds);
  let d = Math.floor(seconds / (3600 * 24));
  let h = Math.floor((seconds % (3600 * 24)) / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = Math.floor(seconds % 60);
  let dDisplay = d > 0 ? d + (d == 1 ? " dia, " : " dias, ") : "";
  let hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " horas, ") : "";
  let mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " minutos, ") : "";
  let sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " segundos") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  commands: ["proxaniver"],
  expectedArgs: "",
  permissionError: "",
  minArgs: null,
  maxArgs: null,
  callback: async (message) => {
    let embed = new Discord.MessageEmbed()
      .setTitle("Proximos Aniversário 🥳🎉")
      .setColor("#0099ff");

    let under = await Object.entries(jason).map(([key, value]) => value);
    //console.log(under)
    const today = new Date();
    let Datas = [];

    for (let i = 0; i < under.length; i++) {
      Datas[i] = {};
      Datas[i].name = under[i].userName;
      Datas[i].date = new Date(
        today.getFullYear(),
        under[i].aniverMonth,
        under[i].aniverDay
      );
    }
    for (let i = 0; i < Datas.length; i++) {
      if (Datas[i].name == undefined) {
        Datas.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < Datas.length; i++) {
      let dif = Datas[i].date - today;
      Datas[i].tempo = dif / (1000 * 3600 * 24);
      Datas[i].segundos = dif / 1000;
      Datas[i].falta = secondsToDhms(Datas[i].segundos);

      if (Datas[i].tempo < 0) {
        Datas[i].tempo = Datas[i].tempo * -1 + 365;
      }
    }
    console.log({ Datas });

    Datas.sort(function (a, b) {
      return parseFloat(a.tempo) - parseFloat(b.tempo);
    });

    let valor = "";
    for (let i = 0; i < 5; i++) {
      valor =
        valor +
        (i +
          1 +
          " - " +
          Datas[i].name +
          " " +
          Math.ceil(Datas[i].tempo) +
          (Math.ceil(Datas[i].tempo) == 1 ? " dia" : " dias") +
          "\n");
    }

    embed.setDescription(valor);
    message.channel.send({ embeds: [embed] });
  },
  permissions: "",
  requiredRoles: [],
};
