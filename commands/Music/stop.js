const Command = require('../../base/Command.js');

class Stop extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      description: 'Stops the playback.',
      category: 'Music',
      guildOnly: 'true',
      usage: 'stop',
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${setLang}.json`);
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guide.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      message.reply(`${lang.musicNoChnl}`);
    }

    if (this.client.playlists.has(message.guild.id)) {
      const queue = this.client.playlists.get(message.guild.id);
      queue.queue = [];
      queue.dispatcher.end();
    }

    voiceChannel.leave();
  } 
}

module.exports = Stop;