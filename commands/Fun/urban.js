const Command = require('../../base/Command.js');
const request = require('snekfetch');
const baseUrl = 'http://api.urbandictionary.com/v0/define?term=';

class Urban extends Command {
  constructor(client) {
    super(client, {
      name: 'urban',
      description: 'Searches Urban Dictionary for a word.',
      category: 'Fun',
      usage: 'urban <word> [result number]',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    let resultNum;
    if (parseInt(args[args.length-1], 10)) {
      resultNum = args[args.length-1];
      args = args.slice(0, -1);
    }
    const search = args.join(' ');
    const theUrl = baseUrl + search;
    const response = await request.get(theUrl).send();
    const body = response.body;
    if (!resultNum) {
      resultNum = 0;
    } else if (resultNum > 1) {
      resultNum -= 1;
    }
    const result = body.list[resultNum];
    if (result) {
      const definition = [
        `**Word:** ${search}`,
        '',
        `**Definition:** ${resultNum += 1} out of ${body.list.length}\n_${result.definition}_`,
        '',
        `**Example:**\n${result.example}`,
        `<${result.permalink}>`,
      ];
      message.channel.send(definition);
    } else {
      message.channel.send('No entry found.');
    }
  }
}

module.exports = Urban;