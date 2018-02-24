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
    const clean = `\`[${moment(message.createdAt).format('h:mm:ss')}]\` 🗑 ${message.author.tag} (\`${message.author.id}\`) Message Deleted in **#${message.channel.name}**:\n${message.cleanContent}`;
    channel.send(clean.cleanContent);
  }
};