const { MessageEmbed } = require("discord.js");

const embedCompiler = (video) => {
  try {
    const { thumbnail, title, uri, author, duration, requester } = video;
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setThumbnail(
        thumbnail
          ? thumbnail
          : "https://i0.wp.com/popasiaticojpg.com/wp-content/uploads/2022/06/Loona-Chuu.png?fit=810%2C400&ssl=1&w=640"
      )
      .setDescription(`[${title}](${uri})`)
      .addFields(
        {
          name: "Canal",
          value: author,
          inline: true,
        },
        {
          name: "Duração",
          value: ssTohms(duration / 1000),
          inline: true,
        },
        {
          name: "\u200B",
          value: "`Requested by: `" + `${requester}`,
        }
      );
    return embed;
  } catch (err) {
    console.log(err);
  }
};

const embedQueueCompiler = (queue) => {
  let queueArray = [];
  let queueObj = [];
  let index = 1,
    totalDuration = 0;
  try {
    queue.forEach(({ duration, title, uri, requester }) => {
      totalDuration += duration / 1000;
      queueArray.push(
        `${index++}. [${ssTohms(
          duration / 1000
        )}] [${title}](${uri}) requested by: ${requester}` + "\n\n"
      );

      queueObj.push({
        index: index,
        length: ssTohms(duration / 1000),
        title: title,
        uri: uri,
        requester: requester,
      });
    });
    console.log(queueObj);
    totalDuration = ssTohms(totalDuration);
    queueArray = separate(queueArray, 10);
    let embed = new MessageEmbed()
      .setTitle(" ♪ Queue de música ♪ ")
      .setColor("#0099ff")
      .setDescription(`${queueArray[0].join("")}`)
      .setFooter({
        text: `página 1 de ${queueArray.length}, duração da fila ${totalDuration}`,
      });
    return { embed, queueArray, queueObj, totalDuration };
  } catch (err) {
    console.log(err);
  }
};

const embedSearchCompiler = (tracks) => {
  var searchArray = [];
  let index = 1;
  tracks.forEach(({ duration, title, uri }) => {
    searchArray.push(
      `${index++}. [${ssTohms(duration / 1000)}] [${title}](${uri})` + "\n\n"
    );
  });
  try {
    searchArray = separate(searchArray, 10);
    let embed = new MessageEmbed()
      .setTitle(" ♪ Resultados ♪ ")
      .setColor("#0099ff")
      .setDescription(`${searchArray[0].join("")}`)
      .setFooter({
        text: `página 1 de ${searchArray.length}, selecione as tracks e aperte o botão verde 🟩 ou digite "done" para adicionar na fila, ou digite "cancel" para cancelar o search`,
      });
    return { embed, searchArray, index, tracks };
  } catch (err) {
    console.log(err);
  }
};

function separate(arr, size) {
  if (size <= 0) throw "Invalid chunk size";
  var R = [];
  for (var i = 0, len = arr.length; i < len; i += size)
    R.push(arr.slice(i, i + size));
  return R;
}

function ssTohms(secs) {
  const sec_num = parseInt(secs, 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor(sec_num / 60) % 60;
  const seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

module.exports.embedSearchCompiler = embedSearchCompiler;
module.exports.embedQueueCompiler = embedQueueCompiler;
module.exports.embedCompiler = embedCompiler;
