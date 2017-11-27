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
      const msgs = message.channel.fetchMessages({ limit: `${amount}`})
        .then(messages => messages.map(m => `${m.createdAt} (${m.guild.id} / #${m.channel.id} / ${m.author.id}) ${m.author.tag} : ${m.cleanContent}`).join('\n'));
      const hasteURL = await require('snekfetch')
        .post('https://hastebin.com/documents')
        .send(msgs).catch(e => {
          throw new Error(`Error posting data: ${e}`);
        });
      const url = `http://hastebin.com/${hasteURL.body.key}.txt`;
      message.channel.send(`Here's the archive. ${url}`);
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Archive;