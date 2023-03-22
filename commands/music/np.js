const { MessageEmbed } = require("discord.js");
const { MUTE_CHANNEL } = require("../../json/config.json");

module.exports = {
  commands: ["np"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: async (message, args, client) => {
    if (message.channel.id === MUTE_CHANNEL) return;
    const player = await client.manager.get(message.guild.id);
    let embed = new MessageEmbed()
      .setTitle("♪ Tocando Agora ♪")
      .setColor("#0099ff");
    if (!player?.queue) {
      return message.channel.send({
        embeds: [embed.setDescription("Nem tem nada tocando man")],
      });
    }

    let time = player.position,
      { current } = player.queue;

    let progressBar = progressBarEnhanced(
      ~~(time / 1000),
      current.duration / 1000,
      15
    );

    embed
      .setDescription(`[${current.title}](${current.uri})`)
      .addFields(
        {
          name: "\u200B",
          value:
            "`" +
            `${msToHour(~~time)}[${progressBar}]${ssTohms(
              current.duration / 1000
            )}` +
            "`",
        },
        {
          name: "\u200B",
          value: "`Requested by: `" + `${current.requester}`,
        }
      )
      .setThumbnail(current.thumbnail);
    message.channel.send({ embeds: [embed] });
  },
  permissions: "",
  requiredRoles: [],
};

let progressBarEnhanced = (current, total, barSize) => {
  let progress = Math.round((barSize * current) / total);
  return (
    "━".repeat(progress > 0 ? progress - 1 : progress) +
    "🔘" + //
    "━".repeat(barSize - progress)
  );
};

const msToHour = (time) => {
  time = time || 0;
  time = Math.round(time / 1000);
  const s = time % 60,
    m = ~~((time / 60) % 60),
    h = ~~(time / 60 / 60);

  return h === 0
    ? `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(Math.abs(h) % 24).padStart(2, "0")}:${String(m).padStart(
        2,
        "0"
      )}:${String(s).padStart(2, "0")}`;
};

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
