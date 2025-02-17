require("dotenv").config();
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token =
  "BQB4JvMAvPZ9vM82o_WVeumOmepSXD3u3LSwa26OJhJ5kSxYxZrmGUxYTxqGpMl9ulJ_53cZeV8AiM1cqawamQRrKz52mV7zESHM7jtH1d67-L_qmIyChzlD201DslxbDjBV1QeUlYqMTVKesPFbFCw7OwY09hT7bxyV5JvYlcXRvzh4OnQTmDem8eOYle2g5OCtYPgBt_4dc8MI96EUdsMzwx4wo50zqa9PDUEzaHz5p5hs4HXgTqYIFZX78RmyHVMnv3R2eC7SOnI94ij9ZTFOgq3Cktq3Aus_";
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

const tracksUri = [
  "spotify:track:6KIS5YIZAyeiFNx1aE1OhY",
  "spotify:track:2DnJjbjNTV9Nd5NOa1KGba",
  "spotify:track:70Ukvwcp6LkgfRiuUhGV7l",
  "spotify:track:7IsXXgpowAB48crGjV1oGb",
  "spotify:track:6yjKlmm7vOszkXEUku1EM1",
];

async function createPlaylist(tracksUri) {
  const { id: user_id } = await fetchWebApi("v1/me", "GET");

  const playlist = await fetchWebApi(`v1/users/${user_id}/playlists`, "POST", {
    name: "My top tracks playlist",
    description: "Playlist created by the tutorial on developer.spotify.com",
    public: false,
  });

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
    "POST"
  );

  return playlist;
}

async function searchTracks() {
  const artist = encodeURI("Days Of The New");
  const track = encodeURI("Touch, Peel And Stand");

  const response = await fetchWebApi(
    `v1/search?q=track:${track} artist:${artist}&type=track&market=US&limit=1&offset=0`,
    "GET"
  );

  return response;
}

async function main() {
  const createdPlaylist = await createPlaylist(tracksUri);
  const track = await searchTracks();
  console.log(JSON.stringify(track, null, 4));
  console.log(track.tracks.items[0].name);
  console.log(process.env.CLIENT_ID);
  //console.log(createdPlaylist.name, createdPlaylist.id);
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  }
);
// console.log(createdPlaylist.name, createdPlaylist.id);
