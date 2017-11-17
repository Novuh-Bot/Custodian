const Command = require('../../base/Command.js');
const snek = require('snekfetch');

class Yomamma extends Command {
  constructor(client) {
    super(client, {
      name: 'yomamma',
      description: 'Disrespect someone\'s mother with this.',
      category: 'Fun',
      usage: 'yomamma',
      aliases: ['yomama'],
      botPerms: ['SEND_MESSAGES'],
      cost: 2
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const { text } = await snek.get('http://api.yomomma.info/');
      message.channel.send(`_${JSON.parse(text).joke}_`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Yomamma;