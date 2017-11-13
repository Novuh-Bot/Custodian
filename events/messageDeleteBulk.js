module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(messages) {
    console.log('FIRE IN THE HOLE!');
    const message = messages.first();
    if (!message || !message.id || !message.content || !message.guild) return;
      
    const channel = message.guild.channels.find('name', 'raw-logs');
    if (!channel) return;
    const log = messages.map(m => `${m.createdAt} (${m.guild.id} / #${m.channel.id} / ${m.author.id}) ${m.author.tag} : ${m.cleanContent}`).join('\n');
    const hasteURL = await require('snekfetch')
      .post('https://hastebin.com/documents')
      .send(log).catch(e => {throw new Error(`Error posting data: ${e}`);});
    const url = `http://hastebin.com/${hasteURL.body.key}.txt`;
    channel.send(`🗑 ${messages.size} messages removed in **${message.channel.name}** : ${url}`);   
  }
};