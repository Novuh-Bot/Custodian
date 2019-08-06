const Command = require('../../lib/structures/Command');

class Prefix extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      description: 'Change the server prefix.',
      category: 'Management',
      permLevel: 'Server Owner'
    });
  }

  async run(message, [...prefix], level) {
    console.log(prefix);

    const gid = message.guild.id.toString();
    prefix = prefix.join(' ');

    if (!prefix) return message.respond('you must supply a new prefix.');

    const res = await this.client.db.updatePrefix(gid, prefix.toString());
    message.send(`The prefix has successfully been updated to \`${prefix}\``);
  }
}

module.exports = Prefix;