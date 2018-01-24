const Command = require('../../base/Command.js');
const discord = require('discord.js');
const snek = require('snekfetch');
const fs = require('fs');

class Jumbo extends Command {
  constructor(client) {
    super(client, {
      name: 'jumbo',
      description: 'Get\'s an emoji, and jumbos it!',
      category: 'Fun',
      usage: 'jumbo <emoji id>',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    try {
      const emote = discord.Util.parseEmoji(args[0]);
      const URL = `https://cdn.discordapp.com/emojis/${emote.id}.png`;
      const { body } = await snek.get(`${URL}`);
      const buffer = body;
      const toSend = fs.writeFileSync('emote.png', buffer);
      message.channel.send({ file: 'emote.png' });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Jumbo;