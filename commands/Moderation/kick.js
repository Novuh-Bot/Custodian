const Moderation = require('../../base/Moderation.js');

class Kick extends Moderation {
  constructor(client) {
    super(client, {
      name: 'kick',
      description: 'Kicks a mentioned user.',
      usage: 'kick <@mention|userid> [reason]',
      extended: 'This kicks the mentioned user, with or without a reason.',
      category: 'Moderation',      
      aliases: ['toss', 'boot', 'throw'],
      botPerms: ['SEND_MESSAGES', 'KICK_MEMBERS', 'EMBED_LINKS'],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);

    const channel  = message.guild.channels.exists('name', settings.modLogChannel);
    if (!channel)    throw `${message.author}, I cannot find the \`${settings.modLogChannel}\` channel.`;
    const target   = await this.verifyMember(message.guild, args[0]);
    if (!target)     throw `${message.author} |\`❌\`| ${generalErr.incorrectModCmdUsage}.`;
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