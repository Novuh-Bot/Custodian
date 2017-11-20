const snekfetch = require('snekfetch');
const { dBotsToken, appID } = require('../config.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    this.client.settings.set(guild.id, this.client.config.defaultSettings);
    this.client.log('log', `New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members.`, 'JOINED');

    snekfetch.post(`https://discordbots.org/api/bots/${appID}/stats`)
      .set('Authorization', `${dBotsToken}`)
      .send({ server_count: this.client.guilds.size })
      .then(console.log('Updated Discordbots.org Guild Size'))
      .catch(e => console.warn('Something went wrong. Check DBots.org status.'));
  }
};
