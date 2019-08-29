const Event = require('../lib/structures/Event');

class Warn extends Event {
  constructor(client) {
    super(client, {
      name: 'warn'
    });
  }

  async run(info) {
    global.logger.warn(info);
  }
}

module.exports = Warn;