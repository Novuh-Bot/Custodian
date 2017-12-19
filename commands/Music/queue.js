const Command = require('../../base/Command.js');

class Queue extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      description: 'Displays the queue for the server',
      category: 'Music',
      guildOnly: true,
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    message.channel.send('Coming soon!');
    const playlists = this.client.playlists(message.guild.id);
    playlists.map().join('➢\n');
  }
}

module.exports = Queue;