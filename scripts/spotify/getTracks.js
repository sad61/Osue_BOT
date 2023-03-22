const index = require("../../index.js");

async function getPlaylistTracks(playlistId) {
  const data = await index.spotifyApi.getPlaylistTracks(playlistId, {
    offset: 0,
    limit: 100,
    fields: "items",
  });

  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track;
    console.log(track.name);
    tracks.push({
      songName: `${track.name}`,
      songArtist: `${track.artists[0].name}`,
    });
    //console.log(track.name + " : " + track.artists[0].name)
  }
  return tracks;
}
module.exports.getPlaylistTracks = getPlaylistTracks;
//getPlaylistTracks('1YA5cPIfDy3L0
//spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
/*function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    // console.log(me.body);
    getUserPlaylists(me.body.id);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  //console.log("---------------+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
    fs.writeFileSync(playlist.name+'.json', data);
  }
}
*/
//GET SONGS FROM PLAYLIST
//getMyData();
