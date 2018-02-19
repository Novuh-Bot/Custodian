const moment = require('moment');

module.exports = class {
  constructor(client) {
    this.client = client;
  }
  async run(member) {
    const guild = member.guild;
    if (!member || !member.id || !guild) return;
    try {
      const guildBans = await guild.fetchBans();
      if (guildBans && guildBans.has(member.user.id)) return;
      
      const auditActions = await guild.fetchAuditLogs({user: member.user});
      if (!auditActions || auditActions.size === 0) return;
  
      const channel = guild.channels.find('name', 'raw-logs');
      if (!channel) return;
      const fromNow = moment(member.joinedTimestamp).fromNow();
      channel.send(`📤 ${member.user.tag} (${member.user.id}) left, they had joined: ${fromNow}`);
      
    } catch (error) {
      console.log(error);
    }

  }
};