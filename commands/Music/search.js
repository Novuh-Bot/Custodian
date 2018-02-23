const Command = require('../../base/Command.js');
const config = require('../../config.js');
const ytapi = require('simple-youtube-api');
const youtube = new ytapi(config.youtubeAPIKey);


class Search extends Command {
  constructor(client) {
    super(client, {
      name: 'search',
      description: 'Searches for a YouTube video.',
      category: 'Music',
      guildOnly: 'true',
      usage: 'search <term:string>',
      permLevel: 'User',
      cooldown: 30
    });
  }

  async run(message, args, level) {
    const search = args.join(' ');
    try {
      const results = await youtube.searchVideos(search, 5);
      return message.channel.send(`Top 5 Results\n\n🎧 ${results.map(i => `${i.title}\n🔗 https://www.youtube.com/watch?v=${i.id}\n`).join('\n🎧 ')}`, {code: 'asciidoc'}).catch(error => console.log(error));
    } catch (e) {
      message.reply(e.message);
    }
  } 
}

module.exports = Search;