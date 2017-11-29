const Command = require('../../base/Command.js');
const embedCheck = require('../../modules/embedPerms.js');
const playNext = require('../../modules/playNext.js');
const yt = require('ytdl-core');
const {RichEmbed} = require('discord.js');

class Play extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      description: 'Plays a song.',
      extended: 'Plays a song that you specified as an argument.',
      category: 'Music',
      usage: 'play <youtube link>',
      botPerms: ['CONNECT', 'SPEAK', 'SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guide.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      message.reply('Please join a channel first.');
    }
    
    if (this.client.playlists.get(message.guild.id).dispatcher.playing) return message.reply('I\'m already playing something in this server.');

    if (embedCheck(message)) {
      const embed = new RichEmbed()
        .setTitle(`Now playing **${song.songTitle}** (${song.playTime})`)
        .setColor(0xDD2825)
        .setFooter(`Requested by ${song.requester}`, song.requesterIcon)
        .setImage(`https://i.ytimg.com/vi/${song.id}/mqdegfault.jpg`)
        .setTimestamp()
        .setURL(song.url);
      message.channel.send({ embed });
    } else {
      message.channel.send(`Now playing: **${song.songTitle}** (${song.playTime}`);
    }
  }
}

module.exports = Play;