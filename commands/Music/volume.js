const Command = require('../../base/Command.js');

class Volume extends Command {
  constructor(client) {
    super(client, {
      name: 'volume',
      description: 'Sets the volume for the bot.',
      category: 'Music',
      guildOnly: 'true',
      usage: 'volume [value:integer]',
      permLevel: 'User',
      cooldown: 10
    });
  }

  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      message.lang(message, lang, this.help.category, 'musicNoChnl');
    }
    
    const vol = args.join(' ');
    if (!vol) return message.channel.send(`${lang.musicVol} ${this.client.playlists.get(message.guild.id).disapatcher.volume * 100}%`);
    if (vol < 0 || vol > 100) return message.lang(message, lang, this.help.category, 'musicVolInvalidAmnt');

    message.channel.send(`${lang.musicVolSet} ${vol}%`).then(() => {
      message.guild.voiceConnection.volume = vol / 100;
      this.client.playlists.get(message.guild.id).dispatcher.setVolume(vol / 100);
    });
  }
}

module.exports = Volume;