const { RichEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(oldMessage, newMessage) {
    if (oldMessage.author.bot) {
      return false;
    }
    
    if (!oldMessage.guild) {
      return false;
    }
    
    if (oldMessage.content == newMessage.content) {
      return false;
    }

    if (!oldMessage || !oldMessage.id || !oldMessage.content || !oldMessage.guild) return;
    const channel = oldMessage.guild.channels.find('name', 'raw-logs');
    if (!channel) return;
    channel.send(`\`[${moment(oldMessage.createdAt).format('h:mm:ss')}]\` 📝 ${oldMessage.author.tag} (${oldMessage.author.id}) : Message Edited in ${oldMessage.channel.name}:\n**B**: ${oldMessage.cleanContent}\n**N**: ${newMessage.cleanContent}`);

    const settings = this.client.settings.get(oldMessage.guild.id);
    const Edit = new RichEmbed()
      .setColor(0x00AE86)
      .setTimestamp()
      .setDescription(`**Action:** Message Edited\n**Message Author:** ${oldMessage.author}\n**Old Content:** ${oldMessage.content}\n**New Content:** ${newMessage.content}`);
    if (settings.extensiveLogging !== 'true') return;
    oldMessage.guild.channels.find('name', settings.modLogChannel).send({ embed: Edit });
  }
};