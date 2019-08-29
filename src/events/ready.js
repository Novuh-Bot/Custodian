const Event = require('../lib/structures/Event');
const { version } = require('../../package.json');

const { execSync } = require('child_process');

class Ready extends Event {
  constructor(client) {
    super(client, {
      name: 'ready'
    });
  }
  
  async run() {
    const botVersion = execSync('git rev-parse --short HEAD').toString().split('\n')[0];
    
    if (this.client.users.has('1')) {
      this.client.users.delete('1');
    }
    
    this.client.logger.login(`Revision ${botVersion} | Version ${version} | Logged in as ${this.client.user.username}`);
    
    await this.client.wait(1000);
    require('../modules/Backend');
  }
}

module.exports = Ready;