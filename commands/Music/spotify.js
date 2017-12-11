const Command = require('../../base/Command.js');
const SpotifyWebApi = require('spotify-web-api-node');

class Spotify extends Command {
  constructor(client) {
    super(client, {
      name: 'spotify',
      description: 'Fetch information on various things about Spotify',
      category: 'Music',
      usage: 'spotify < -al | -ar | -t | -aln | -arn | -tn > <Spotify ID | Name>',
      guildOnly: false,
      extended: 'Search Spotify for a(n) track, artist, or album by either the Spotify ID or the name.',
      botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const flag = args[0];
    const spotifyApi = new SpotifyWebApi({
      clientId: 'c16df212acf340e286053b8175e11b11',
      clientSecret: 'c7cf9e2cb4b7490a9438835c686ef7bd' 
    });

    if (flag === 'al') {
      spotifyApi.clientCredentialsGrant()
        .then(function(data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);

          spotifyApi.setAccessToken(data.body['access_token']);
          spotifyApi.getAlbum([`${args[0]}`])
            .then(function(data) {
              console.log('Album Information:', data.body);
              message.channel.send('Album Info:', data.body);
            }, function(err) {
              console.error(err);
            });
        }, function(err) {
          console.log('Something went wrong when retrieving an access token', err);
        });
    } else if (flag === 'ar') {
      spotifyApi.clientCredentialsGrant()
        .then(function(data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);

          spotifyApi.setAccessToken(data.body['access_token']);
          spotifyApi.getArtist([`${args[0]}`])
            .then(function(data) {
              console.log('Artist Information:', data.body);
              message.channel.send('Artists Info:', data.body);
            }, function(err) {
              console.error(err);
            });
        }, function(err) {
          console.log('Something went wrong when retrieving an access token', err);
        });
    }
  }
}

module.exports = Spotify;