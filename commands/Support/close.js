const Support = require('../../base/Support.js');

class Close extends Support {
  constructor(client) {
    super(client, {
      name: 'close',
      description: 'Closes a support ticket.',
      extended: 'Closes a support ticket for a certain user.',
      usage: 'close',
      hidden: true,
      guildOnly: true,
      category: 'Support',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'Bot Support'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    const user   = message.channel.topic;
    const match  = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) return message.channel.send('Not a valid support channel');
    const id     = match[1];
    const target = await this.client.fetchUser(id);
    const msg    = 'This is an automated response letting you know that this ticket is being closed.\nIf you need more support with this issue, please open a new ticket.';
    const embed  = this.client.supportMsg(message, msg);
    try {
      const consent = this.client.consent.get(id);
      !consent ? message.channel.send('I cannot contact this user until they consent.') : target.send({ embed });
    } catch (error) {
      if (error.message === 'Cannot send messages to this user') {
        await message.channel.send(`I cannot send that message ${message.author.username}, as it appears they have **Direct Messages** disabled.`);
      } else {
        throw error;
      }
    }
  }
}

module.exports = Close;