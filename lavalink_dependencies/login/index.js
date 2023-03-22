const Spotify = require("erela.js-spotify");
const { Manager } = require("erela.js");
const { embedCompiler } = require("../../models/discord/embedCompiler.js");

const embedMap = new Map();

const clientID = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const lavalinkInit = (client) => {
  client.manager = new Manager({
    plugins: [
      new Spotify({
        clientID,
        clientSecret,
        convertUnresolved: true,
      }),
    ],
    nodes: [
      {
        host: "localhost",
        port: 80,
        password: "senha",
        retryAmount: 10,
        retryDelay: 5000,
        secure: false,
      },
    ],
    send(id, payload) {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
  })
    .on("nodeConnect", (node) =>
      console.log(`Node ${node.options.identifier} connected`)
    )
    .on("nodeError", (node, error) =>
      console.log(
        `Node ${node.options.identifier} had an error: ${error.message}`
      )
    )
    .on("trackStart", async (player, track) => {
      try {
        let embedMsg = await client.channels.cache
          .get(player.textChannel)
          .send({
            embeds: [embedCompiler(track).setTitle("♪ Tocando agora ♪")],
          });
        embedMap.set(player.guild, embedMsg);
      } catch (e) {
        console.log(e);
      }
    })
    .on("trackEnd", async (player) => {
      console.log("música acabou");
      try {
        embedMap.get(player.guild).delete();
      } catch (e) {
        console.log(e);
      }
    })
    .on("trackStuck", async (player, track, payload) => {
      console.log(payload);
      client.channels.cache.get(player.textChannel).send("deu stuck");
    })
    .on("trackError", async (player, payload, error) => {
      console.log({ payload, error });
      try {
        console.log("deu erroinho");
        await client.channels.cache.get(player.textChannel).send("deu erro");
        console.log("Erro depois");
      } catch (e) {
        console.log(e);
      }
    })
    .on("queueEnd", (player) => {
      try {
        embedMap.get(player.guild).delete();
      } catch (e) {
        console.log({ e });
      }
    });
};

module.exports.lavalinkInit = lavalinkInit;
