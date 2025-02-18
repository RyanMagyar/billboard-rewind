require("dotenv").config();
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = process.env.ACCESS_TOKEN;

const songArray = [
  {
    rank: 1,
    title: "Take On Me",
    artist: "a-ha",
    cover:
      "https://charts-static.billboard.com/img/1985/07/a-ha-zrv-takeonme-6da-180x180.jpg",
    position: {
      positionLastWeek: 3,
      peakPosition: 1,
      weeksOnChart: 15,
    },
  },
  {
    rank: 2,
    title: "Saving All My Love For You",
    artist: "Whitney Houston",
    cover:
      "https://charts-static.billboard.com/img/1984/06/whitney-houston-u3i-180x180.jpg",
    position: {
      positionLastWeek: 4,
      peakPosition: 2,
      weeksOnChart: 10,
    },
  },
  {
    rank: 3,
    title: "Part-Time Lover",
    artist: "Stevie Wonder",
    cover:
      "https://charts-static.billboard.com/img/1985/09/stevie-wonder-355-part-time-lover-0s5-180x180.jpg",
    position: {
      positionLastWeek: 5,
      peakPosition: 3,
      weeksOnChart: 7,
    },
  },
  {
    rank: 4,
    title: "Oh Sheila",
    artist: "Ready For The World",
    cover:
      "https://charts-static.billboard.com/img/1985/07/ready-for-the-world-25h-106x106.jpg",
    position: {
      positionLastWeek: 1,
      peakPosition: 1,
      weeksOnChart: 12,
    },
  },
  {
    rank: 5,
    title: "Miami Vice Theme",
    artist: "Jan Hammer",
    cover:
      "https://charts-static.billboard.com/img/1985/09/jan-hammer-g38-106x106.jpg",
    position: {
      positionLastWeek: 9,
      peakPosition: 5,
      weeksOnChart: 7,
    },
  },
  {
    rank: 6,
    title: "Lonely Ol' Night",
    artist: "John Mellencamp",
    cover:
      "https://charts-static.billboard.com/img/1979/08/john-mellencamp-fg4-180x180.jpg",
    position: {
      positionLastWeek: 6,
      peakPosition: 6,
      weeksOnChart: 9,
    },
  },
  {
    rank: 7,
    title: "Money For Nothing",
    artist: "Dire Straits",
    cover:
      "https://charts-static.billboard.com/img/1985/06/dire-straits-n8i-moneyfornothing-8sj-180x180.jpg",
    position: {
      positionLastWeek: 2,
      peakPosition: 1,
      weeksOnChart: 15,
    },
  },
  {
    rank: 8,
    title: "Dancing In The Street",
    artist: "David Bowie & Mick Jagger",
    cover:
      "https://charts-static.billboard.com/img/1985/08/mick-jagger-n58-180x180.jpg",
    position: {
      positionLastWeek: 7,
      peakPosition: 7,
      weeksOnChart: 8,
    },
  },
  {
    rank: 9,
    title: "Fortress Around Your Heart",
    artist: "Sting",
    cover:
      "https://charts-static.billboard.com/img/1985/08/sting-fr9-91x91.jpg",
    position: {
      positionLastWeek: 11,
      peakPosition: 9,
      weeksOnChart: 9,
    },
  },
  {
    rank: 10,
    title: "Head Over Heels",
    artist: "Tears For Fears",
    cover:
      "https://charts-static.billboard.com/img/1985/08/tears-for-fears-m3u-headoverheels-mws-180x180.jpg",
    position: {
      positionLastWeek: 13,
      peakPosition: 10,
      weeksOnChart: 6,
    },
  },
  {
    rank: 11,
    title: "I'm Goin' Down",
    artist: "Bruce Springsteen",
    cover:
      "https://charts-static.billboard.com/img/1975/07/bruce-springsteen-the-e-street-band-cuy.jpg",
    position: {
      positionLastWeek: 12,
      peakPosition: 11,
      weeksOnChart: 7,
    },
  },
  {
    rank: 12,
    title: "Lovin' Every Minute Of It",
    artist: "Loverboy",
    cover:
      "https://charts-static.billboard.com/img/1985/08/loverboy-e51-106x106.jpg",
    position: {
      positionLastWeek: 15,
      peakPosition: 12,
      weeksOnChart: 9,
    },
  },
  {
    rank: 13,
    title: "Cherish",
    artist: "Kool & The Gang",
    cover:
      "https://charts-static.billboard.com/img/1985/07/kool-the-gang-bbp-106x106.jpg",
    position: {
      positionLastWeek: 8,
      peakPosition: 2,
      weeksOnChart: 16,
    },
  },
  {
    rank: 14,
    title: "Dress You Up",
    artist: "Madonna",
    cover:
      "https://charts-static.billboard.com/img/1982/11/madonna-mcq-180x180.jpg",
    position: {
      positionLastWeek: 10,
      peakPosition: 5,
      weeksOnChart: 10,
    },
  },
  {
    rank: 15,
    title: "You Belong To The City",
    artist: "Glenn Frey",
    cover:
      "https://charts-static.billboard.com/img/1985/09/glenn-frey-0tc-180x180.jpg",
    position: {
      positionLastWeek: 24,
      peakPosition: 15,
      weeksOnChart: 6,
    },
  },
  {
    rank: 16,
    title: "I'm Gonna Tear Your Playhouse Down",
    artist: "Paul Young",
    cover:
      "https://charts-static.billboard.com/img/1985/09/paul-young-5vz-106x106.jpg",
    position: {
      positionLastWeek: 18,
      peakPosition: 16,
      weeksOnChart: 7,
    },
  },
  {
    rank: 17,
    title: "We Built This City",
    artist: "Starship",
    cover:
      "https://charts-static.billboard.com/img/1985/09/starship-djg-180x180.jpg",
    position: {
      positionLastWeek: 25,
      peakPosition: 17,
      weeksOnChart: 7,
    },
  },
  {
    rank: 18,
    title: "Be Near Me",
    artist: "ABC",
    cover:
      "https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif",
    position: {
      positionLastWeek: 23,
      peakPosition: 18,
      weeksOnChart: 9,
    },
  },
  {
    rank: 19,
    title: "One Night Love Affair",
    artist: "Bryan Adams",
    cover:
      "https://charts-static.billboard.com/img/1979/04/bryan-adams-tfc-180x180.jpg",
    position: {
      positionLastWeek: 21,
      peakPosition: 19,
      weeksOnChart: 6,
    },
  },
  {
    rank: 20,
    title: "Four In The Morning (I Can't Take Anymore)",
    artist: "Night Ranger",
    cover:
      "https://charts-static.billboard.com/img/1982/12/night-ranger-fiz-180x180.jpg",
    position: {
      positionLastWeek: 19,
      peakPosition: 19,
      weeksOnChart: 9,
    },
  },
  {
    rank: 21,
    title: "You Are My Lady",
    artist: "Freddie Jackson",
    cover:
      "https://charts-static.billboard.com/img/1985/08/freddie-jackson-fqn-180x180.jpg",
    position: {
      positionLastWeek: 29,
      peakPosition: 21,
      weeksOnChart: 7,
    },
  },
  {
    rank: 22,
    title: "Sunset Grill",
    artist: "Don Henley",
    cover:
      "https://charts-static.billboard.com/img/1985/08/don-henley-4ps-106x106.jpg",
    position: {
      positionLastWeek: 26,
      peakPosition: 22,
      weeksOnChart: 8,
    },
  },
  {
    rank: 23,
    title: "And We Danced",
    artist: "Hooters",
    cover:
      "https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif",
    position: {
      positionLastWeek: 28,
      peakPosition: 23,
      weeksOnChart: 11,
    },
  },
  {
    rank: 24,
    title: "Lay Your Hands On Me",
    artist: "Thompson Twins",
    cover:
      "https://charts-static.billboard.com/img/1985/09/thompson-twins-e4m-106x106.jpg",
    position: {
      positionLastWeek: 30,
      peakPosition: 24,
      weeksOnChart: 5,
    },
  },
  {
    rank: 25,
    title: "Freedom",
    artist: "Wham!",
    cover:
      "https://charts-static.billboard.com/img/1978/05/wham-pyz-180x180.jpg",
    position: {
      positionLastWeek: 14,
      peakPosition: 3,
      weeksOnChart: 13,
    },
  },
  {
    rank: 26,
    title: "Love Theme From St. Elmo's Fire (Instrumental)",
    artist: "David Foster",
    cover:
      "https://charts-static.billboard.com/img/1985/08/david-foster-4iu-180x180.jpg",
    position: {
      positionLastWeek: 32,
      peakPosition: 26,
      weeksOnChart: 9,
    },
  },
  {
    rank: 27,
    title: "Never",
    artist: "Heart",
    cover:
      "https://charts-static.billboard.com/img/1986/12/heart-2lh-180x180.jpg",
    position: {
      positionLastWeek: 33,
      peakPosition: 27,
      weeksOnChart: 6,
    },
  },
  {
    rank: 28,
    title: "Who's Zoomin' Who",
    artist: "Aretha Franklin",
    cover:
      "https://charts-static.billboard.com/img/1960/10/aretha-franklin-0r8.jpg",
    position: {
      positionLastWeek: 35,
      peakPosition: 28,
      weeksOnChart: 4,
    },
  },
  {
    rank: 29,
    title: "Separate Lives",
    artist: "Phil Collins and Marilyn Martin",
    cover:
      "https://charts-static.billboard.com/img/1981/03/phil-collins-gz3-180x180.jpg",
    position: {
      positionLastWeek: 37,
      peakPosition: 29,
      weeksOnChart: 3,
    },
  },
  {
    rank: 30,
    title: "Cry",
    artist: "Godley & Creme",
    cover:
      "https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif",
    position: {
      positionLastWeek: 17,
      peakPosition: 16,
      weeksOnChart: 14,
    },
  },
  {
    rank: 31,
    title: "The Way You Do The Things You Do/My Girl",
    artist: "Daryl Hall  John Oates",
    cover:
      "https://charts-static.billboard.com/img/1974/02/daryl-hall-john-oates-o77-180x180.jpg",
    position: {
      positionLastWeek: 20,
      peakPosition: 20,
      weeksOnChart: 8,
    },
  },
  {
    rank: 32,
    title: "Don't Lose My Number",
    artist: "Phil Collins",
    cover:
      "https://charts-static.billboard.com/img/1981/03/phil-collins-gz3-180x180.jpg",
    position: {
      positionLastWeek: 16,
      peakPosition: 4,
      weeksOnChart: 14,
    },
  },
  {
    rank: 33,
    title: "Boy In The Box",
    artist: "Corey Hart",
    cover:
      "https://charts-static.billboard.com/img/1984/05/corey-hart-jx2-180x180.jpg",
    position: {
      positionLastWeek: 36,
      peakPosition: 33,
      weeksOnChart: 6,
    },
  },
  {
    rank: 34,
    title: "Communication",
    artist: "The Power Station",
    cover:
      "https://charts-static.billboard.com/img/1985/09/the-power-station-ebv-106x106.jpg",
    position: {
      positionLastWeek: 34,
      peakPosition: 34,
      weeksOnChart: 7,
    },
  },
  {
    rank: 35,
    title: "Broken Wings",
    artist: "Mr. Mister",
    cover:
      "https://charts-static.billboard.com/img/1985/08/mr-mister-ze5-180x180.jpg",
    position: {
      positionLastWeek: 41,
      peakPosition: 35,
      weeksOnChart: 5,
    },
  },
  {
    rank: 36,
    title: "So In Love",
    artist: "Orchestral Manoeuvres In The Dark",
    cover:
      "https://charts-static.billboard.com/img/1980/07/orchestral-manoeuvres-in-the-dark-1cm-180x180.jpg",
    position: {
      positionLastWeek: 39,
      peakPosition: 36,
      weeksOnChart: 8,
    },
  },
  {
    rank: 37,
    title: "One Of The Living",
    artist: "Tina Turner",
    cover:
      "https://charts-static.billboard.com/img/1985/10/tina-turner-kd3-180x180.jpg",
    position: {
      positionLastWeek: 40,
      peakPosition: 37,
      weeksOnChart: 3,
    },
  },
  {
    rank: 38,
    title: "C-I-T-Y",
    artist: "John Cafferty & The Beaver Brown Band",
    cover:
      "https://charts-static.billboard.com/img/1985/08/john-cafferty-the-beaver-brown-band-go3-106x106.jpg",
    position: {
      positionLastWeek: 22,
      peakPosition: 18,
      weeksOnChart: 11,
    },
  },
  {
    rank: 39,
    title: "St. Elmo's Fire (Man In Motion)",
    artist: "John Parr",
    cover:
      "https://charts-static.billboard.com/img/1985/06/john-parr-m60-106x106.jpg",
    position: {
      positionLastWeek: 27,
      peakPosition: 1,
      weeksOnChart: 18,
    },
  },
  {
    rank: 40,
    title: "Dare Me",
    artist: "The Pointer Sisters",
    cover:
      "https://charts-static.billboard.com/img/1985/07/the-pointer-sisters-aql-180x180.jpg",
    position: {
      positionLastWeek: 31,
      peakPosition: 11,
      weeksOnChart: 15,
    },
  },
  {
    rank: 41,
    title: "Perfect Way",
    artist: "Scritti Politti",
    cover:
      "https://charts-static.billboard.com/img/1984/08/scritti-politti-61f-180x180.jpg",
    position: {
      positionLastWeek: 50,
      peakPosition: 41,
      weeksOnChart: 7,
    },
  },
  {
    rank: 42,
    title: "Girls Are More Fun",
    artist: "Ray Parker Jr.",
    cover:
      "https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif",
    position: {
      positionLastWeek: 52,
      peakPosition: 42,
      weeksOnChart: 3,
    },
  },
  {
    rank: 43,
    title: "The Night Is Still Young",
    artist: "Billy Joel",
    cover:
      "https://charts-static.billboard.com/img/1974/01/billy-joel-9wm-180x180.jpg",
    position: {
      positionLastWeek: 53,
      peakPosition: 43,
      weeksOnChart: 3,
    },
  },
  {
    rank: 44,
    title: "Soul Kiss",
    artist: "Olivia Newton-John",
    cover:
      "https://charts-static.billboard.com/img/1971/05/olivia-newton-john-k57-180x180.jpg",
    position: {
      positionLastWeek: 54,
      peakPosition: 44,
      weeksOnChart: 3,
    },
  },
  {
    rank: 45,
    title: "Weird Science",
    artist: "Oingo Boingo",
    cover:
      "https://charts-static.billboard.com/img/1985/08/oingo-boingo-u7f-180x180.jpg",
    position: {
      positionLastWeek: 45,
      peakPosition: 45,
      weeksOnChart: 8,
    },
  },
  {
    rank: 46,
    title: "I Miss You",
    artist: "Klymaxx",
    cover:
      "https://charts-static.billboard.com/img/1985/09/klymaxx-b0a-106x106.jpg",
    position: {
      positionLastWeek: 49,
      peakPosition: 46,
      weeksOnChart: 6,
    },
  },
  {
    rank: 47,
    title: "Tonight It's You",
    artist: "Cheap Trick",
    cover:
      "https://charts-static.billboard.com/img/1977/09/cheap-trick-ovr-180x180.jpg",
    position: {
      positionLastWeek: 44,
      peakPosition: 44,
      weeksOnChart: 13,
    },
  },
  {
    rank: 48,
    title: "Born In East L.A.",
    artist: "Cheech & Chong",
    cover:
      "https://charts-static.billboard.com/img/1985/09/cheech-chong-02i-106x106.jpg",
    position: {
      positionLastWeek: 48,
      peakPosition: 48,
      weeksOnChart: 5,
    },
  },
  {
    rank: 49,
    title: "Sleeping Bag",
    artist: "ZZ Top",
    cover:
      "https://charts-static.billboard.com/img/1972/05/zz-top-fsz-180x180.jpg",
    position: {
      positionLastWeek: null,
      peakPosition: 49,
      weeksOnChart: 1,
    },
  },
  {
    rank: 50,
    title: "The Power Of Love",
    artist: "Huey Lewis & The News",
    cover:
      "https://charts-static.billboard.com/img/1985/06/huey-lewis-the-news-iqy-106x106.jpg",
    position: {
      positionLastWeek: 38,
      peakPosition: 1,
      weeksOnChart: 17,
    },
  },
];

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
  //console.log(user_id);

  const playlist = await fetchWebApi(`v1/users/${user_id}/playlists`, "POST", {
    name: "My top tracks playlist",
    description: "Playlist created by the tutorial on developer.spotify.com",
    public: false,
  });

  //console.log(playlist);

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
    "POST"
  );

  return playlist;
}

