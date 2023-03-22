const { registerFont, createCanvas, loadImage } = require("canvas");
const { initModel } = require("../models/mongo-db/guild.js");

module.exports = {
  commands: ["teste"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: async (message) => {
    const roleID = "674452167251329025";
    const membros = await message.guild.members.fetch();
    //const members = message.guild.roles.cache.get(roleID).members;
    console.log(message.guild);

    // Get the Guild and store it under the variable "list"
    /*const member = jason.find(element => element.userID === '425120331745722368');
        console.log(member)*/
    // Iterate through the collection of GuildMembers from the Guild getting the username property of each member
    /*FileSystem.writeFile('fileeee.json', JSON.stringify(members), (error) => {
             
          });

        /* `m` is a message object that will be passed through the filter function
        let counter = 0;
        const filter = m => m.channel.id === message.author.id;

        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }

        const collector = new Discord.MessageCollector(message.channel, filter, {
            max: 10,
        });

        message.channel.send(jason.items[getRandomIntInclusive(0, 100)].title);
        collector.on('collect', m => {
            if (counter < 9) {
                counter++;
                m.channel.send(jason.items[getRandomIntInclusive(0, 100)].title);
            }
        })

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} messages.`)
            let counter = 0;
            collected.forEach((value) => {
                console.log(jason.items[counter++].title, value.content);
            })

        })

        /*console.log(message.channel)
        console.log(message.channel)
        console.log(arguments)
        if (message.channel.id == arguments){
            console.log("Igual")
        }
        //console.log(arguments)*/
  },
  permissions: "",
  requiredRoles: [],
};

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
