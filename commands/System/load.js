const Command = require('../../base/Command.js');
const fs = require('fs');

class Load extends Command {
  constructor(client) {
    super(client, {
      name: 'load',
      description: 'Load a command into produciton.',
      category: 'System',
      usage: 'load <cat> <cmd>',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'Bot Admin'
    });
  }

  async run(message, args, level) {
    const cat = args[0];
    const cmd = args[1];
    function doesExist() {}
  }
}

module.exports = Load;

function doesExist() {
  const commandPath = `${process.cwd()}/commands/${cat}/${cmd}.js`;
  fs.access(`${commandPath}`, fs.constants.F_OK, (err, callback) => {
    console.log(err, callback);
  
    if (callback == 'Can view') {
      response = this.client.loadCommand(`${commands.conf.location}`, commands.help.name);
      if (response) return message.reply(`Error loading: ${response}`);
    
      message.reply(`The command \`${commands.help.name}\` has been reloaded.`);
    } else {
      message.channel.send(err);
    }
  });
}