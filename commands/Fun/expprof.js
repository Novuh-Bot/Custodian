const Command = require('../../base/Command.js');
const snek = require('snekfetch');
const { Canvas } = require('canvas-constructor');

const buildProfile = async (person) => {
  console.log(`${person}`);
  const png = person.replace(/\.(gif|jpg|png|jpeg)\?size=2048/g, '.png?size=128');
  const { body } = await snek.get(png);
  return await new Canvas(720, 405)
    .addRect(0, 0, 720, 405)
    .setColor('#000000')
    .addImage(body, 110, 45, 90, 90)
    .restore()
    .toBuffer();
};

class Profile extends Command {
  constructor(client) {
    super(client, {
      name: 'profile',
      description: 'Displays your profile.',
      category: 'Fun',
      usage: 'profile',
      guildOnly: true,
      botPerms: ['EMBED_LINKS', 'SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    try {
      const target = await this.verifyUser(args[0] || message.author.id);
      const result = await buildProfile(target.displayAvatarURL);
      const m = await message.channel.send({ files: [{ attachment: result, name: 'profile.png '}] });
    } catch (e) {
      throw e;
    }
  } 
}

module.exports = Profile;