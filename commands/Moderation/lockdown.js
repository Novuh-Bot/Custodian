const Moderation = require('../../base/Moderation.js');
const ms = require('ms');

class Lockdown extends Moderation {
  constructor(client) {
    super(client, {
      name: 'lockdown',
      description: 'Locks down a channel.',
      usage: 'lockdown <time:integer>',
      category: 'Moderation',
      extended: 'Revokes chat permissions in a channel.',
      aliases: ['ld'],
      botPerms: ['MANAGE_CHANNELS', 'SEND_MESSAGES'],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) {
    const { lang } = this.client.settings.get(message.guild.id);

    const time = args.join(' ');
    if (!time) return message.lang(message, lang, this.help.category, 'lockdownNoTime');
    message.channel.lock(this.client, message, time); 
  }
}

module.exports = Lockdown;