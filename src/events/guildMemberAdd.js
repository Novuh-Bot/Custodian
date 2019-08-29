const Event = require('../lib/structures/Event');

class GuildMemberAdd extends Event {
  constructor(client) {
    super(client, {
      name: 'guildMemberAdd'
    });
  }

  async run(member) {
    if (member.bot) return;
    await this.client.db.addMember(member.id, member.user.username);
  }
}

module.exports = GuildMemberAdd;