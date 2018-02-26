const Command = require('../../base/Command.js');
const { RichEmbed } = require('discord.js');

class Twitch extends Command {
  constructor(client) {
    super(client, {
      name: 'twitch',
      description: 'Get stats about a user on Twitch.',
      category: 'Fun',
      usage: 'twitch <user:stream name>',
      botPerms: ['EMBED_LINKS', 'SEND_MESSAGES'],
      permLevel: 'User',
      cooldown: 60
    });
  }

  async run(message, [user], level) {
    const twitchId = this.client.config.twitchCredentials.id;
    const twitchSecret = this.client.config.twitchCredentials.secret;
    const twitch = new (require('twitch.tv-api'))({id: twitchId, secret: twitchSecret});    
    const data = await twitch.getUser(user);
    if (data.stream === null) {
      message.reply('Due to the limitations of the Twitch API, I cannot get information on an offline user. We apologize for the inconvience.');
    } else {
      message.buildEmbed()
        .setAuthor(data.stream.channel.display_name, data.stream.channel.logo, data.stream.channel.url)
        .setTitle(data.stream.channel.status)
        .setThumbnail(data.stream.channel.logo)
        .setImage(data.stream.preview.large)
        .setURL(data.stream.channel.url)
        .addField('Category', data.stream.channel.game, true)
        .addField('Viewers', data.stream.viewers, true)
        .send();
    }
  }
}

module.exports = Twitch;