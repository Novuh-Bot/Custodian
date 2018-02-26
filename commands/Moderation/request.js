const Moderation = require('../../base/Moderation.js');

class Request extends Moderation {
  constructor(client) {
    super(client, {
      name: 'request',
      description: 'Requests a moderation action.',
      usage: 'request <action:string> <reason:string>',
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
    const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    const action = args[0];
    const author = message.author.tag;
    if (!action) return message.lang(message, lang, this.help.category, 'requestNoActn');
    const reason = args.splice(1, args.length).join(' ');
    if (!reason) return message.lang(message, lang, this.help.category, 'modNoReason');
    try {
      await this.buildRequest(this.client, message.guild, author, action, reason);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Request;