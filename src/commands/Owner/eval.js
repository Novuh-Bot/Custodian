const Command = require('../../lib/structures/Command');

const Stopwatch = require('../../util/Stopwatch');
const Type = require('../../util/Type');

const { inspect } = require('util');
const fs = require('fs-nextra');

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      description: 'Evaluates arbitrary Javascript.',
      category: 'Owner',
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) {
    const stopwatch = new Stopwatch();
    let syncTime, asyncTime;
    const { client } = message;
    const code = args.join(' ');
    const token = client.token.split('').join('[^]{0,2}');
    const rev = client.token.split('').reverse().join('[^]{0,2}');
    const filter = new RegExp(`${token}|${rev}`, 'g');
    try {
      let output = eval(code);
      syncTime = stopwatch.friendlyDuration;
      if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function')) {
        stopwatch.restart();
        output = await output;
        asyncTime = stopwatch.friendlyDuration;
      }
      const type = new Type(output);
      output = inspect(output, { depth: 0, maxArrayLength: null });
      output = output.replace(filter, '[TOKEN]');
      output = this.clean(output);
      if (output.length < 1950) {
        stopwatch.stop();
        const time = this.formatTime(syncTime, asyncTime);
        await message.channel.send(`**Output:**\n\`\`\`js\n${output}\`\`\`\n**Type:**\`\`\`${type}\`\`\`\n${time}`);
      } else {
        try {
          const link = await this.client.util.haste.post(output);
          message.channel.send(`Output was to long so it was uploaded to hastebin ${link}`);
        } catch (error) {
          message.channel.send(`I tried to upload the output to hastebin but encountered this error \`${error.name}:${error.message}\``);
        }
      }
    } catch (error) {
      message.channel.send(`The following error occured: \`\`\`js\n${error.stack}\`\`\``);
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