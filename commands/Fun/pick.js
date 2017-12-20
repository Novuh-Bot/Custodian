const Command = require('../../base/Command.js');

class Pick extends Command {
  constructor(client) {
    super(client, {
      name: 'pick',
      description: 'Pick out of a list',
      category: 'Fun',
      usage: 'pick <option1>, <option2>, <option3>, <etc>',
      extended: 'This command will help you select out of a list of supplied options.',
      aliases: ['choose'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${setLang}.json`);
    const options = args.join(' ');
    if (options.length < 2) throw `${message.author} |\`❌\`| Invalid command usage, you must supply text.`;
    const list = options.split(',');
    if (list.length < 2)  throw `${message.author} |\`❌\`| Invalid command usage, you must supply at least two items to pick from.`;  
    try {
      return message.channel.send(`${list[Math.floor(Math.random()*list.length)].trim()}`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pick;