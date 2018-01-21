const Command = require('../../base/Command.js');
const { RichEmbed } = require('discord.js');
const embedCheck = require('../../modules/embedPerms.js');

class Queue extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      description: 'Displays the queue for the server',
      category: 'Music',
      guildOnly: true,
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const settings = this.client.getSettings(message.guild.id);
    if (!this.client.playlists.has(message.guild.id)) return message.channel.send(`The queue is empty. Add some songs first with ${settings.prefix}play <song name>`);

    let playlist = this.client.playlists.get(message.guild.id);
    playlist = playlist.queue.slice(playlist.position);

    const current = playlist.shift();
    const singular = playlist.length === 1;
    const embed = new RichEmbed()
      .setTitle(`Currently playing **${current.songTitle.substring(0, 50)}** (${current.playTime})`)
      .setColor(0xDD2825)
      .setFooter(`Requested by ${current.requester}`, current.requesterIcon)
      .setDescription(`There ${singular ? 'is' : 'are'} currently ${playlist.length} song${singular ? '' : 's'} in the queue.\n`)
      .setThumbnail()
      .setTimestamp()
      .setURL(current.url);

    if (embedCheck(message)) {
      for (let i = 0; i < playlist.length && i < 5; i++) {
        embed.addField(`🎧 ${playlist[i].songTitle.substring(0, 50)} (${playlist[i].playTime})`, `🤘 Requested by **${playlist[i].requester}**`);
      }
      message.channel.send({embed});
    } else {
      message.channel.send(`Currently playing **${current.songTitle.substring(0, 50)}** (${current.playTime})\n\nThere ${singular ? 'is' : 'are'} currently ${playlist.length} song${singular ? '' : 's'} in the queue.\n${playlist.map.size === 0 ? '' : '🎧' + playlist.map(i => '_' + i.songTitle+'_ (' + i.playTime + ') requested by **' + i.requester + '**\n🔗 <https://www.youtube.com/watch?v='+i.id+'>\n').join('\n🎧 ')}`);
    }

  }
}

module.exports = Queue;