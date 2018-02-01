const Command = require('../../base/Command.js');
const discord = require('discord.js');
const snek = require('snekfetch');
const twemoji = require('twemoji');
const fs = require('fs');

class Jumbo extends Command {
  constructor(client) {
    super(client, {
      name: 'jumbo',
      description: 'Get\'s an emoji, and jumbos it!',
      category: 'Fun',
      usage: 'jumbo <emoji:emoji>',
      botPerms: ['SEND_MESSAGES', 'ATTACH_FILES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    try {
      const emote = discord.Util.parseEmoji(args[0]);
      if (emote.animated === true) {
        const URL = `https://cdn.discordapp.com/emojis/${emote.id}.gif?v=1`;
        const { body: buffer } = await snek.get(`${URL}`);
        const toSend = fs.writeFileSync('emote.gif', buffer);
        message.channel.send({ file: 'emote.gif' });
      } else if (emote.id === null) {
        const twemote = twemoji.parse(args[0]);
        const regex = /src="(.+)"/g;
        const regTwemote = regex.exec(twemote)[1];
        const { body: buffer } = await snek.get(`${regTwemote}`);
        const toSend = fs.writeFileSync('emote.png', buffer);
        await message.channel.send({ file: 'emote.png' });
      } else {
        const URL = `https://cdn.discordapp.com/emojis/${emote.id}.png`;
        const { body: buffer } = await snek.get(`${URL}`);
        const toSend = fs.writeFileSync('emote.png', buffer);
        message.channel.send({ file: 'emote.png' });
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Jumbo;