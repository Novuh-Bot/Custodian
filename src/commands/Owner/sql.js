const Command = require('../../lib/structures/Command');
const Stopwatch = require('../../util/Stopwatch');

const { inspect } = require('util');

class SQL extends Command {
  constructor(client) {
    super(client, {
      name: 'sql',
      category: 'Owner',
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) {
    const start = Date.now();
    const query = await this.client.db._query(args.join(' '));
    const duration = Date.now() - start;
    const stringified = JSON.stringify(query.rows, null, 2);


    if (stringified.length > 1900) {
      const link = await this.client.util.haste.post(stringified);
      message.send(`Output was too long so I uploaded it to hastebin. ${link}`);
    }

    message.send(`Command: \`${query.command}\`\n\`\`\`${JSON.stringify(query.rows, null, 2)}\`\`\`\n*Took ${duration}ms to execute*`);
  }
}

module.exports = SQL;