const Command = require('../../base/Command.js');
const Stopwatch = require('../../modules/Stopwatch.js');
const { inspect } = require('util');
const { post } = require('snekfetch');

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      description: 'Evaluates arbitrary Javascript.',
      category: 'System',
      usage: 'eval <expression:string>',
      extended: 'This is an extremely dangerous command, use with caution and never eval stuff strangers tell you.',
      aliases: ['ev'],
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const stopwatch = new Stopwatch();
    let syncTime, asyncTime;
    const { client } = message;
    const code = args.join(' ');
    const token = client.token.split('').join('[^]{0,2}');
    const rev = client.token.split('').reverse().join('[^]{0,2}');
    const filter = new RegExp(`${token}|${rev}`, 'g');
    try {
      let result = eval(code);
      syncTime = stopwatch.friendlyDuration;
      if (output instanceof Promise || (Boolean(result) && typeof result.then === 'function' && typeof result.catch === 'function')) {
        stopwatch.restart();
        result = await result;
        asyncTime = stopwatch.friendlyDuration;
      }
      result = inspect(result, { depth: 0, maxArrayLength: null });
      result = output.replace(filter, '[TOKEN]');
      result = this.clean(result);
      const type = typeof(result);
      if (result.length < 1950) {
        stopwatch.stop();
        const time = this.formatTime(syncTime, asyncTime);
        message.evalBlock('js', result, type, time);
      } else {
        try {
          const { body } = await post('https://www.hastebin.com/documents').send(result);
          message.channel.send(`Output was to long so it was uploaded to hastebin https://www.hastebin.com/${body.key}.js `);
        } catch (error) {
          message.channel.send(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`);
        }
      }
    } catch (error) {
      message.channel.send(`The following error occured \`\`\`js\n${error.stack}\`\`\``);
    }
  }

  formatTime(syncTime, asyncTime) {
    return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
  }

  clean(text)  {
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203));
  }
}

module.exports = Eval;