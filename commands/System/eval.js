const Command = require('../../base/Command.js');
const Stopwatch = require('../../util/Stopwatch.js');

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      description: 'Evaluates arbitrary Javascript.',
      category:'System',
      usage: 'eval <expression:string>',
      aliases: ['ev'],
      permLevel: 'Bot Owner'
    });
  }

  async run(message, [code], level) { // eslint-disable-line no-unused-vars     
    const stopwatch = new Stopwatch();
    let syncTime, asyncTime;
    try {
      const evaled = eval(code);
      const clean = await this.client.clean(this.client, evaled);
      syncTime = stopwatch.friendlyDuration;
      const msg = await message.channel.send('Evaling.');
      stopwatch.stop();
      const time = this.formatTime(syncTime, asyncTime);
      msg.edit(`\`\`\`js\n${clean}\n\`\`\`\n\n${time}`);
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${await this.client.clean(this.client, err)}\n\`\`\``);
    }
  }

  formatTime(syncTime, asyncTime) {
    return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
  }
}

module.exports = Eval;