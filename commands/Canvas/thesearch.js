const Command = require('../../base/Command.js');
const { Attachment } = require('discord.js');

class Achievement extends Command {
  constructor(client) {
    super(client, {
      name: 'achievement',
      description: 'Creates an Achievement.',
      category: 'Canvas',
      usage: 'achievement',
      extended: 'Either mention a user with text to give the achievement their user avatar, or just supply text for your own achievement.',
      aliases: ['search'],
      botPerms: ['ATTACH_FILES']
    });
  }

  async run(message, args, level) {
    const text = args.slice(1).join(' ');
    if (text.length < 1) return message.channel.send('What\'s the guy saying?');
    try {
      await message.channel.send(new Attachment(await this.client.api.thesearch((message.mentions.users.first() || message.author).displayAvatarURL, text), 'thesearch.png'));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Achievement;