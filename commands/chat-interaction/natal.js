module.exports = {
  commands: ["natal", "naal", "anal"],
  expectedArgs: "",
  permissionError: "",
  minArgs: 0,
  maxArgs: null,
  callback: async (message) => {
    var today = new Date();

    var natal = new Date(today.getFullYear(), 11, 25);
    if (today.getMonth() == 11 && today.getDate() > 25) {
      natal.setFullYear(natal.getFullYear() + 1);
    }
    var result =
      Math.round(natal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    var remainingDays = Math.ceil(result);

    if (remainingDays == 0) {
      return message.channel.send(
        natalArr[getRndInteger(0, natalArr.length - 1)]
      );
    } else
      return message.channel.send(
        "Faltam " + remainingDays + " dias para o natal!!! 🥳"
      );
  },
  permissions: "",
  requiredRoles: [],
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

let natalArr = [
  "https://tenor.com/view/merrychristmas-christmas-tree-gif-19037507",
  "https://tenor.com/view/despicable-me-celebrate-minions-merry-christmas-gif-13321349",
  "https://tenor.com/view/santa-claus-waving-merry-christmas-gif-10281138",
  "https://tenor.com/view/merry-christmas-wrecking-ball-swing-gif-15821868",
  "https://tenor.com/view/love-happy-tuesday-gif-13099814",
  "https://tenor.com/view/dancing-santa-dancing-chachacha-chachasanta-christmas-tree-gif-10570632",
  "https://tenor.com/view/santa-cats-funny-animals-merry-christmas-happy-xmas-gif-19701376",
  "https://tenor.com/view/natal-gif-23775387",
  "https://tenor.com/view/santa-claus-reindeer-seasonal-christmas-xmas-gif-23935674",
  "https://tenor.com/view/merry-christmas-cousin-gif-19705951",
  "https://tenor.com/view/merry-santa-reindeer-gif-10609306",
  "https://tenor.com/view/xmas-santa-merry-xmas-kisses-merry-christmas-gif-12724213",
  "https://tenor.com/view/minions-christmas-noel-celebration-gif-4828365",
  "https://tenor.com/view/christmas-hat-santa-hat-snowing-kitten-cute-gif-13143691",
  "https://tenor.com/view/your-so-cute-christmas-cat-gif-13041247",
  "https://tenor.com/view/santa-santa-claus-papa-noel-twerk-twerking-gif-7219802",
  "https://tenor.com/view/christmas-is-coming-santa-santa-claus-papa-noel-noel-gif-15321129",
  "https://tenor.com/view/lets-play-letsplay-christmas-playtime-christmas-tree-fun-gif-15844379",
  "https://tenor.com/view/christmas-tiny-love-cute-kitten-gif-14691331",
  "https://tenor.com/view/smirk-gif-19519770",
  "https://tenor.com/view/puppy-christmas-puppy-christmas-gif-23890331",
  "https://tenor.com/view/christmas-cheer-christmas-is-coming-excited-santa-dog-gif-12981674",
];
