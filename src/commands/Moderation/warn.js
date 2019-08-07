const Command = require('../../lib/structures/Command');

class Warn extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      _usage: '<member:member> [reason:string]' 
    });
  }

  async run(message, args, level) {
    const guild = await this.client.db.getGuildSettings(message.guild.id);
    const { rich, logChannel, autoPunishment } = res.rows[0];
  }

  async paramCheck(args) {

  }
}