const Command = require('../../base/Command.js');

class Pause extends Command {
  constructor(client) {
    super(client, {
      name: 'pause',
      description: 'Pauses the playback.',
      category: 'Music',
      guildOnly: 'true',
      usage: 'pause',
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${setLang}.json`);
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guide.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      message.reply('Please join a channel first.');
    }

    if (this.client.playlists.get(message.guild.id).dispatcher.paused) return message.reply('Playback is already paused.');
    message.channel.send('Pausing playback.');
    this.client.playlists.get(message.guild.id).dispatcher.pause();
  } 
}

module.exports = Pause;