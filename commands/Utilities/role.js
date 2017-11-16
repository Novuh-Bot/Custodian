const Command = require('../../base/Command.js');

class Role extends Command {
  constructor(client) {
    super(client, {
      name: 'role',
      description: 'Gives/Takes a role from you.',
      category: 'Utilities',
      usage: 'role -g|-t|-l|-a <role id>',
      guildOnly: true,
      extended: 'This command allows you to add roles to a list of self-assignable roles. Flags are -g, -t, -l, and -a. They will give you the role, take the role, list the self-assignable roles, or add a role to the list. Adding a role requires the moderator role.',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);
    const flag = args[0];
    const role = args[1];
    if (flag === '-g') {
      if (settings.roles.includes(`${role}`)) {
        message.member.addRole(`${role}`);
      } else {
        message.channel.send('Please give me a valid role ID.');
      }
    }
  }
}

module.exports = Role;