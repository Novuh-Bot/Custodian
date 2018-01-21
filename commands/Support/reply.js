const Support = require('../../base/Support.js');

class Reply extends Support {
  constructor(client) {
    super(client, {
      name: 'reply',
      description: 'Support Guild use only.',
      usage: 'reply <message>',
      category: 'System',
      extended: 'Responds to a support channel.',
      hidden: true,
      guildOnly: true,
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'Bot Support'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.getSettings(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    const user = message.channel.topic;
    const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) return message.channel.send('Not a valid support channel.');
    const id = match[1];
    const target = await this.client.fetchUser(id);
    const msg = args.join(' ');
    const embed = this.client.supportMsg(message, msg);
    try {
      const consent = this.client.consent.get(id);
      !consent ? message.channel.send('You cannot contact this user until they consent.') : target.send({embed});
    } catch (error) {
      if (error.message === 'Cannot send messages to this user') {
        await message.channel.send(`I cannot send that message ${message.author.username}, as it appears they may have **Direct Messages's** disabled.`);
      } else {
        throw error;
      }
    }
  }
}

module.exports = Reply;