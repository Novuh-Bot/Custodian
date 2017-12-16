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
    const action = args[0];
    if (!action) throw `${message.author} |\`❌\`| Invalid command usage, you must supply an action to use this 
    command.`;
    const reason = args.splice(1, args.length).join(' ');
    if (!reason) `${message.author} |\`❌\`| Invalid command usage, you must supply a reason to use this command.`;
    try {
      await this.buildRequest(this.client, message.guild, action, reason);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Request;