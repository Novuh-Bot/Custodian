module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    this.client.settings.set(guild.id, this.client.config.defaultSettings);
    this.client.log('Log', `New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members.`, 'JOINED');
  }
};
