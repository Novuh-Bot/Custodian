const Command = require('../../base/Command.js');

class Pause extends Command {
  constructor(client) {
    super(client, {
      name: 'pause',
      description: 'Pauses the playback.',
      category: 'Music',
      guildOnly: 'true',
      usage: 'pause',
      permLevel: 'User',
      cooldown: 10
    });
  }

  async run(message, args, level) {
    const { lang } = this.client.settings.get(message.guild.id);
    
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guide.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      return message.lang(message, lang, this.help.category, 'musicNoChnl');
    }

    if (this.client.playlists.get(message.guild.id).dispatcher.paused) return message.lang(message, lang, this.help.category, 'musicPlybckAlrdyPause');
    message.lang(message, lang, this.help.category, 'musicPlybckPause');
    this.client.playlists.get(message.guild.id).dispatcher.pause();
  } 
}

module.exports = Pause;