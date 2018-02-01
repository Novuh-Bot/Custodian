const Command = require('../../base/Command.js');
const moment = require('moment');
const { RichEmbed } = require('discord.js');

class User extends Command {
  constructor(client) {
    super(client, {
      name: 'user',
      description: 'Get detailed info for a mentioned user.',
      usage: 'user [member:user]',
      category: 'Utilities',
      extended: 'This command will get detailed information on either a mentioned user, or yourself.',
      botPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const user = args.join(' ') || message.author.id;
      const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
      let member;
      const members = message.guild.members.filter(m => m.user.username.toLowerCase().includes(user.toLowerCase()) || m.nickname && m.nickname.toLowerCase().includes(user.toLowerCase()));
      if (match) member = match[1];
      else {
        if (members.size > 1) {
          const text = members.map(m => `=> ${m.id} | ${m.user.tag}${m.nickname ? ` (${m.nickname})` : ''}`);
          return message.channel.send(`There are **${members.size}** matches:\n\`\`\`${text.join('\n')}\`\`\``);
        }
        member = members.first();
      }
  
      const target = await this.verifyMember(message.guild, member);
      const embed = new RichEmbed()
        .setThumbnail(target.user.displayAvatarURL)
        .setColor(target.highestRole.color || 0)
        .setAuthor(`${target.displayName} (${target.user.id})`, target.user.displayAvatarURL)
        .addField('Account Created', moment(target.user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'))
        .addField('Member Joined', moment(target.joinedAt).format('dddd, MMMM Do YYYY, h:mm:ss a'))
        .setFooter('User Information')
        .setTimestamp();

      message.channel.send({embed});
    
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;