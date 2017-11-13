const Command = require('../../base/Command.js');

class Roles extends Command {
  constructor(client) {
    super(client, {
      name: 'roles',
      description: 'Map all the roles in the server.',
      category: 'Utilities',
      usage: 'roles',
      guildOnly: true,
      extended: 'Maps all the roles in your guild, giving you the role IDs and their repsective names.',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, level) { //eslint-disable-line no-unused-vars
    const roles = message.guild.roles.map(r => `${r.id}  -  ${r.name}`).join('\n');
    message.channel.send(`\`\`\`${roles}\`\`\``);
  }
}

module.exports = Roles;