module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    await this.client.db.addServer(guild.id, guild.name, guild.owner.id);
    this.client.logger.info(`New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members.`);
  }
};