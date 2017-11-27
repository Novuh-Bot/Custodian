const Command = require('../../base/Command.js');

class Enable extends Command {
  constructor(client) {
    super(client, {
      name: 'enable',
      description: 'Enables a previously disabled command.',
      category: 'System',
      usage: 'enable [command]',
      permLevel: 'Bot Admin',
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) {
    if (!args || args.size < 1) return message.reply('Must provide a command that is disabled.');
    const commands = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
    if (!commands) return message.reply(`The command \`${args[0]}\` doesn't seem to exist, nor is it an alias. Try again!`);
    const response = await this.client.loadCommand(`${commands.conf.location}`, commands.help.name);
    if (response) return message.reply(`Error loading: ${response}`);

    message.reply(`The command \`${commands.help.name}\` has been loaded.`);
  }
}

module.exports = Enable;