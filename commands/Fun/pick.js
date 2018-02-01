const Command = require('../../base/Command.js');

class Pick extends Command {
  constructor(client) {
    super(client, {
      name: 'pick',
      description: 'Pick out of a list',
      category: 'Fun',
      usage: 'pick <option:string>, <option:string>, [option:string]',
      extended: 'This command will help you select out of a list of supplied options.',
      aliases: ['choose'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    const options = args.join(' ');
    if (options.length < 2) throw `${message.author} |\`❌\`| ${lang.pickNoTxt}`;
    const list = options.split(',');
    if (list.length < 2)  throw `${message.author} |\`❌\`| ${lang.pickInvalidAmnt}`;  
    try {
      return message.channel.send(`${list[Math.floor(Math.random()*list.length)].trim()}`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pick;