const Command = require('../../base/Command.js');

class Role extends Command {
  constructor(client) {
    super(client, {
      name: 'role',
      description: 'Give or take a role to/from a user',
      category: 'Utilities',
      usage: 'role <-give|-take> <role name',
      guildOnly: true,
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) {
    switch (message.flags[0]) {
      case 'add': {
        if (message.mentions.members.size === 0) return message.reply('Please mention a user to give the role to.');
        const member = message.mentions.members.first();
        const name = args.slice(1).join(' ');
        const role = message.guild.roles.find('name', name);
        if (!role) return message.reply('I can\'t seem to find that role.');
        try {
          await member.addRole(role);
          await message.channel.send(`I've added the ${name} role to ${member.dsiplayName}.`);
        } catch (e) {
          throw e;
        }
        break;
      }
  
      case 'remove': {
        if (message.mentions.members.size === 0) return message.reply('Please mention a user to take the role from.');
        const member = message.mentions.members.first();
        const name = args.slice(1).join(' ');
        const role = message.guild.roles.find('name', name);
        if (!role) return message.reply('I can\'t seem to find that role.');
        try {
          await member.removeRole(role);
          await message.channel.send(`I've removed the ${name} role from ${member.displayName}.`);
        } catch (e) {
          throw e;
        }
      }
    }
  }
}

module.exports = Role;