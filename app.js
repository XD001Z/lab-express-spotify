require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

 
 spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  
// Our routes go here:
app.get('/', (req, res) => {
res.render("index.hbs")
})

app.get('/albums/:artistId', (req, res, next) => {
    let { artistId } = req.params
    spotifyApi
        .getArtistAlbums(artistId)
        .then((data) => {
            let artistAlbums = data.body.items
            res.render(`albums.hbs`, {artistAlbums})
        })
        .catch((err) => {
            console.log('An error occurred: ', err);
        })
})

app.get('/artist-search', (req, res, next) => {
    let { search } = req.query
    spotifyApi
        .searchArtists(search)
        .then((data) => {
            let artistsFromApi = data.body.artists.items;
            res.render('artist-search-results.hbs', {artistsFromApi});
        })
        .catch((err) => {
            console.log('An error occurred: ', err);
        })
})

app.get('/tracks/:albumId', (req, res, next) => {
    let { albumId } = req.params
    spotifyApi
        .getAlbumTracks(albumId)
        .then((data) => {
            let albumTracks = data.body.items
            res.render('tracks.hbs', {albumTracks})
        })
        .catch((err) => {
            console.log('An error occurred: ', err);
        })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
