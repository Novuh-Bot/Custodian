const Command = require('../../base/Command.js');
const { Attachment } = require('discord.js');

class Thesearch extends Command {
  constructor(client) {
    super(client, {
      name: 'thesearch',
      description: 'Searches the universe..',
      category: 'Canvas',
      usage: 'thesearch [member:user] <text:string>',
      botPerms: ['ATTACH_FILES']
    });
  }

  async run(message, args, level) {
    const text = args.slice(1).join(' ');
    if (text.length < 1) return message.channel.send('What\'s the guy saying?');
    try {
      await message.channel.send(new Attachment(await this.client.api.theSearch((message.mentions.users.first() || message.author).displayAvatarURL, text), 'thesearch.png'));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Thesearch;