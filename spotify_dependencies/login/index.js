/* eslint-disable no-unused-vars */
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const Token = require("../../models/mongo-db/spotify_token.js");
const tokenID = "628e8b0634db3b3de38a9fcc";

const spotifyLogin = () => {
  const scopes = [
    "ugc-image-upload",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "streaming",
    "app-remote-control",
    "user-read-email",
    "user-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-read-private",
    "playlist-modify-private",
    "user-library-modify",
    "user-library-read",
    "user-top-read",
    "user-read-playback-position",
    "user-read-recently-played",
    "user-follow-read",
    "user-follow-modify",
  ];

  var spotifyApi = new SpotifyWebApi({
    clientId: "ceeb1431ab3d42ca9bd35eb45935c8ed",
    clientSecret: "45319eeb5967428aac1fb682d1ce42cd",
    redirectUri: "http://localhost:8888/callback",
  });

  const app = express();

  app.get("/login", (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
  });

  app.get("/callback", (req, res) => {
    const error = req.query.error;
    const code = req.query.code;

    if (error) {
      console.error("Callback Error:", error);
      res.send(`Callback Error: ${error}`);
      return;
    }

    spotifyApi
      .authorizationCodeGrant(code)
      .then(async (data) => {
        const access_token = data.body["access_token"];
        const refresh_token = data.body["refresh_token"];
        const expires_in = data.body["expires_in"];

        await Token.findByIdAndUpdate(tokenID, {
          body: access_token,
        }).catch((error) => {});
        module.exports.spotifyApi = spotifyApi;

        //console.log(Token.findById(tokenID).then((res) => {}))

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        console.log(
          `O access_token criado com sucesso. Expiram em ${expires_in}.`
        );
        res.send('Pronto. Já pode fechar a guia"');

        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body["access_token"];
          await Token.findByIdAndUpdate(tokenID, {
            body: access_token,
          }).catch((error) => {});
          console.log("O access_token foi atualizado!");
          spotifyApi.setAccessToken(access_token);
        }, (expires_in / 2) * 1000);
      })
      .catch((error) => {
        console.error("Error getting Tokens:", error);
        res.send(`Error getting Tokens: ${error}`);
      });
    module.exports.spotifyApi = spotifyApi;
  });

  app.listen(8888, () =>
    console.log(
      "Acesse http://localhost:8888/login para conseguir o spotify access_token"
    )
  );
};

module.exports.spotifyLogin = spotifyLogin;
