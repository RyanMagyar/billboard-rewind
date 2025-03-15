# Playlist Rewind - Spotify Playlist Generator

Playlist Rewind is a site where users can view various [Billboard.com](https://www.billboard.com/) charts for given dates. After connecting a Spotify account, users can then convert the given Billboard chart to a Spotify playlist.

The site is currently awaiting approval from Spotify for access to public users.

Here is a short demo video for the site in the meantime: [Demo Video](https://www.youtube.com/watch?v=pB3O7KRWSqs)

# How It Works:

The site scraps chart metadata from Billboard.com for a given chart and date. If a Spotify account is connected and a playlist is requested, the site uses Spotify's search API to search for each song on spotify. If it can find the song, the song is added to a new playlist on the user's account in the order that it appeared on the chart. Songs that couldn't be found on Spotify are displayed to users after the search is complete. A link to the user's new playlist on Spotify is also displayed.

# How It's Made:

**Tech Used:** ReactJs, Jsx, TailwindCSS, Javascript, Node.js, SQL, Express, Postgres, Jest, Supertest, Docker

### Front end:

The front end is built with ReactJs using ShadCN and custom components with TailwindCSS styling. Users select a chart and date from the Select and DatePicker components. DatePicker ranges are restricted to the date of the first chart for the given genre e.g. The first "Rock" chart was released on March 3, 1981. Pressing the "Get Chart Data" button makes a call to my backend API which returns the chart metadata for the the selected chart and date. If no Spotify account is connected, users will see a "Connect Spotify" button above the chart. Pressing this button will redirect users to Spotify's account login page where they must login and grant the required permissions for the application which are, user-read-private, user-read-email, and  playlist-modify-private. After an account is connected the "Connect Spotify" button is replaced with a "Create Playlist" button. Both the "Create Playlist" and "Get Chart Data" buttons are disabled if the appropriate data is not present. Pressing "Create Playlist" will make a call to my backend API; a loading spinner is displayed while the playlist creation is in progress. When the response from the API is received, the user will see a "View Your Playlist on Spotify" button linking to the new playlist. A table of the songs that couldn't be added to the playlist will also be displayed to the user.

### Back end:

The back end is built using Node.js and the Express web application framework. Routes are diveded into auth, charts, and playlist. Auth routes handle checking a user's session, logging a user in to Spotify, as well as the necessary callback route for Spotify's oauth. Spotify access and refresh tokens are stored in encrypted http-only cookies. The chart route handles getting the Billboard chart data for the given date and chart. It uses the "billboard-top-100" library to scrap the data from Billboard.com and sends a JSON response to the client with the chart data. This route also implements caching for already requested charts. Charts are stored in a Postgres database with their associated date and genre.

The playlist route handles song searching and playlist creation. This route also uses a helper function to refresh the user's Spotify access token when needed. Song searching is done using Spotify's /search endpoint with various filters. The searchTracks helper function uses multiple search methods to try and find the correct track on Spotify given the tracks name, artist, and year from the Billboard metadata. The search begins with the strictest possible search - filterting based on the name, artist, and a +/- 1 year window of the given chart. If the song can't be found with this criteria then search is expanded to without the year filter, checking if the track is a collaboration and searching each artist, and accepting live versions of the track. Songs that still can't be found are added to an array that is sent in the response to the client. The most common reason for a track not being able to be found is that it simply isn't on Spotify, but there are also cases where artists'/tracks' names have changed and aren't able to be easily found with the Spotify search API. Songs that were found have their spotify URI added to an array and are sent to the createPlaylist helper function which creates a private playlist with the found tracks and name in the form "Top 'CHART NAME' Tracks 'DATE'".

This route also implements caching for both entire charts and for songs. Before Spotify's search API is used, a check is made against the Postgres database to see whether this specific chart has been requested as a spotify playlist before. If it has been, then that chart's Spotify data is used to create a playlist without any calls to the Spotify API. If the entire chart isn't cached, then the route checks whether the song itself is cached in the database. If it is, then the song's data is added to the apropriate array without any calls to the Spotify API. Both songs and charts are cached in the database when not already present.

Unit tests for the API and database interactions are written with Jest and Supertest with a temporary database.
