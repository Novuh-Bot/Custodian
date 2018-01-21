const Moderation = require('../../base/Moderation.js');

class Mute extends Moderation {
  constructor(client) {
    super(client, {
      name: 'mute',
      description: 'Mutes a mentioned user.',
      usage: 'mute <@mention> [reason]',
      extended: 'This mutes the mentioned user, with a reason',
      category: 'Moderation',           
      aliases: [],
      botPerms: ['SEND_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS'],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars no-useless-escape
    const settings = this.client.getSettings(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);

    const channel  = message.guild.channels.exists('name', settings.modLogChannel);
    if (!channel)    throw `${message.author}, I cannot find the \`${settings.modLogChannel}\` channel.`;
    const muteRole = this.client.guilds.get(message.guild.id).roles.find('name', settings.muteRole);
    const target   = await this.verifyMember(message.guild, args[0]);
    if (!target)     throw `${message.author} |\`❌\`| ${generalErr.incorrectModCmdUsage}.`;
    const modLevel = this.modCheck(message, args[0], level);
    if (typeof modLevel === 'string') return message.reply(modLevel);
    const reason   = args.splice(1, args.length).join(' ');
    if (!reason)     throw `${message.author} |\`❌\`| ${generalErr.modNoReason}`;
    try {
      await target.addRole(muteRole);
      await this.buildModLog(this.client, message.guild, 'm', target, message.author, reason);
      await message.channel.send(`\`${target.user.tag}\` was successfully muted.`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Mute;