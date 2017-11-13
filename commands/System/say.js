const Command = require('../../base/Command.js');

class Say extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      description: 'Make the bot say something.',
      usage: 'say [#channel] <message>',
      category: 'System',
      extended: 'You can send a message to another channel via this command.',
      aliases: ['speak'],
      botPerms: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      permLevel: 'Bot Support'
    });
  }

  async run(message, args, level) {
    if (args.length < 1) throw 'You need to give the bot a message to send.';
    try {
      message.delete();
      const channelid = await this.verifyChannel(message, args[0]);
      if (channelid !== message.channel.id) {
        args.shift();
      }
      const channel = message.guild.channels.get(channelid);
      channel.startTyping();
      setTimeout(() => {
        channel.send(args.join(' '));
        channel.stopTyping(true);
      }, 100 * args.join(' ').length /2);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Say;