const { RichEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message, client) {

    if (!message || !message.id || !message.content || !message.guild) return;
    const channel = message.guild.channels.find('name', 'raw-logs');
    if (!channel) return;
    channel.send(`\`[${moment(message.createdAt).format('h:mm:ss')}]\` 🗑 ${message.author.tag} (${message.author.id}) : Message Deleted in ${message.channel.name}:\n${message.cleanContent}`);
    
    const settings = this.client.settings.get(message.guild.id);
    const Deletion = new RichEmbed()
      .setColor(0x00AE86)
      .setTimestamp()
      .setDescription(`**Action:** Message Deletion\n**Message Author:** ${message.author.username}#${message.author.discriminator}\n**Message Content:** ${message}`);
    if (settings.extensiveLogging !== 'true') return;
    message.guild.channels.find('name', settings.modLogChannel).send({ embed: Deletion });
  }
};