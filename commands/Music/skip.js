const Command = require('../../base/Command.js');

class Skip extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      description: 'Skips the current song.',
      category: 'Music',
      guildOnly: true,
      usage: 'skip'
    });
  }
  
  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);

    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guide.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      message.reply(`${lang.musicNoChnl}`);
    }
    
    const voiceUsers = Math.floor(message.member.voiceChannel.members.filter(m => m.user.id !== this.client.user.id).size *2 / 3);

    if (voiceUsers < 2 || message.author.permLevel > 2) {
      return message.lang(message, lang, this.help.category, 'musicSkipping').then(() => {
        this.client.playlists.get(message.guild.id).dispatcher.end('skip');
      });
    }

    message.channel.send(`You have 10 seconds to vote for the \`skip\`, you need at least ${voiceUsers} votes to skip the song.`);
    
    const filter = m => m.content.startsWith('skip');

    message.channel.awaitMessages(filter, {
      'errors': ['time'],
      'max': voiceUsers,
      time: 10000
    }).then(collected => {
      if (collected.size > voiceUsers) return message.lang(message, lang, this.help.category, 'musicSkipping').then(() => {
        this.client.playlists.get(message.guild.id).dispatcher.end('skip');
      });
    }).catch(collected => {
      if (collected.size === 0) {
        return message.lang(message, lang, this.help.category, 'musicNoVotes');
      }
      message.channel.send(`Only ${collected.size} out of ${voiceUsers} voted before time ran out.`);
    });
  }
}

module.exports = Skip;