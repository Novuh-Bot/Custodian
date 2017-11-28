const Command = require('../../base/Command.js');

class Mylevel extends Command {
  constructor(client) {
    super(client, {
      name: 'mylevel',
      description: 'Displays your permission level for your location.',
      usage: 'mylevel',
      category: 'System',
      guildOnly: true
    });
  }

  async run(message, args, level) {
    const friendly = this.client.config.permLevels.find(l => l.level === level).name;
    message.reply(`Your permission level is: ${level} - ${friendly}`);
  }
}

module.exports = Mylevel;