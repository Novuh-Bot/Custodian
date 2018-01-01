const Moderation = require('../../base/Moderation.js');

class Request extends Moderation {
  constructor(client) {
    super(client, {
      name: 'request',
      description: 'Requests a moderation action.',
      usage: 'request <action type> <reason>',
      category: 'Moderation',
      extended: 'This command can be used to request a moderation action. The request then gets sent to a review channel if setup.',
      aliases: [],
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    const action = args[0];
    if (!action) throw `${message.author} |\`❌\`| ${lang.requestNoActn}`;
    const reason = args.splice(1, args.length).join(' ');
    if (!reason) `${message.author} |\`❌\`| ${lang.modNoReason}`;
    try {
      await this.buildRequest(this.client, message.guild, action, reason);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Request;