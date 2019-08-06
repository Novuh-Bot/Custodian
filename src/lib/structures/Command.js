class Command {
  constructor(client, {
    name = null,
    description = 'No description provided.',
    category = 'Miscellaneous',
    usage = 'No usage provided.',
    guildOnly = false,
    aliases = new Array(),
    permLevel = 'User',
    botPerms = [],
    location = ''
  }) {
    this.client = client;
    this.help = { name, description, category, usage };
    this.conf = { guildOnly, aliases, permLevel, botPerms, location };
  }

  async verifyMessage(message, msgid) {
    try {
      const match = /([0-9]{17,20})/.exec(msgid);
      if (!match) throw 'Invalid message id.';
      const id = match[1];
      const check = await message.channel.messages.fetch(id);
      if (check.cleanContent !== undefined) return id;
    } catch (error) {
      throw error;
    }
  }

  async verifyChannel(message, chanid) {
    try {
      const match = /([0-9]{17,20})/.exec(chanid);
      if (!match) return message.channel.id;
      const id = match[1];
      const check = await message.guild.channels.get(id);
      if (check.name !== undefined && check.type === 'text') return id;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Command;