const Event = require('../lib/structures/Event');

class Error extends Event {
  constructor(client) {
    super(client, {
      name: 'error'
    });
  }

  async run(info) {
    global.logger.error(info);
  }
}

module.exports = Error;