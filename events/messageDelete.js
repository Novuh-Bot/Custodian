const moment = require('moment');
const config = require('../config.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message, client) {

    if (config.ignoredUsers.includes(message.author.id)) return;
    if (config.ignoredChannels.includes(message.channel.id)) return;
    
    if (!message || !message.id || !message.content || !message.guild) return;
    const channel = message.guild.channels.find('name', 'raw-logs');
    if (!channel) return;
    channel.send(`\`[${moment(new Date()).format('h:mm:ss')}]\` 🗑 ${message.author.tag} (\`${message.author.id}\`) Message Deleted in **#${message.channel.name}**:\n${message.cleanContent}`);
  }
};