function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16);
  });
}

async function searchTracks() {
  var uriArray = [];
  for (let i = 0; i < songArray.length; i++) {
    var artist = songArray[i].artist;
    var track = songArray[i].title.replace(/\s*\(.*?\)\s*/g, "").trim();

    /*const response = await fetchWebApi(
      "v1/search?offset=1&limit=1&query=track%253AFour%2520In%2520The%2520Morning%2520%2528I%2520Can%2527t%2520Take%2520Anymore%2529%2520artist%253ANight%2520Ranger&type=track&market=US&locale=en-US,en;q%3D0.5",
      "GET"
    );*/
    const response = await fetchWebApi(
      `v1/search?q=track:${track} artist:${artist}&type=track&market=US&limit=1&offset=0`,
      "GET"
    );
    try {
      uriArray.push(response.tracks.items[0].uri);
    } catch (error) {
      console.log("Couldn't add track: " + track + " artist: " + artist);
    }
  }

  return uriArray;
}

async function main() {
  //const createdPlaylist = await createPlaylist(tracksUri);
  const uriArray = await searchTracks();
  //console.log(uriArray);
  /*
  console.log(JSON.stringify(track, null, 4));
  console.log(track.tracks.items[0].uri);
  console.log(process.env.CLIENT_ID);
  */
  const createdPlaylist = await createPlaylist(uriArray);
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
