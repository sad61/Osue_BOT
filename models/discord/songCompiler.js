const compileSpotify = (video, message) => {
  let song = {
    title: video.title,
    url: video.url,
    videoLength: video.duration_raw,
    seconds: hmsToSecondsOnly(video.duration_raw),
    thumbnail: video.snippet.thumbnails.url,
    author: video.author,
    userRequested: message.author.toString(),
  };
  return song;
};

const compileSpotifyPlaylist = (video, message) => {
  let song = [];
  let index = 0;
  var playlist = video;
  for (let i = 0; playlist.length > i; i++) {
    let playlistSongs = {
      index: index++,
      title: playlist[i].title,
      url: playlist[i].url,
      videoLength: playlist[i].duration_raw,
      seconds: hmsToSecondsOnly(String(playlist[i].duration_raw)),
      thumbnail: playlist[i].snippet.thumbnails.url,
      author: playlist[i].author,
      userRequested: message.author.toString(),
    };
    song.push(playlistSongs);
  }
  return song;
};

const compileYoutubeValidate = (video, message) => {
  let song = {
    title: video.videoDetails.title,
    url: video.videoDetails.video_url,
    videoLength: ssTohms(video.videoDetails.lengthSeconds),
    seconds: video.videoDetails.lengthSeconds,
    thumbnail: video.videoDetails.thumbnails[0].url,
    author: video.videoDetails.author.name,
    userRequested: message.author.toString(),
  };
  return song;
};

const compileYoutubePlaylist = (video, message) => {
  let song = [];
  for (let i = 0; video.items.length > i; i++) {
    let playlistSongs = {
      index: i,
      title: video.tracks[i].title,
      url: video.tracks[i].url,
      videoLength: video.tracks[i].duration,
      seconds: hmsToSecondsOnly(video.tracks[i].duration),
      thumbnail: video.tracks[i].thumbnail,
      author: video.tracks[i].author,
      userRequested: message.author.toString(),
    };
    song.push(playlistSongs);
  }
  return song;
};

const compileDefault = (video, message) => {
  let song = {
    title: video.title,
    url: video.url,
    videoLength: video.duration_raw,
    seconds: hmsToSecondsOnly(video.duration_raw),
    thumbnail: video.snippet.thumbnails.url,
    author: video.author,
    userRequested: message.author.toString(),
  };
  return song;
};

module.exports.compileSpotify = compileSpotify;
module.exports.compileSpotifyPlaylist = compileSpotifyPlaylist;
module.exports.compileYoutubeValidate = compileYoutubeValidate;
module.exports.compileYoutubePlaylist = compileYoutubePlaylist;
module.exports.compileDefault = compileDefault;

function hmsToSecondsOnly(str) {
  var p = str.split(":"),
    s = 0,
    m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }
  return s;
}

function ssTohms(secs) {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}
