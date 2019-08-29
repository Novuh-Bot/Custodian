const Event = require('../lib/structures/Event');

class Debug extends Event {
  constructor(client) {
    super(client, {
      name: 'debug'
    });
  }

  async run(info) {
    global.logger.debug(info);
  }
}

module.exports = Debug;