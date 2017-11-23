const Command = require('../../base/Command.js');

class Archive extends Command {
  constructor(client) {
    super(client, {
      name: 'archive',
      description: 'Archives messages.',
      category: 'Moderation',
      usage: 'archive <message count>',
      guildOnly: true,
      extended: 'Archives x amount of messages in your channel, where x is the amount you specify.',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) {
    const amount = args[0];
    try {
      const messages = message.channel.fetchMessages({ limit: `${amount}`});
      const log = messages.map(m => `${m.createdAt} (${m.guild.id} / #${m.channel.id} / ${m.author.id}) ${m.author.tag} : ${m.cleanContent}`).join('\n');
      const hasteURL = await require('snekfetch')
        .post('https://hastebin.com/documents')
        .send(msgs).catch(e => {throw new Error(`Error posting data: ${e}`);});
      const url = `https://hastebin.com/${hasteURL.body.key}.js`;
      message.channel.send(`Fetched ${amount} messages. They were archived here: ${url}.`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Archive;