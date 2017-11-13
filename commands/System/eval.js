const Command = require('../../base/Command.js');

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      description: 'Evaluates arbitrary Javascript.',
      category:'System',
      usage: 'eval <expression>',
      aliases: ['ev'],
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const code = args.join(' ');
    try {
      const evaled = eval(code);
      if (evaled.length > 1500) {
        const hasteURL = await require('snekfetch')
          .post('https://hastebin.com/documents')
          .send(log).catch(e => {throw new Error(`Error posting data: ${e}`);});
      } else {
        const clean = await this.client.clean(this.client, evaled);
        message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
      }
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${await this.client.clean(this.client, err)}\n\`\`\``);
    }
  }
}

module.exports = Eval;
