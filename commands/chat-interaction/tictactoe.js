/*module.exports = {
  commands: ["velha", "tictactoe", "veia", "jogodavelha"],
  expectedArgs: "<member>",
  permissionError: "",
  minArgs: 1,
  maxArgs: 1,
  callback: async (message) => {
    try {
      var mencionado = message.mentions.members.first().user;
    } catch (err) {
      message.channel.send("man tem q mencionar tlg");
      return;
    }
    let jogo = null;
    let resp = null;
    let rodada = 0;
    let vencedor = false;

    var pressed = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];

    var emoji = [
      ["➖", "➖", "➖"],
      ["➖", "➖", "➖"],
      ["➖", "➖", "➖"],
    ];

    var board = ["", "", "", "", "", "", "", "", ""];
    const winCondition = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    var jogadores = [
      {
        jogador: message.author,
        emoji: "❌",
        filtro: (button) => button.clicker.user.id === message.author.id,
        numero: 1,
      },
      {
        jogador: mencionado,
        emoji: "⭕",
        filtro: (button) => button.clicker.user.id === mencionado.id,
        numero: 2,
      },
    ];

    let jogadorAtual = jogadores[1];

    sim = new botao.MessageButton().setID("sim").setLabel("Sim").setStyle(3);

    nao = new botao.MessageButton().setID("nao").setLabel("Não").setStyle(4);

    let row = new botao.MessageActionRow();
    row.addComponent(sim).addComponent(nao);

    /*******************************************************************

    mensagem = await message.channel.send(`${mencionado} aceitas?`, row);
    const filter1 = (button) => button.clicker.user.id === mencionado.id;
    const collector1 = mensagem.createButtonCollector(filter1, {
      max: 1,
      time: 10000,
    });
    collector1
      .on("collect", (button) => {
        if (button.id == "nao") {
          button.reply.defer();
          return mensagem.edit(`${mencionado} recusou :\\`, null);
        } else {
          button.reply.defer();
          mensagem.delete();
          return (resp = 1);
        }
      })
      .on("end", function async() {
        if (resp === 1) {
          send();
        }
      });

    async function send() {
      const verifyWinner = () => {
        loop: for (let i = 0; i < winCondition.length; i++) {
          const condition = winCondition[i];
          //console.log(`Condition: ${condition}`)
          let a = board[condition[0]];
          let b = board[condition[1]];
          let c = board[condition[2]];
          //console.log(`A: ${a}, B: ${b}, C: ${c}`)
          if (a === "" || b === "" || c === "") {
            continue;
          }
          if (a === b && b === c) {
            vencedor = jogadorAtual;
            pressed = [
              [true, true, true],
              [true, true, true],
              [true, true, true],
            ];
            break loop;
          }
        }
      };
      verifyWinner();
      rodada++;
      if (rodada === 10 && vencedor === false) {
        vencedor = null;
        pressed = [
          [true, true, true],
          [true, true, true],
          [true, true, true],
        ];
      }

      jogadorAtual =
        jogadores[0] === jogadorAtual ? jogadores[1] : jogadores[0];

      a1 = new botao.MessageButton()
        .setID("a1")
        .setStyle(1)
        .setDisabled(pressed[0][0])
        .setEmoji(emoji[0][0]);

      a2 = new botao.MessageButton()
        .setID("a2")
        .setStyle(1)
        .setDisabled(pressed[0][1])
        .setEmoji(emoji[0][1]);

      a3 = new botao.MessageButton()
        .setID("a3")
        .setStyle(1)
        .setDisabled(pressed[0][2])
        .setEmoji(emoji[0][2]);

      b1 = new botao.MessageButton()
        .setID("b1")
        .setStyle(1)
        .setDisabled(pressed[1][0])
        .setEmoji(emoji[1][0]);

      b2 = new botao.MessageButton()
        .setID("b2")
        .setStyle(1)
        .setDisabled(pressed[1][1])
        .setEmoji(emoji[1][1]);

      b3 = new botao.MessageButton()
        .setID("b3")
        .setStyle(1)
        .setDisabled(pressed[1][2])
        .setEmoji(emoji[1][2]);

      c1 = new botao.MessageButton()
        .setID("c1")
        .setStyle(1)
        .setDisabled(pressed[2][0])
        .setEmoji(emoji[2][0]);

      c2 = new botao.MessageButton()
        .setID("c2")
        .setStyle(1)
        .setDisabled(pressed[2][1])
        .setEmoji(emoji[2][1]);

      c3 = new botao.MessageButton()
        .setID("c3")
        .setStyle(1)
        .setDisabled(pressed[2][2])
        .setEmoji(emoji[2][2]);

      let row1 = new botao.MessageActionRow(),
        row2 = new botao.MessageActionRow(),
        row3 = new botao.MessageActionRow();

      row1.addComponent(a1).addComponent(a2).addComponent(a3);
      row2.addComponent(b1).addComponent(b2).addComponent(b3);
      row3.addComponent(c1).addComponent(c2).addComponent(c3);

      if (jogo) {
        if (vencedor === null) {
          return jogo.edit({
            content: "Empatou :\\ ",
            components: [row1, row2, row3],
          });
        } else if (vencedor) {
          return jogo.edit({
            content:
              (vencedor.jogador.username || vencedor.jogador.user.username) +
              " Venceu!",
            components: [row1, row2, row3],
          });
        }

        jogo.edit({
          content:
            "Vez de: " +
            (jogadorAtual.jogador.username ||
              jogadorAtual.jogador.user.username),
          components: [row1, row2, row3],
        });
      } else {
        jogo = await message.channel.send({
          content:
            "Vez de: " +
            (jogadorAtual.jogador.username ||
              jogadorAtual.jogador.user.username),
          components: [row1, row2, row3],
        });
      }

      const filter = await jogadorAtual.filtro;
      const collector = jogo.createButtonCollector(filter, {
        max: 1,
        time: 60000,
      });

      collector.on("collect", async (button) => {
        switch (button.id) {
          case "a1":
            button.reply.defer();
            pressed[0][0] = true;
            emoji[0][0] = jogadorAtual.emoji;
            board[0] = jogadorAtual.numero;
            send();
            break;

          case "a2":
            button.reply.defer();
            pressed[0][1] = true;
            emoji[0][1] = jogadorAtual.emoji;
            board[1] = jogadorAtual.numero;
            send();
            break;

          case "a3":
            button.reply.defer();
            pressed[0][2] = true;
            emoji[0][2] = jogadorAtual.emoji;
            board[2] = jogadorAtual.numero;
            send();
            break;

          case "b1":
            button.reply.defer();
            pressed[1][0] = true;
            emoji[1][0] = jogadorAtual.emoji;
            board[3] = jogadorAtual.numero;
            send();
            break;

          case "b2":
            button.reply.defer();
            pressed[1][1] = true;
            emoji[1][1] = jogadorAtual.emoji;
            board[4] = jogadorAtual.numero;
            send();
            break;

          case "b3":
            button.reply.defer();
            pressed[1][2] = true;
            emoji[1][2] = jogadorAtual.emoji;
            board[5] = jogadorAtual.numero;
            send();
            break;

          case "c1":
            button.reply.defer();
            pressed[2][0] = true;
            emoji[2][0] = jogadorAtual.emoji;
            board[6] = jogadorAtual.numero;
            send();
            break;

          case "c2":
            button.reply.defer();
            pressed[2][1] = true;
            emoji[2][1] = jogadorAtual.emoji;
            board[7] = jogadorAtual.numero;
            send();
            break;

          case "c3":
            button.reply.defer();
            pressed[2][2] = true;
            emoji[2][2] = jogadorAtual.emoji;
            board[8] = jogadorAtual.numero;
            send();
            break;
        }
      });
    }
  },
  permissions: "",
  requiredRoles: [],
};
*/
