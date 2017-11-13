const moment = require('moment');
module.exports = class {
  constructor(client) {
    this.client = client;
  }
  async run(guild, user) {
    const channel = guild.channels.find('name', 'raw-logs');
    if (!channel) return;
    try {
      const member = await guild.fetchMember(user.id);
      const fromNow = member ? moment(member.joinedTimestamp).fromNow() : 'unknown (member not cached)';
      channel.send(`🚨 ${user.tag} (${user.id})  was banned by unknown, they joined: ${fromNow}\n**Reason**: Responsible moderator, you know what to do!`);
    } catch (error) {
      console.log(error);
    }
  }
};