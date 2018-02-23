const Command = require('../../base/Command.js');
const { twitchId, twitchSecret } = require('../../config.js');
const twitch = new (require('twitch.tv-api'))({id: twitchId, secret: twitchSecret});
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
    const data = await twitch.getUser(user);
    if (data.stream === null) {
      message.reply('Due to the limitations of the Twitch API, I cannot get information on an offline user. We apologize for the inconvience.');
    } else {
      const embed = new RichEmbed()
        .setAuthor(data.stream.channel.display_name, data.stream.channel.logo, data.stream.channel.url)
        .setTitle(data.stream.channel.status)
        .setThumbnail(data.stream.channel.logo)
        .setImage(data.stream.preview.large)
        .setURL(data.stream.channel.url)
        .addField('Category', data.stream.channel.game, true)
        .addField('Viewers', data.stream.viewers, true);
      message.channel.send({ embed });
    }
  }
}

module.exports = Twitch;