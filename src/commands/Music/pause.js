const Command = require('../../lib/structures/Command');

class Pause extends Command {
  constructor(client) {
    super(client, {
      name: 'pause'
    });
  }

  async run(message, args, level) {
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && level < 2)) return message.respond('You must be in a voice channel to use this command.');

    if (this.client.playlists.get(message.guild.id).dispatcher.paused) return message.reply('The player is already paused.');
    message.send('Pausing the player.');
    this.client.playlists.get(message.guild.id).dispatcher.pause();
  }
}

module.exports = Pause;