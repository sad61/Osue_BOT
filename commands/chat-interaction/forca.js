/*
const axios = require("axios");
const cheerio = require("cheerio");
const { MessageActionRow, MessageMenu } = require("discord.js");
const Categorias = [
  { id: null, nome: "Custom", valor: "0" },
  { id: 0, nome: "Dicionario Completo", valor: "1" },
  { id: 2, nome: "Alimentos", valor: "2" },
  { id: 3, nome: "Animais", valor: "3" },
  { id: 4, nome: "Cores", valor: "4" },
  { id: 5, nome: "Corpo Humano", valor: "5" },
  { id: 7, nome: "Familia", valor: "6" },
  { id: 10, nome: "Numeros", valor: "7" },
  { id: 12, nome: "Profissões", valor: "8" },
];
var collector1;
module.exports = {
  commands: ["forca"],
  expectedArgs: "",
  permissionError: "",
  minArgs: null,
  maxArgs: null,
  callback: async (message, arguments, text) => {
    let URL;
    let index;
    let Categoria = "";
    let Espacos = "";
    let erros = "";
    let palavra = "";

    if (collector1) {
      return message.channel.send("Ja tem um jogo em progresso man 🤨");
    }

    const menu = new MessageMenu().setID("Categorias").setPlaceholder("---");

    for (const Category in Categorias) {
      menu.addOptions([
        {
          label: Categorias[Category].nome,
          value: Categorias[Category].valor,
        },
      ]);
    }
    const row = new MessageActionRow().addComponents(menu);
    const filter = (button) => button.clicker.user.id === message.author.id;
    let mensagem = await message.channel.send("Selecione a Categoria", row);
    let collector = await mensagem.createMenuCollector(filter, {
      max: 1,
      time: 30000,
    });
    collector
      .on("collect", (menu) => {
        switch (menu.values[0]) {
          case "1":
            menu.reply.defer();
            index = 1;
            break;
          case "2":
            menu.reply.defer();
            index = 2;
            break;
          case "3":
            menu.reply.defer();
            index = 3;
            break;
          case "4":
            menu.reply.defer();
            index = 4;
            break;
          case "5":
            menu.reply.defer();
            index = 5;
            break;
          case "6":
            menu.reply.defer();
            index = 6;
            break;
          case "7":
            menu.reply.defer();
            index = 7;
            break;
          case "8":
            menu.reply.defer();
            index = 8;
            break;
          case "0":
            menu.reply.defer();
            index = 0;
            break;
        }
      })
      .on("end", async function () {
        if (index && index != 0) {
          URL =
            "https://www.palabrasaleatorias.com/palavras-aleatorias.php?fs=1&fs2=" +
            Categorias[index].id +
            "&Submit=Nova+palavra";
          palavra = await getWord(URL);
          mensagem.delete();
          Forca(palavra, index, message);
        } else if (index === 0) {
          mensagem.delete();
          Custom(message, index);
        } else {
          mensagem.delete();
        }
        //message.channel.send(getWord(URL))
      });
  },
  permissions: "",
  requiredRoles: [],
};

async function Forca(palavra, index, message) {
  var ArrayPalavra = [];
  let erros = "";
  var mensagem;
  var guessArray = [];
  var jogo = "";
  var acertos = 0;
  //var jogo =("_ ".repeat(palavra.length))
  let Fase = 0;
  let Categoria = Categorias[index].nome;
  let Separado = Array.from(palavra.toLowerCase());
  const filter = (m) => m.author.id === message.author.id;
  for (let i = 0; i < palavra.length; i++) {
    ArrayPalavra.push({
      letter: Separado[i],
      display: "_ ",
      correct: false,
    });
  }

  Send();

  async function Send() {
    jogo = "";
    acertos = 0;
    for (let i = 0; i < ArrayPalavra.length; i++) {
      jogo = jogo + ArrayPalavra[i].display;
    }

    const Fases = [
      [
        `\`\`\`html\n─┬────┐\n │    │    <Jogo-Da-Forca Categoria="${Categoria}">\n      │\n      │        ${jogo}\n      │\n      │       ${erros}\n▀▀▀▀▀▀▀\n\`\`\``,
      ],
      [
        `\`\`\`html\n─┬────┐\n │    │    <Jogo-Da-Forca Categoria="${Categoria}">\n O    │\n      │        ${jogo}\n      │\n      │       ${erros}\n▀▀▀▀▀▀▀\n\`\`\``,
      ],
      [
        `\`\`\`html\n─┬────┐\n │    │    <Jogo-Da-Forca Categoria="${Categoria}">\n O    │\n |    │        ${jogo}\n      │\n      │       ${erros}\n▀▀▀▀▀▀▀\n\`\`\``,
      ],
      [
        `\`\`\`html\n─┬────┐\n │    │    <Jogo-Da-Forca Categoria="${Categoria}">\n O    │\n/|    │        ${jogo}\n      │\n      │       ${erros}\n▀▀▀▀▀▀▀\n\`\`\``,
      ],
      [
        `\`\`\`html\n─┬────┐\n │    │    <Jogo-Da-Forca Categoria="${Categoria}">\n O    │\n/|\\   │        ${jogo}\n      │\n      │       ${erros}\n▀▀▀▀▀▀▀\n\`\`\``,
      ],
      [
        `\`\`\`html\n─┬────┐\n │    │    <Jogo-Da-Forca Categoria="${Categoria}">\n O    │\n/|\\   │        ${jogo}\n/     │\n      │       ${erros}\n▀▀▀▀▀▀▀\n\`\`\``,
      ],
      [
        `\`\`\`html\n─┬────┐\n │    │    <Jogo-Da-Forca Categoria="${Categoria}">\n O    │\n/|\\   │        ${jogo}\n/ \\   │\n      │       ${erros}\n▀▀▀▀▀▀▀\n\`\`\``,
      ],
    ];
    if (mensagem) {
      mensagem.edit(Fases[Fase]);
    } else {
      mensagem = await message.channel.send(Fases[0]);
    }
    if (Fase === 6) {
      await message.channel.send("perdeu kkkkkkk ruim");
      collector1 = undefined;
      return;
    }
    if (ArrayPalavra.every((Array) => Array.correct)) {
      await message.channel.send("🥳 parabens vc venceu!!!!!");
      collector1 = undefined;
      return;
    }

    collector1 = new message.channel.createMessageCollector(
      message.channel,
      filter,
      {
        time: 30000,
        max: 1,
      }
    );

    collector1
      .on("collect", (m) => {
        var guess = m.content;
        if (guess.length === 1) {
          for (let i = 0; i < ArrayPalavra.length; i++) {
            if (guess.toLowerCase() === ArrayPalavra[i].letter) {
              ArrayPalavra[i].display = guess + " ";
              ArrayPalavra[i].correct = true;
              acertos = 1;
            }
          }

          if (acertos === 0) {
            if (!guessArray.includes(guess)) {
              erros = erros + " - " + guess;
              guessArray.push(guess);
              Fase++;
            }
          }
          m.delete();
        }
        Send();
      })
      .on("end", (a) => {
        collector1 = undefined;
      });
  }
}

async function Custom(message) {
  message.channel.send("Custom ainda em desenvolvimento :\\");
}

async function getWord(url) {
  const { data } = await axios.get(url);
  var palavra;
  const $ = cheerio.load(data);
  palavra = $("div[style*='font-size:3em; color:#6200C5;']")
    .text()
    .split("\n")
    .join("");
  return palavra;
}
*/
