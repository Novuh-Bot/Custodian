const Command = require('../../base/Command.js');

class Slap extends Command {
  constructor(client) {
    super(client, {
      name: 'slap',
      description: 'Slaps a mentioned user',
      extended: 'Slaps the user that you mentioned.',
      category: 'Fun',
      usage: 'slap <@mention>',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}.json`);
    const target = message.mentions.users.first();
    if (message.mentions.users.first() < 1) return message.reply(`${lang.slapNoMntn}`);
    message.channel.send(`${message.author.username} slapped ${target}. OOOOOOOO`);
  }
}

module.exports = Slap;