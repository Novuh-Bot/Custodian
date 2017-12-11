const Command = require('../../base/Command.js');

class Skip extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      description: 'Skips the current song.',
      category: 'Music',
      guildOnly: true,
      usage: 'skip'
    });
  }
  
  async run(message, args, level) {
    message.channel.send('Coming soon!');
  }
}

module.exports = Skip;