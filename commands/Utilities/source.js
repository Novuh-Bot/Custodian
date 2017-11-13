const Command = require('../../base/Command.js');

class Source extends Command {
  constructor(client) {
    super(client, {
      name: 'source',
      description: 'Gives you the link for the source code.',
      category: 'Utilities',
      usage: 'source <command>',
      extended: 'This command will display the source code for a specified command. Requires you to supply the commands category.',
      botPerms: ['EMBED_LINKS', 'SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const category = args[0];
    if (!args[0]) return message.reply('please supply a category to view.');
    const command = args[1];
    if (!args[1]) return message.reply('please supply a command to view that is in the specified category.');
    const source = `https://github.com/Novuh-Bot/Custodian/blob/master/commands/${category}/${command}.js`;
    message.channel.send(`This is the source code for the command ${command}. ${source}`);
  }
}

module.exports = Source;
