const Command = require('../../base/Command.js');
const config = require('../../config.js');
const { RichEmbed } = require('discord.js');
const embedCheck = require('../../modules/embedPerms.js');
const playNext = require('../../modules/playNext.js');
const ytapi = require('simple-youtube-api');
const { parse } = require('url');

class Play extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      description: 'Plays a song.',
      extended: 'Plays a song that you specified as an argument.',
      category: 'Music',
      usage: 'play <youtube link | search term>',
      botPerms: ['CONNECT', 'SPEAK', 'SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}.json`);
    const youtube = new ytapi(config.youtubeAPIKey);
    const song = args.join(' ');
    if (!song.length) throw `${message.author} |\`❌\`| ${lang.musicIncorrectURL}`;
    
    const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guide.voiceConnection.channel : null);
    if (!voiceChannel || (!message.member.voiceChannel && message.author.permLevel < 2)) {
      message.reply(`${lang.musicNoChnl}`);
    }

    let id = (() => {
      const parsed = parse(song, true);
      if (/^(www\.)?youtube\.com/.test(parsed.hostname)) {
        return parsed.queury.v;
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
      info = await youtube.getVideo(id);
    } catch (e) {
      return message.channel.send(`\`An error occured: ${e}\``);
    }

    if (!this.client.playlists.has(message.guild.id)) {
      var firstSong = true;
      this.client.playlists.set(message.guild.id, {
        dispatcher: null,
        queue: [],
        connection: null,
        position: -1
      });
      await voiceChannel.join();
    } else {
      message.channel.send(`Added ${info.title} to the queue.`);
    }

    if (message.author.permLevel < 2 && parseInt(info.durationSeconds) > 900) return message.reply('Songs can be no longer than 15 minutes.').catch(console.error);  
    const time = parseInt(info.durationSeconds, 10);
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) seconds = '0' + seconds;

    this.client.playlists.get(message.guild.id).queue.push({
      url: `https://youtube.com/watch?v=${info.id}`,
      id: info.id,
      channName: info.channel.title,
      songTitle: info.title,
      playTime: `${minutes}:${seconds}`,
      playTimeSeconds: info.durationSeconds,
      requester: message.guild.member(message.author).displayName,
      requesterIcon: message.author.displayAvatarURL
    });

    if (firstSong) {
      playNext(message);
    } else {
      const embed = new RichEmbed()
        .setTitle('Song has been added to the queue.')
        .setColor(0xDD2825)
        .setFooter(`Requested by ${message.member.displayName}`, message.author.displayAvatarURL)
        .setThumbnail(`https://i.ytimg.com/vi/${info.id}/mqdefault.jpg`)
        .setTimestamp()
        .setURL(`https://www.youtube.com/watch?v=${info.id}`)
        .addField(`**${info.title}** (${minutes}:${seconds})`, `By ${info.channel.title}`);
      if (embedCheck(message)) {
        message.channel.send({embed, disableEveryone:true }).catch(console.error);
      } else {
        message.channel.send(`**${info.title}** (${minutes}:${seconds}) has been added to the queue.`);
      }
    }

  }

}

module.exports = Play;