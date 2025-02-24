require("dotenv").config();
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = process.env.ACCESS_TOKEN;

const songArray = [
  {
    rank: 1,
    title: "We've Only Just Begun",
    artist: "Carpenters",
    cover:
      "https://charts-static.billboard.com/img/1970/09/carpenters-s0f-180x180.jpg",
    position: {
      positionLastWeek: 1,
      peakPosition: 1,
      weeksOnChart: 5,
    },
  },
  {
    rank: 2,
    title: "It's Only Make Believe",
    artist: "Glen Campbell",
    cover:
      "https://charts-static.billboard.com/img/1961/10/glen-campbell-yvp-180x180.jpg",
    position: {
      positionLastWeek: 3,
      peakPosition: 2,
      weeksOnChart: 6,
    },
  },
  {
    rank: 3,
    title: "Cracklin' Rosie",
    artist: "Neil Diamond",
    cover:
      "https://charts-static.billboard.com/img/1966/05/neil-diamond-4va-106x106.jpg",
    position: {
      positionLastWeek: 2,
      peakPosition: 2,
      weeksOnChart: 8,
    },
  },
  {
    rank: 4,
    title: "Sweetheart",
    artist: "Engelbert Humperdinck",
    cover:
      "https://charts-static.billboard.com/img/1970/09/engelbert-humperdinck-tdy-106x106.jpg",
    position: {
      positionLastWeek: 17,
      peakPosition: 4,
      weeksOnChart: 3,
    },
  },
  {
    rank: 5,
    title: "Look What They've Done To My Song Ma",
    artist: "The New Seekers",
    cover:
      "https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif",
    position: {
      positionLastWeek: 5,
      peakPosition: 4,
      weeksOnChart: 7,
    },
  },
  {
    rank: 6,
    title: "El Condor Pasa (If I Could)",
    artist: "Simon & Garfunkel",
    cover:
      "https://charts-static.billboard.com/img/1970/09/simon-garfunkel-4hb-180x180.jpg",
    position: {
      positionLastWeek: 7,
      peakPosition: 6,
      weeksOnChart: 5,
    },
  },
  {
    rank: 7,
    title: "Something",
    artist: "Shirley Bassey",
    cover:
      "https://charts-static.billboard.com/img/1970/09/shirley-bassey-pls-180x180.jpg",
    position: {
      positionLastWeek: 22,
      peakPosition: 7,
      weeksOnChart: 6,
    },
  },
  {
    rank: 8,
    title: "SNOWBIRD",
    artist: "Anne Murray",
    cover:
      "https://charts-static.billboard.com/img/1970/07/anne-murray-zsk-180x180.jpg",
    position: {
      positionLastWeek: 4,
      peakPosition: 1,
      weeksOnChart: 16,
    },
  },
  {
    rank: 9,
    title: "Pieces Of Dreams",
    artist: "Johnny Mathis",
    cover:
      "https://charts-static.billboard.com/img/1970/09/johnny-mathis-5xg-106x106.jpg",
    position: {
      positionLastWeek: 9,
      peakPosition: 9,
      weeksOnChart: 6,
    },
  },
  {
    rank: 10,
    title: "And The Grass Won't Pay No Mind",
    artist: "Mark Lindsay",
    cover:
      "https://charts-static.billboard.com/img/1970/09/mark-lindsay-xo2-180x180.jpg",
    position: {
      positionLastWeek: 19,
      peakPosition: 10,
      weeksOnChart: 3,
    },
  },
  {
    rank: 11,
    title: "Joanne",
    artist: "Michael Nesmith",
    cover:
      "https://charts-static.billboard.com/img/1970/08/michael-nesmith-3cm-106x106.jpg",
    position: {
      positionLastWeek: 10,
      peakPosition: 6,
      weeksOnChart: 9,
    },
  },
  {
    rank: 12,
    title: "Ain't No Mountain High Enough",
    artist: "Diana Ross",
    cover:
      "https://charts-static.billboard.com/img/1970/08/diana-ross-l90-aint-no-mountain-high-enough-e16-180x180.jpg",
    position: {
      positionLastWeek: 11,
      peakPosition: 6,
      weeksOnChart: 10,
    },
  },
  {
    rank: 13,
    title: "It Don't Matter To Me",
    artist: "Bread",
    cover:
      "https://charts-static.billboard.com/img/1970/09/bread-xta-106x106.jpg",
    position: {
      positionLastWeek: 28,
      peakPosition: 13,
      weeksOnChart: 2,
    },
  },
  {
    rank: 14,
    title: "Make It Easy On Yourself",
    artist: "Dionne Warwick",
    cover:
      "https://charts-static.billboard.com/img/1970/10/dionne-warwick-6mm-180x180.jpg",
    position: {
      positionLastWeek: 34,
      peakPosition: 14,
      weeksOnChart: 2,
    },
  },
  {
    rank: 15,
    title: "Candida",
    artist: "Dawn",
    cover:
      "https://charts-static.billboard.com/img/1970/07/tony-orlando-dawn-f7j-180x180.jpg",
    position: {
      positionLastWeek: 8,
      peakPosition: 8,
      weeksOnChart: 8,
    },
  },
  {
    rank: 16,
    title: "Out In The Country",
    artist: "Three Dog Night",
    cover:
      "https://charts-static.billboard.com/img/1970/08/three-dog-night-e8f-out-in-the-country-u9n-180x180.jpg",
    position: {
      positionLastWeek: 32,
      peakPosition: 16,
      weeksOnChart: 5,
    },
  },
  {
    rank: 17,
    title: "Fire And Rain",
    artist: "James Taylor",
    cover:
      "https://charts-static.billboard.com/img/1970/09/james-taylor-ppd-fire-and-rain-q9c-180x180.jpg",
    position: {
      positionLastWeek: 31,
      peakPosition: 17,
      weeksOnChart: 4,
    },
  },
  {
    rank: 18,
    title: "For The Good Times",
    artist: "Ray Price",
    cover:
      "https://charts-static.billboard.com/img/1970/06/ray-price-whk-155x155.jpg",
    position: {
      positionLastWeek: 12,
      peakPosition: 12,
      weeksOnChart: 10,
    },
  },
  {
    rank: 19,
    title: "Julie, Do Ya Love Me",
    artist: "Bobby Sherman",
    cover:
      "https://charts-static.billboard.com/img/1970/08/bobby-sherman-mom-180x180.jpg",
    position: {
      positionLastWeek: 6,
      peakPosition: 2,
      weeksOnChart: 12,
    },
  },
  {
    rank: 20,
    title: "Long Long Time",
    artist: "Linda Ronstadt",
    cover:
      "https://charts-static.billboard.com/img/1970/08/linda-ronstadt-tv1-longlongtime-0qx-180x180.jpg",
    position: {
      positionLastWeek: 20,
      peakPosition: 20,
      weeksOnChart: 6,
    },
  },
  {
    rank: 21,
    title: "One More Ride On The Merry-Go-Round",
    artist: "Peggy Lee",
    cover:
      "https://charts-static.billboard.com/img/1970/10/peggy-lee-55r-180x180.jpg",
    position: {
      positionLastWeek: 21,
      peakPosition: 21,
      weeksOnChart: 3,
    },
  },
  {
    rank: 22,
    title: "The Song Is Love",
    artist: "Petula Clark",
    cover:
      "https://charts-static.billboard.com/img/1970/09/petula-clark-8rd-155x155.jpg",
    position: {
      positionLastWeek: 29,
      peakPosition: 22,
      weeksOnChart: 4,
    },
  },
  {
    rank: 23,
    title: "Why Don't They Understand",
    artist: "Bobby Vinton",
    cover:
      "https://charts-static.billboard.com/img/1970/09/bobby-vinton-8lg-180x180.jpg",
    position: {
      positionLastWeek: 24,
      peakPosition: 23,
      weeksOnChart: 4,
    },
  },
  {
    rank: 24,
    title: "For What It's Worth",
    artist: "Sergio Mendes & Brasil '66",
    cover:
      "https://charts-static.billboard.com/img/1966/08/sergio-mendes-wxo-106x106.jpg",
    position: {
      positionLastWeek: 15,
      peakPosition: 10,
      weeksOnChart: 8,
    },
  },
  {
    rank: 25,
    title: "I (Who Have Nothing)",
    artist: "Tom Jones",
    cover:
      "https://charts-static.billboard.com/img/1965/04/tom-jones-or5-180x180.jpg",
    position: {
      positionLastWeek: 14,
      peakPosition: 2,
      weeksOnChart: 9,
    },
  },
  {
    rank: 26,
    title: "Measure The Valleys",
    artist: "The Keith Textor Singers",
    cover:
      "https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif",
    position: {
      positionLastWeek: 26,
      peakPosition: 26,
      weeksOnChart: 5,
    },
  },
  {
    rank: 27,
    title: "That's Where I Went Wrong",
    artist: "The Poppy Family",
    cover:
      "https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif",
    position: {
      positionLastWeek: 16,
      peakPosition: 7,
      weeksOnChart: 9,
    },
  },
  {
    rank: 28,
    title: "Mellow Dreaming",
    artist: "Young-Holt Unlimited",
    cover:
      "https://charts-static.billboard.com/img/1967/01/young-holt-unlimited-h0b-180x180.jpg",
    position: {
      positionLastWeek: 18,
      peakPosition: 18,
      weeksOnChart: 6,
    },
  },
  {
    rank: 29,
    title: "Our House",
    artist: "Crosby, Stills, Nash & Young",
    cover:
      "https://charts-static.billboard.com/img/1970/09/crosby-stills-nash-young-000-ourhouse-ikz-180x180.jpg",
    position: {
      positionLastWeek: 37,
      peakPosition: 29,
      weeksOnChart: 3,
    },
  },
  {
    rank: 30,
    title: "Sunday Morning Coming Down",
    artist: "Johnny Cash",
    cover:
      "https://charts-static.billboard.com/img/1958/08/johnny-cash-av0-180x180.jpg",
    position: {
      positionLastWeek: 13,
      peakPosition: 13,
      weeksOnChart: 8,
    },
  },
  {
    rank: 31,
    title: "I Climbed The Mountain",
    artist: "Jerry Vale",
    cover:
      "https://charts-static.billboard.com/img/1970/09/jerry-vale-srt-180x180.jpg",
    position: {
      positionLastWeek: 27,
      peakPosition: 27,
      weeksOnChart: 5,
    },
  },
  {
    rank: 32,
    title: "Woodstock",
    artist: "The Assembled Multitude",
    cover:
      "https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif",
    position: {
      positionLastWeek: 33,
      peakPosition: 32,
      weeksOnChart: 2,
    },
  },
  {
    rank: 33,
    title: "I'll Be There",
    artist: "The Jackson 5",
    cover:
      "https://charts-static.billboard.com/img/1970/10/the-jacksons-34u-180x180.jpg",
    position: {
      positionLastWeek: null,
      peakPosition: 33,
      weeksOnChart: 1,
    },
  },
  {
    rank: 34,
    title: "Up On The Roof",
    artist: "Laura Nyro",
    cover:
      "https://charts-static.billboard.com/img/1970/10/laura-nyro-rmp-106x106.jpg",
    position: {
      positionLastWeek: 36,
      peakPosition: 34,
      weeksOnChart: 3,
    },
  },
  {
    rank: 35,
    title: "I Just Wanna Keep It Together",
    artist: "Paul Davis",
    cover:
      "https://charts-static.billboard.com/img/1970/09/paul-davis-6mn-180x180.jpg",
    position: {
      positionLastWeek: 39,
      peakPosition: 35,
      weeksOnChart: 3,
    },
  },
  {
    rank: 36,
    title: "I Think I Love You",
    artist: "The Partridge Family",
    cover:
      "https://charts-static.billboard.com/img/1970/10/the-partridge-family-d94-180x180.jpg",
    position: {
      positionLastWeek: null,
      peakPosition: 36,
      weeksOnChart: 1,
    },
  },
  {
    rank: 37,
    title: "Montego Bay",
    artist: "Bobby Bloom",
    cover:
      "https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif",
    position: {
      positionLastWeek: 38,
      peakPosition: 37,
      weeksOnChart: 2,
    },
  },
  {
    rank: 38,
    title: "Pieces Of Dreams",
    artist: "Ferrante & Teicher",
    cover:
      "https://charts-static.billboard.com/img/1970/10/ferrante-teicher-r8c-180x180.jpg",
    position: {
      positionLastWeek: null,
      peakPosition: 38,
      weeksOnChart: 1,
    },
  },
  {
    rank: 39,
    title: "Lucretia Mac Evil",
    artist: "Blood, Sweat & Tears",
    cover:
      "https://charts-static.billboard.com/img/1970/10/blood-sweat-tears-f9z-106x106.jpg",
    position: {
      positionLastWeek: null,
      peakPosition: 39,
      weeksOnChart: 1,
    },
  },
  {
    rank: 40,
    title: "Knock, Knock Who's There",
    artist: "Andra Willis",
    cover:
      "https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif",
    position: {
      positionLastWeek: 40,
      peakPosition: 40,
      weeksOnChart: 2,
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
    name: "Top Pop Tracks 10-17-1970",
    description: "Playlist created by Billboard rewind",
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
    var rank = songArray[i].rank;

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
      console.log(
        "Couldn't add track: " + track + " artist: " + artist + " rank: " + rank
      );
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
  console.log(createdPlaylist.name, createdPlaylist.id);
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  }
);
// console.log(createdPlaylist.name, createdPlaylist.id);
