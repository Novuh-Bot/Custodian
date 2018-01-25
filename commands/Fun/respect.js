const Social = require('../../base/Social.js');
const { Canvas } = require('canvas-constructor');
const snek = require('snekfetch');

const giveRespect = async (person) => {
  console.log(`${person}`);
  const plate = await snek.get('https://raw.githubusercontent.com/YorkAARGH/Misaki/master/assets/images/image_respects.png');
  const png = person.replace(/\.(gif|jpg|png|jpeg)\?size=2048/g, '.png?size=128');
  console.log(png);
  const { body } = await snek.get(png);
  return await new Canvas(720, 405)
    .addRect(0, 0, 720, 405)
    .setColor('#000000')
    .addImage(body, 110, 45, 90, 90)
    .restore()
    .addImage(plate, 0, 0, 720, 405)
    .toBuffer();
};

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
      const target = await this.verifyUser(args[0] || message.author.id);

      const msg = await message.channel.send('Paying respects...');

      const result = await giveRespect(target.displayAvatarURL);
      const m = await message.channel.send('Press 🇫 to pay respects.', { files: [{ attachment: result, name: 'paid-respects.png' }] });
      await msg.delete;
      m.react('🇫');
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Respect;