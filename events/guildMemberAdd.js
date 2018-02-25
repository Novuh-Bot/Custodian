const { Attachment } = require('discord.js');
const moment = require('moment');
const { yorkAPIKey } = require('../config.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    if (!member || !member.id || !member.guild) return;
    const guild = member.guild;

    const channel = guild.channels.find('name', 'raw-logs');
    if (!channel) return;
    const fromNow = moment(member.user.createdTimestamp).fromNow();
    const isNew = (new Date() - member.user.createdTimestamp) < 900000 ? '🆕' : '';
    channel.send(`📥 ${member.user.tag} (${member.user.id}) joined. Created: ${fromNow} ${isNew}`);

    const settings = this.client.settings.get(member.guild.id);
    if (settings.welcomeEnabled !== 'true') return;
    const welcomeMessage = settings.welcomeMessage.replace('{{user}}', member.user.tag);
    member.guild.channels.find('name', settings.welcomeChannel).send(welcomeMessage).catch(console.error);

    const { user } = member;
    await guild.channels.find('name', settings.welcomeChannel).send(new Attachment(await this.client.api.welcome('gearz', user.bot, user.tag, user.displayAvatarURL, `${guild.name}#${guild.memberCount}`), 'welcome.png'));
  }
};
