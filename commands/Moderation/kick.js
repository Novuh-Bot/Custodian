const Moderation = require('../../base/Moderation.js');

class Kick extends Moderation {
  constructor(client) {
    super(client, {
      name: 'kick',
      description: 'Kicks a mentioned user.',
      usage: 'kick <member:user> [reason:string]',
      extended: 'This kicks the mentioned user, with or without a reason.',
      category: 'Moderation',      
      aliases: ['toss', 'boot', 'throw'],
      botPerms: ['SEND_MESSAGES', 'KICK_MEMBERS', 'EMBED_LINKS'],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.settings.get(message.guild.id);

    const channel  = message.guild.channels.exists('name', settings.modLogChannel);
    if (!channel)    throw `${message.author}, I cannot find the \`${settings.modLogChannel}\` channel. Try running \`${settings.prefix}set edit modLogChannel logs\`.`;
    const target   = await this.verifyMember(message.guild, args[0]);
    if (!target)     return message.lang(message, settings.lang, this.help.category, 'incorrectModCmdUsage');
    const modLevel = this.modCheck(message, args[0], level);
    if (typeof modLevel === 'string') return message.reply(modLevel);
    const reason   = args.splice(1, args.length).join(' ');
    try {
      await target.kick({reason: reason.length < 1 ? 'No reason supplied.': reason});
      await this.buildModLog(this.client, message.guild, 'k', target, message.author, reason);
      await message.channel.send(`\`${target.user.tag}\` was successfully kicked.`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Kick;