// @UNUSED
const ytpl = require("ytpl");
const yt = require("youtube-search-without-api-key");
const ytdl = require("ytdl-core");
const spdl = require("spdl-core");
const spotifyFetcher = require("../spotify/getTracks.js");

const regYoutubeLink =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/;
const regYoutubePlaylist = /[?&]list=([^#&?]+)/;
const regSpotifyLink =
  /^(?:spotify:|https:\/\/[a-z]+\.spotify\.com\/(track\/|user\/(.*)\/playlist\/))(.*)$/;
const regSpotifyPlaylist =
  /^(https:\/\/open.spotify.com\/playlist\/|spotify:user:spotify:playlist:)([a-zA-Z0-9]+)(.*)$/;

const videoFinder = async (args) => {
  if (String(args).match(regYoutubeLink)) {
    if (String(args).match(regYoutubePlaylist)) {
      const playlistResult = await ytpl(`${args}`);
      return playlistResult ? playlistResult : null;
    } else {
      const videoResult = await ytdl.getInfo(args, function (err, info) {
        return info;
      });

      return videoResult;
    }
  } else if (String(args).match(regSpotifyLink)) {
    // --------SPOTIFY DEFAULT-----------
    const spotifyInfo = await spdl.getInfo(String(args));
    const videoResult = await yt.search(String(`${spotifyInfo.title}`));

    return videoResult.length > 1 ? videoResult[0] : null;
  } else if (String(args).match(regSpotifyPlaylist)) {
    // ------------SPOTIFY PLAYLIST------------
    let videoResults = [];
    let regMatch = String(args).match(regSpotifyPlaylist);
    //let tracks = getPlaylistTracks(String(args))
    let tracks = await spotifyFetcher.getPlaylistTracks(regMatch[2]);
    for (let i = 0; i < tracks.length; i++) {
      let video = await yt.search(
        String(`${tracks[i].songName} ${tracks[i].songArtist}`)
      );
      console.log(tracks[i].songName);
      videoResults = videoResults.concat(video[0]);
    }
    return videoResults;
  } else {
    const videoResult = await yt.search(String(args));
    return videoResult.length > 1 ? videoResult[0] : null;
  }
};

module.exports.videoFinder = videoFinder;
