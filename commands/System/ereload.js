const Command = require('../../base/Command.js');

class Ereload extends Command {
  constructor(client) {
    super(client, {
      name: 'ereload',
      description: 'Reloads an event.',
      category: 'System',
      usage: 'ereload <event name>',
      permLevel: 'Bot Admin'
    });
  }

  async run(message, args, level) {
    let event;
    if (this.client.events.has(args[0])) {
      event = args[0];
    } else {
      console.log('That is not a valid event.');
    }
    if (!event) {
      message.channel.send('That is not a valid event');
    } else {
      message.channel.send(`Reloaded ${event}`);
    }
  }
}

module.exports = Ereload;