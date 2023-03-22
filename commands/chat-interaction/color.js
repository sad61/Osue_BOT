const { MessageEmbed } = require("discord.js");
const { initModel } = require("../../models/mongo-db/guild.js");
const {
  getColor,
  removeColor,
  resolvePage,
  setColor,
} = require("../../scripts/chat-interactions/color.js");

module.exports = {
  commands: ["color"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 1,
  maxArgs: null,
  callback: async (message, args, client) => {
    //if (message.guild.id == "636913623582769172") return;
    const guild = await client.guilds.cache.get(message.guild.id);
    //const memberRoles = message.member.roles.cache;
    let embed = new MessageEmbed()
      .setAuthor({ name: "🎨 Color 🎨" })
      .setColor("#0099ff")
      .setFooter({
        text: `requested by: ${message.author.tag}`,
        iconURL: `${message.author.displayAvatarURL({
          dynamic: true,
        })}`,
      });
    if (!args) return;

    const Roles = initModel(message.guild.id);
    let roles = await Roles.find();

    const verifyValidRole = (role, args) => {
      if (/^#[0-9A-F]{6}$/i.test(args))
        role = role.filter(
          ({ role }) =>
            String(role.hexColor).trim().toLowerCase() == String(args).trim()
        );
      else if (!/\d/.test(args)) {
        role = role.filter(
          ({ role }) =>
            String(role.name).trim().toLowerCase() == String(args).trim()
        );
      } else {
        role = role.filter(
          ({ role }) =>
            String(role.number).trim().toLowerCase() == String(args).trim()
        );
      }
      //console.log(role);
      return role;
    };

    try {
      switch (args[0].toLowerCase()) {
        case "help":
          message.channel.send({
            embeds: [
              embed.setDescription(
                "**COLOR COMMANDS**" +
                  "\n\n" +
                  "``set <nomecor> <hex>``" +
                  "\n" +
                  "Cria uma nova cor com o nome e o hex informado" +
                  "\n\n" +
                  "``list``" +
                  "\n" +
                  "Lista as cores criadas por mim" +
                  "\n\n" +
                  "``get <nomecor || hex || numero>``" +
                  "\n" +
                  "Recebe a cor informada" +
                  "\n\n" +
                  "``remove <nomecor || hex || numero>``" +
                  "\n" +
                  "Remove a cor do usuario" +
                  "\n\n" +
                  "``delete <nomecor || hex || numero>``(só mods e o sad 😊)" +
                  "\n" +
                  "Deleta a cor do servidor"
              ),
            ],
          });
          break;

        case "set": {
          setColor(roles, args, message, embed, guild, Roles);
          break;
        }

        case "get": {
          roles = verifyValidRole(roles, args[1].toLowerCase());
          console.log(roles);
          getColor(roles, args, message, embed);
          break;
        }
        case "remove": {
          roles = verifyValidRole(roles, args[1].toLowerCase());
          removeColor(roles, args, message, embed);
          break;
        }

        case "list": {
          if (!roles.length)
            return message.channel.send({
              embeds: [
                embed.setTitle(
                  "Esse servidor ainda não tem cores, use ``set <nomecor> <hex>`` para criar uma nova cor"
                ),
              ],
            });
          let rolePages = separate(roles, 10);
          let page = 0;

          const { file, row, row2, row3 } = await resolvePage(rolePages, page);
          const embedMsg = await message.channel.send({
            files: [file],
            components: [row, row2, row3],
          });
          const filter = (i) =>
            i.member === i.member && i.message.id === embedMsg.id;

          const buttonCollector =
            message.channel.createMessageComponentCollector({
              filter,
              idle: 15000,
              time: 30000,
            });

          buttonCollector.on("collect", async (i) => {
            switch (i.customId) {
              case "firstPage": {
                page = 0;
                const { file, row, row2, row3 } = await resolvePage(
                  rolePages,
                  page
                );
                await i.update({
                  files: [file],
                  components: [row, row2, row3],
                });
                break;
              }
              case "previousPage": {
                if (page !== 0) {
                  page--;
                  const { file, row, row2, row3 } = await resolvePage(
                    rolePages,
                    page
                  );
                  await i.update({
                    files: [file],
                    components: [row, row2, row3],
                  });
                }
                break;
              }
              case "nextPage": {
                if (page < rolePages.length) {
                  page++;
                  const { file, row, row2, row3 } = await resolvePage(
                    rolePages,
                    page
                  );
                  await i.update({
                    files: [file],
                    components: [row, row2, row3],
                  });
                }
                break;
              }
              case "lastPage": {
                page = rolePages.length - 1;
                const { file, row, row2, row3 } = await resolvePage(
                  rolePages,
                  page
                );
                await i.update({
                  files: [file],
                  components: [row, row2, row3],
                });
                break;
              }
              default: {
                roles = verifyValidRole(roles, i.customId);
                getColor(roles, args, message, embed);
                embedMsg.delete();
              }
            }
          });
          break;
        }
        case "delete": {
          if (
            message.member.id !== "370346029553287178" &&
            !message.member.permissions.has("ADMINISTRATOR")
          ) {
            return message.channel.send({
              embeds: [
                embed.setTitle("Voce nem tem permissão pra usar isso porra 😠"),
              ],
            });
          }
          if (!args[1])
            return message.channel.send({
              embeds: [
                embed.setTitle("Tem que passar a cor pra ser deletada cara"),
              ],
            });
          roles = verifyValidRole(roles, args[1]);
          let roleNumber = roles[0].role.number;
          await Roles.findByIdAndDelete(roles[0]._id).then((res) => {
            console.log({ res });
          });
          guild.roles
            .delete(roles[0].role.id)
            .then((res) => console.log({ res }));
          roles = await Roles.find();
          roles.splice(0, roleNumber - 1);
          roles.forEach(async ({ _id, role }) => {
            await Roles.findByIdAndUpdate(_id, {
              role: {
                name: `${role.name}`,
                hexColor: `${role.hexColor}`,
                number: `${role.number - 1}`,
              },
            });
          });
          message.channel.send({
            embeds: [embed.setTitle(`Cor deletada e números atualizados`)],
          });
          break;
        }
        /*case "clear": {
          /*if (!message.member.permissions.has("ADMINISTRATOR"))
            return message.channel.send(
              "vc nem tem permissão pra usar isso :/"
            );
          let rolesNotUsed = [];
          // não retorna os membros com a role
          const verifyUsedRole = async (role) => {
            let r = [];
            role.forEach(async ({ role, _id }) => {
              let guildRole = await guild.roles.cache
                  .filter("979184285141577789")
                  .members.map((m) => m),
                members = guildRole?.members ? guildRole.members : null;
              if (!members?.length) {
                r.push(role.name);
                //guildRole.delete();
                //Roles.findByIdAndDelete(_id).then((res) => {
                //  console.log(res);
                //});
              }
            });
            return r;
          };

          rolesNotUsed = await verifyUsedRole(role);
          /*if (!rolesNotUsed.length)
            return message.channel.send("nenhum cargo a ser deletado");
          message.channel.send({
            embeds: [
              embed
                .setTitle("Cargos removidos")
                .setDescription(`**${rolesNotUsed.join(" \n")}**`)
                .setFooter({
                  text: `requested by: ${message.author.tag}`,
                  iconURL: `${message.author.displayAvatarURL({
                    dynamic: true,
                  })}`,
                }),
            ],
          });
          break;
        }*/
        default: {
          message.channel.send("Burro. usa o help ai pra aprender");
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
  permissions: "",
  requiredRoles: [],
};

function separate(arr, size) {
  if (size <= 0) throw "Invalid chunk size";
  var R = [];
  for (var i = 0, len = arr.length; i < len; i += size)
    R.push(arr.slice(i, i + size));
  return R;
}
