const Social = require('../../base/Command.js');
const { Attachment } = require('discord.js');

class Beautiful extends Social {
  constructor(client) {
    super(client, {
      name: 'beautiful',
      description: 'Call someone beautiful.',
      category: 'Canvas',
      usage: 'beautiful <member:user>',
      aliases: ['pretty', 'ooh'],
      botPerms: ['ATTACH_FILES']
    });
  }

  async run(message, args, level) {
    try {
      await message.channel.send(new Attachment(await this.client.api.beautiful((message.mentions.users.first() || message.author).displayAvatarURL), 'beautiful.png'));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Beautiful;