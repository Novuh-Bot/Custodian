const Command = require('./Command.js');

class Music extends Command {
  
  constructor(client, options) {
    super(client, Object.assign(options, {
      category: 'Music',
      guildOnly: true
    }));

    this.actions = {
      pl: { color: 0xDD2825, display: 'Now Playing'},
      st: { color: 0xFFFFFF, display: 'Stopped Playback'},
      sk: { color: 0xDD2825, display: 'Skipped Song'},
      re: { color: 0xFFFFFF, display: 'Resumed Playback'}
    };

  }

  async embedPerms(message) {
    try {
      if (!message.guild) return true;
      return message.channel.permissionsFor(message.client.user).hasPermission('EMBED_LINKS');
    } catch (error) {
      throw error;
    }
  }

  async playNext(message) {
    const thisPlaylist = message.client.playlists.get(message.guild.id);
    const nextSong = thisPlaylist.queue[++thisPlaylist.position];
    const dispatcher = message.guild.voiceConnection.playStream(yt(nextSong.url, {quality:'lowest', filter:'audioOnly'}), {passes: 3, volume: message.guild.voiceConnection.volume || 0.2});
  
    thisPlaylist.dispatcher = dispatcher;
  
    if (embedCheck(message)) {
      const embed = Discord.RichEmbed()
        .setTitle(`Now playing **${nextSong.songTitle}** (${nextSong.playTime})`)
        .setColor(0xDD2825)
        .setFooter(`Requested by ${nextSong.requester}`, nextSong.requesterIcon)
        .setImage(`https://i.ytimg.com/vi/${nextSong.id}/mqdefault.jpg`)
        .setTimestamp()
        .setURL(nextSong.url);
      message.channel.send({ embed });
    } else {
      message.channel.send(`Now Playing **${nextSong.songTitle}** (${nextSong.playTime})`);
    }
  
    dispatcher.on('end', () => {
      if (thisPlaylist.position + 1 < thisPlaylist.queue.length) {
        playNext(message);
      } else {
        message.channel.send('End of the queue, add more song!');
        message.guild.voiceConnection.disconnect();
        message.client.playlists.delete(message.guild.id);
      }
    });
  }

}

module.exports = Music;