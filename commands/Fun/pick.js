const Command = require('../../base/Command.js');

class Pick extends Command {
  constructor(client) {
    super(client, {
      name: 'pick',
      description: 'Pick out of a list',
      category: 'Fun',
      usage: 'pick <option:string>, <option:string>, [option:string]',
      extended: 'This command will help you select out of a list of supplied options, separated by a comma.',
      aliases: ['choose'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { lang } = this.client.settings.get(message.guild.id);
    
    const options = args.join(' ');
    if (options.length < 2) return message.lang(message, lang, this.help.category, 'pickNoTxt');
    const list = options.split(',');
    if (list.length < 2)  return message.lang(message, lang, this.help.category, 'pickInvalidAmnt');
    try {
      return message.channel.send(`${list[Math.floor(Math.random()*list.length)].trim()}`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pick;