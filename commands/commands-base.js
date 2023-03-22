const { PREFIX } = require("../json/config.json");

// Loopar esse array 'permissions' e verificar se existe no 'validPermissions'.
const validatePermissions = (permissions) => {
  const validPermissions = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
  ];

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Permissão não conhecida ${permission}`);
    }
  }
};

module.exports = (commandOptions) => {
  let { commands = "", permissions = [] } = commandOptions;

  // Comando precisa ser convertido em array.
  if (typeof commands === "string") {
    commands = [commands];
  }

  // Verificar se permission estão em um array e se elas são válidas.
  if (permissions.length) {
    if (typeof permissions === "string") {
      permissions = [permissions];
    }
    validatePermissions(permissions);
  }

  for (const command of commands) {
    allCommands[command] = {
      ...commandOptions,
      commands,
      permissions,
    };
  }
};

const allCommands = [];
module.exports.listen = (client) => {
  client.on("messageCreate", (message) => {
    var { member, content, guild } = message;

    //if (message.channel.id === '753413520606887967') return;
    if (message.author.bot) return;

    const args = content.split(/[ ]+/);

    const name = args.shift().toLowerCase();

    if (
      message.content == "*ban <@!804422431548112896>" ||
      message.content == "*kick <@!804422431548112896>"
    )
      return message.channel.send("Ta loco man?? 🤨");

    if (name.startsWith(PREFIX)) {
      const command = allCommands[name.replace(PREFIX, "")];
      if (!command) {
        return;
      }

      const {
        permissions,
        permissionError = "Você nem tem permissão pra usar isso man",
        requiredRoles = [],
        minArgs = 0,
        maxArgs = null,
        expectedArgs,
        callback,
      } = command;

      // Verificar Permissão
      for (let permission of permissions) {
        if (!member.hasPermission(permission)) {
          message.reply(permissionError);
          return; // Para não continuar executando a função.
        }
      }

      // Verificar se o usuário tem a roles necessárias.
      for (const requiredRole of requiredRoles) {
        // rodar as roles do server e atribuir o valor para 'role' até que seja === requiredRole
        const role = guild.roles.cache.find(
          (role) => role.name === requiredRole
        ); // Se o membro não tem a role ou a role não existe no server.
        if (!role || !member.roles.cache.has(role.id)) {
          message.reply(
            `Você precisa ter a "${requiredRole}" role para usar esse comando`
          );
          return;
        }
      }

      // Remover o comando *add do array

      // Verificar se tem o número correto de argumentos.
      if (
        args.length < minArgs ||
        (maxArgs !== null && args.length > maxArgs)
      ) {
        // Setei alias em cima pra ser alguma coisa do commands
        // Usando alias eu vou dar match no alias usado pelo user '*addition 76 9 2' output = Syntax incorreta burro. Tem que ser *addition ...
        message.reply(
          `Syntax incorreta burro. Tem que ser ${name} ${expectedArgs}`
        );
        return;
      }
      //console.log(`client: ${client}`)
      if (callback) callback(message, args, client, args.join(" "), name);
      // join ['8', '5'] -> '8 5'
    }
  });
};
