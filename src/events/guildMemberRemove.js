const Event = require('../lib/structures/Event');

class GuildMemberRemove extends Event {
  constructor(client) {
    super(client, {
      name: 'guildMemberRemove'
    });
  }

  async run(member) {
    if (member.bot) return;
    await this.client.db.removeMember(member.id);
  }
}

module.exports = GuildMemberRemove;