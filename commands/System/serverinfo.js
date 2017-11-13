const Command = require('../../base/Command.js');
const Discord = require('discord.js');
function checkDays(date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  return days + (days == 1 ? ' day' : ' days') + ' ago';
}

class Serverinfo extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      description: 'Displays information about the server.',
      extended: 'Displays a servers verification level, owner, region, member count, and emojis.',
      usage: 'serverinfo',
      category: 'System',
      botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
      permLevel: 'User'
    });
  }

  async run(message, level) {
    const verifLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵  ┻━┻', '┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻'];
    const embed = new RichEmbed();
    var emojis;
    if (message.guild.emojis.size === 0) {
      emojis = 'None';
    } else {
      emojis = message.channel.guild.emojis.map(e => e).join(' ');
    }
    embed.setAuthor(message.guild.name, message.guild.iconURL ? message.guild.iconURL : this.client.displayAvatarURL)
      .addField('Created', `${message.guild.createdAt.toString().substr(0, 15)},\n${checkDays(message.guild.createdAt)}`, true)
      .addField('ID', message.guild.id, true)
      .addField('Owner', `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
      .addField('Members', message.guild.memberCount, true)
      .addField('Roles', message.guild.roles.size, true)
      .addField('Channels', message.guild.channels.size, true)
      .addField('Verification Level', verifLevels[message.guild.verificationLevel], true)
      .addField('Default Channel', message.guild.defaultChannel, true);

  }
}

module.exports = Serverinfo;