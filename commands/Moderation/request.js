const Moderation = require('../../base/Moderation.js');
const { RichEmbed } = require('discord.js');

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
    const user = message.author;
    const action = args[0];
    if (!action) throw `${message.author} |\`❌\`| Invalid command usage, you must supply an action to use this 
    command.`;
    const reason = args.splice(1, args.length).join(' ');
    if (!reason) `${message.author} |\`❌\`| Invalid command usage, you must supply a reason to use this command.`;
    const request = `= Action Requested =\n\n[Requested by ${user.username}#${user.discriminator}]\n\n== Action ==\n${action}\n\n== Reason == \n${reason}`; 
    const channel = message.guild.channels.find('name', settings.requestChannel).send(`${request}`, {code:'asciidoc'});
  }
}

module.exports = Request;