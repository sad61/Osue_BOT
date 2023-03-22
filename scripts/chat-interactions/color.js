const { MessageActionRow, MessageButton } = require("discord.js");
const { registerFont, createCanvas, loadImage } = require("canvas");

const setColor = async (roles, args, message, embed, guild, Roles) => {
  if (!/^#[0-9A-F]{6}$/i.test(args[2]))
    return message.channel.send("tem que passar um hexadecimal valido :|");
  if (/\d/.test(args[1]))
    return message.channel.send({
      embeds: [embed.setTitle("Não pode botar número no nome porra 😠")],
    });
  args[1] = args[1].toLowerCase();
  args[2] = args[2].toLowerCase();
  if (
    roles.some(
      ({ role }) =>
        String(role.name).trim().toLowerCase() == String(args[1]).trim()
    )
  )
    return message.channel.send("já existe uma cor com esse nome");

  if (
    roles.some(
      ({ role }) =>
        String(role.hexColor).trim().toLowerCase() == String(args[2]).trim()
    )
  )
    return message.channel.send("já existe um cargo com essa cor");

  let rolesSameColor = [];
  roles.forEach(({ role }) => {
    if (String(role.hexColor).trim().toLowerCase() == String(args[2]).trim()) {
      rolesSameColor.push(role.name);
    }
  });

  if (rolesSameColor.length)
    return message.channel.send({
      content: "Já existem cargos com essa cor",
      embeds: [embed.setDescription(`**${rolesSameColor.join("\n\n")}**`)],
    });

  const roleCreated = await guild.roles.create({
    name: args[1],
    color: args[2],
    position: 1,
    createdBy: message.member.id,
  });
  let lastRole = roles.pop();
  const model = await new Roles({
    guildName: message.guild.name,
    guildID: message.guild.id,
    role: {
      name: args[1],
      hexColor: args[2],
      id: String(roleCreated.id).trim(),
      number: lastRole ? parseInt(lastRole.role.number) + 1 : 1,
    },
  });
  model.save().then((res) => console.log(res));
  message.channel.send({
    embeds: [embed.setDescription(`Cargo ${roleCreated} criado`)],
  });
};
module.exports.setColor = setColor;

const getColor = (roles, args, message, embed) => {
  if (!roles)
    return message.channel.send(
      "Role não encontrada. Digite a role exatamente como ela é escrita"
    );
  let roleID = roles[0].role.id;

  message.member.roles.add(`${roleID}`);
  message.channel.send({
    embeds: [embed.setDescription(`Cargo <@&${roleID}> dado ao usuário`)],
  });
};

module.exports.getColor = getColor;

const removeColor = async (roles, args, message, embed) => {
  if (!roles)
    return message.channel.send(
      "Role não encontrada. Ou ela foi digitada incorretamente ou ela não está nos meus Banco de Dados"
    );
  let roleID = roles[0].role.id,
    roleName = roles[0].role.name;
  if (
    !message.member.roles.cache.some(
      (role) => role.name.toLowerCase() === String(roleName).trim()
    )
  )
    return message.channel.send({
      embeds: [embed.setTitle("Voce nem tem essa role porra 😠")],
    });
  await message.channel.send({
    embeds: [embed.setDescription(`Cargo <@&${roleID}> retirado do usuário`)],
  });
  message.member.roles.remove(roleID);
};

module.exports.removeColor = removeColor;

const resolvePage = async (roles, page) => {
  const row = new MessageActionRow();
  const row2 = new MessageActionRow();
  const row3 = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("firstPage")
      .setLabel("First")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId("previousPage")
      .setLabel("Back")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId("nextPage")
      .setLabel("Next")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId("lastPage")
      .setLabel("Last")
      .setStyle("SECONDARY")
  );

  registerFont("./scripts/chat-interactions/assets/unisans.otf", {
    family: "Uni Sans",
  });
  let defaultPosX = 60,
    defaultPosY = 120;
  const canvas = createCanvas(1600, 600);
  const ctx = canvas.getContext("2d");
  const background = await loadImage("./scripts/chat-interactions/canvas.jpg");
  ctx.font = '64px "Uni Sans"';
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  for (let i = 0; i < roles[page].length; i++) {
    const { r, g, b } = hexToRgb(roles[page][i].role.hexColor);

    if (i % 2 !== 0) {
      ctx.fillStyle = `rgb(${r}, ${g}, ${b}`;
      ctx.fillText(
        `${roles[page][i].role.number}. ${roles[page][i].role.name}`,
        800,
        defaultPosY
      );
    } else {
      ctx.fillStyle = `rgb(${r}, ${g}, ${b}`;
      ctx.fillText(
        `${roles[page][i].role.number}. ${roles[page][i].role.name}`,
        defaultPosX,
        defaultPosY
      );
    }
    if (i % 2 !== 0) defaultPosY += 100;
    if (i < 5) {
      row.addComponents(
        new MessageButton()
          .setCustomId(`${roles[page][i].role.number}`)
          .setLabel(`${roles[page][i].role.number}`)
          .setStyle("PRIMARY")
      );
    } else {
      row2.addComponents(
        new MessageButton()
          .setCustomId(`${roles[page][i].role.number}`)
          .setLabel(`${roles[page][i].role.number}`)
          .setStyle("PRIMARY")
      );
    }
  }
  if (row2?.components?.length < 1) {
    row2.addComponents(
      new MessageButton()
        .setCustomId(`invalidRow2`)
        .setLabel(`oi`)
        .setStyle("PRIMARY")
        .setDisabled(true)
    );
  }
  let file = canvas.toBuffer();
  return { file, row, row2, row3 };
};

module.exports.resolvePage = resolvePage;

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
