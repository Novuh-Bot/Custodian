const Command = require('../../base/Command.js');
const { RichEmbed } = require('discord.js');

class ServerInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      description: 'Displays server information & statistics.',
      usage: 'serverinfo',
      category: 'Utilities'
      extended: 'This command will return an organised embed with server information and statistics.',
      guildOnly: true,
      aliases: ['serverstats','guildinfo','guildstats'],
      botPerms: ['EMBED_LINKS']
    });
  }

  async run(message, args, level) {
    const embed = new RichEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL)
      .setColor(3447003)
      .setDescription(`Owner: ${message.guild.owner.user.tag} (${message.guild.owner.id})`)
      .addField('Member Count', `${message.guild.memberCount - message.guild.members.filter(m=>m.user.bot).size} + ${message.guild.members.filter(m=>m.user.bot).size} bots`, true)
      .addField('Location', message.guild.region, true)
      .addField('Created', message.guild.createdAt.toLocaleString(), true)
      .addField('Roles', message.guild.roles.size, true)
      .addBlankField(true)
      .setTimestamp()
      .setFooter(this.client.user.username, this.client.user.avatarURL);
    message.channel.send({embed}).catch(e => console.error(e));
  }
}

module.exports = ServerInfo;