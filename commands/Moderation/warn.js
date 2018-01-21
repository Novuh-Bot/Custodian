const Moderation = require('../../base/Moderation.js');

class Warn extends Moderation {
  constructor(client) {
    super(client, {
      name: 'warn',
      description: 'Warns a mentioned user.',
      usage: 'warn <@mention> <reason>',
      extended: 'This warns the mentioned user, with a reason.',
      category: 'Moderation',      
      aliases: ['caution'],
      botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.getSettings(message.guild.id);
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
    if (!reason)     throw `${message.author} |\`❌\`| ${generalErr.modNoReason}`;
    try {
      await this.buildModLog(this.client, message.guild, 'w', target, message.author, reason);
      await message.channel.send(`\`${target.user.tag}\` was successfully warned.`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Warn;