const { MessageEmbed } = require('discord.js');
const embedCheck = require('./embedPerms.js');
const yt = require('ytdl-core');

const playNext = (message) => {
  const thisPlaylist = message.client.playlists.get(message.guild.id);
  const nextSong = thisPlaylist.queue[++thisPlaylist.position];
  const dispatcher = message.guild.voiceConnection.playStream(yt(nextSong.url, {quality:'lowest', filter:'audioonly'}), {passes: 3, volume: message.guild.voiceConnection.volume || 0.2});

  thisPlaylist.dispatcher = dispatcher;

  if (embedCheck(message)) {
    const embed = new MessageEmbed()
      .setTitle(`Now playing **${nextSong.songTitle}** (${nextSong.playTime})`)
      .setColor(0xDD2825)
      .setFooter(`Requested by ${nextSong.requester}`, nextSong.requesterIcon)
      .setImage(`https://i.ytimg.com/vi/${nextSong.id}/mqdefault.jpg`)
      .setTimestamp()
      .setURL(nextSong.url);
    message.channel.send({ embed });
  } else {
    message.channel.send(`Now playing **${nextSong.songTitle}** (${nextSong.playTime})`);
  }

  dispatcher.on('end', ()=> {
    if (thisPlaylist.position + 1 < thisPlaylist.queue.length) {
      playNext(message);
    } else {
      message.channel.send('End of the queue, add more songs!');
      message.guild.voiceConnection.disconnect();
      message.client.playlists.delete(message.guild.id);
    }
  });
};

module.exports = playNext;