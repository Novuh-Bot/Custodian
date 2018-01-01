const Support = require('../../base/Support.js');

class Contact extends Support {
  constructor(client) {
    super(client, {
      name: 'contact',
      description: 'Contact Bot Support.',
      usage: 'contact <message>',
      category: 'Support',
      extended: 'This command will forward your Support DM to the Support Guild, your consent is **required** to use this command.',
      aliases: ['dm', 'support'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    if (message.guild) return message.reply('This command can only be used in DM\'s');
    const msg = args.join(' ');
    if (msg.length < 1) throw 'You must type a message to send.';
    try {
      this.checkConsent(this.client, message, msg);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Contact;