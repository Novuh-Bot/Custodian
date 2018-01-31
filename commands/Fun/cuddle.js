const Social = require('../../base/Social.js');

class Cuddle extends Social {
  constructor(client) {
    super(client, {
      name: 'cuddle',
      description: 'Cuddle someone.',
      category: 'Fun',
      usage: 'cuddle <member:user>',
      botPerms: ['SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
      permLevel: 'User'
    }); 
  }

  async run(message, args, level) {
    try {
      const target = message.mentions.users;
      if (!target) return message.reply('you must mention someone to cuddle them.');
      const msg = await message.channel.send(`<a:atyping:408355409687216128> **${message.member.displayName}** wants to give **${target.first().username}** a cuddle...`);
      const cuddle = await this.cmdMoe('cuddle');
      await msg.edit({
        embed: {
          'title': 'Click here if the image failed to load.',
          'url': `https://cdn.ram.moe/${cuddle}`,
          'description': `**${target.first().username}** just got a cuddle from **${message.member.displayName}**`,
          'image': {
            'url': `https://cdn.ram.moe/${cuddle}`
          }
        }
      });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Cuddle;