module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    this.client.settings.delete(guild.id);
  }
};
