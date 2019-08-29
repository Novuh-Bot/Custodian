const Event = require('../lib/structures/Event');

class GuildCreate extends Event {
  constructor(client) {
    super(client, {
      name: 'guildCreate'
    });
  }

  async run(guild) {
    await this.client.db.addServer(guild.id, guild.name, guild.owner.id);
    this.client.logger.info(`New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members.`);
  }
}

module.exports = GuildCreate;