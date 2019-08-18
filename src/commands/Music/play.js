const Command = require('../../lib/structures/Command');
const playNext = require('../../util/playNext');
const embedCheck = require('../../util/embedPerms');

const { keys } = require('../../config');
const { MessageEmbed } = require('discord.js');
const { parse } = require('url');


const ytapi = require('simple-youtube-api');
const youtube = new ytapi(keys.ytAPI);

class Play extends Command {
  constructor(client) {
    super(client, {
      name: 'play'
    });
  }

  async run(message, [...song], level) {
    song = song.join(' ');
    if (!song.length) return message.respond('You must supply a YouTube url or search term.');

    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel) return message.respond('You must be in a voice channel to use this command.');

    if (!this.client.playlists.has(message.guild.id)) {
      const firstSong = true;
      this.client.playlists.set(message.guild.id, {
        dispatcher: null,
        queue: [],
        connection: null,
        position: -1
      });
      await voiceChannel.join();
    }

    let id = (() => {
      const parsed = parse(song, true);
      if (/^(www\.)?youtube\.com/.test(parsed.hostname)) {
        return parsed.query.v;
      } else if (/^(www\.)?youtu\.be/.test(parsed.hostname)) {
        return parsed.pathname.slice(1);
      }
    })();

    if (!id) {
      const results = await youtube.searchVideos(song, 4);
      id = results[0].id;
    }

    let info;
    try {
      info = youtube.getVideo(id);
    } catch (e) {
      return message.reply(`\`An error occurred: ${e}\``);
    }

    const time = parseInt(info.durationSeconds, 10);
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) seconds = '0' + seconds;

    this.client.playlists.get(message.guild.id).push({
      url: `https://youtube.com/watch?v=${info.id}`,
      id: info.id,
      channName: info.channel.title,
      songTitle: info.title,
      playTime: `${minutes}:${seconds}`,
      playTimeSeconds: info.durationSeconds,
      requester: message.guild.member(message.author).displayName,
      requesterIcon: message.author.displayAvatarURL()
    });

    if (firstSong) {
      playNext(message);
    } else {
      const embed = new MessageEmbed()
        .setTitle(`**${info.title}** (${minutes}:${seconds}) has been added to the queue`)
        .setColor(0xDD2825)
        .setFooter(`Requested by ${message.guild.member(message.author).displayName}`, message.author.displayAvatarURL())
        .setImage(`https://i.ytimg.com/vi/${info.id}/mqdefault.jpg`)
        .setTimestamp()
        .setURL(`https://www.youtube.com/watch?v=${info.id}`);
      if (embedCheck(message)) {
        message.channel.send({ embed });
      } else {
        message.channel.send(`**${info.title}** (${minutes}:${seconds}) has been added to the queue`);
      }
    }
  }
}

module.exports = Play;