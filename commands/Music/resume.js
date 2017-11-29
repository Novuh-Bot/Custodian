const Command = require('../../base/Command.js');

class Resume extends Command {
  constructor(client) {
    super(client, {
      name: 'resume',
      description: 'Resumes the playback.',
      category: 'Music',
      guildOnly: 'true',
      usage: 'resume',
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guide.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      message.reply('Please join a channel first.');
    }

    if (!this.client.playlists.get(message.guild.id).dispatcher.paused) return message.reply('Playback has not been paused.');
    message.channel.send('Resuming playback.');
    this.client.playlists.get(message.guild.id).dispatcher.resume();
  } 
}

module.exports = Resume;