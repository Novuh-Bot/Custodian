module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    if (member.bot) return;
    await this.client.db.removeMember(member.id);
  }
};