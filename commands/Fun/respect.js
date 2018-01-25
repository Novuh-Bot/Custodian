const Social = require('../../base/Social.js');
const snek = require('snekfetch');
const { yorkAPIKey } = require('../../config.js');

class Respect extends Social {
  constructor(client) {
    super(client, {
      name: 'respect',
      description: 'Pay respects to someone',
      category: 'Fun',
      usage: 'respect <@mention|user id>',
      extended: 'A command to pay respects to someone, Advanced Warfare style.',
      aliases: ['pressf', 'f', 'rip', 'ripme'],
      botPerms: ['ATTACH_FILES']
    });
  }

  async run(message, args, level) {
    try {
      const person = message.mentions.users.first() || message.member;
      const { body } = await snek.get(`http://api.anidiots.guide/api/respect/?avatar=${person.displayAvatarURL}`).set('token', `${yorkAPIKey}`);
      await message.channel.send({ files: [{ attachment: body, name: 'respects.png' }] });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Respect;