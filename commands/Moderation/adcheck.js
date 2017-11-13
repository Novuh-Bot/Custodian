const Moderation = require('../../base/Moderation.js');

class AdCheck extends Moderation {
  constructor(client) {
    super(client, {
      name: 'adcheck',
      description: 'Returns a list of users with invite links.',
      usage: 'adcheck',
      extended: 'This command will check for any discord invite links in members \'Playing\' status.',
      hidden: true,
      guildOnly: true,
      aliases: ['ads', 'checkads'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const members = message.guild.members.filter(member => member.user.presence.game && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.game.name));
    return message.channel.send(members.map(member => `?kick ${member.id} Discord invite link in \\\`Playing:\\\` field. (${member.user.presence.game.name})`).join('\n') || 'No invite links found.');
  }
}

module.exports = AdCheck;