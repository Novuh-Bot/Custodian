const Command = require('../../base/Command.js');

class Contact extends Command {
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
    if (message.guild) return message.reply('This command can only be used in DM\'s');
    const msg = args.join(' ');
    if (msg.length < 1) throw 'You must type a message to send.';
    try {
      this.client.checkConsent(this.client, message, msg);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Contact;