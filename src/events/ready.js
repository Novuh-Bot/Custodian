const { execSync } = require('child_process');

const { version } = require('../../package.json');
const constants = require('../constants');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    const botVersion = execSync('git rev-parse --short HEAD').toString().split('\n')[0];

    if (this.client.users.has('1')) {
      this.client.users.delete('1');
    }

    this.client.logger.login(`Revision ${botVersion} | Version ${version} | Logged in as ${this.client.user.username}`);
    console.log('\n');
  }
};