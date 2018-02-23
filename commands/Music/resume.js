const Command = require('../../base/Command.js');

class Resume extends Command {
  constructor(client) {
    super(client, {
      name: 'resume',
      description: 'Resumes the playback.',
      category: 'Music',
      guildOnly: 'true',
      usage: 'resume',
      permLevel: 'User',
      cooldown: 10
    });
  }

  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guide.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      message.lang(message, lang, this.help.category, 'musicNoChnl');
    }

    if (!this.client.playlists.get(message.guild.id).dispatcher.paused) return message.lang(message, lang, this.help.category, 'musicPlybckNoPause');
    message.lang(message, lang, this.help.category, 'musicPlybckResume');
    this.client.playlists.get(message.guild.id).dispatcher.resume();
  } 
}

module.exports = Resume;