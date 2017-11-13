const Social = require('../../base/Social.js');
const { RichEmbed } = require('discord.js');
class Leaderboard extends Social {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      description: 'Displays the top 10 active users.',
      usage: 'leaderboard',
      category: 'Social',
      cost: 0,
      aliases: ['top10', 'top', 'leader', 'lb'],
      botPerms: ['EMBED_LINKS']
    });
  }

  async run(message, args, level) { 
    try {
      const leaderboard = [];
      const lbServer = [];

      const list = this.client.points.filter(p => p.guild === message.guild.id && message.guild.members.get(p.user) && p.points > 0);
      
      list.map(p => ({points: p.points, user: p.user}))
        .sort((a, b) => b.points > a.points ? 1 : -1)
        .map(us => {
          lbServer.push(us.user);
        });

      list.map(p => ({points: p.points, user: p.user}))
        .sort((a, b) => b.points > a.points ? 1 : -1).slice(0, 10)
        .map((u, i) => {
          leaderboard.push(`${(i + 1).toString().padStart(2, '0')} ❯ ${this.client.users.get(u.user).tag}${' '.repeat(30 - this.client.users.get(u.user).tag.length)}::  ${u.points}`);
        });
      leaderboard.push('-------------------------------------------------------------');
      
      const pos = lbServer.indexOf(message.author.id).toString().padStart(2, '0');
      const posTxt = pos == -1 ? '??' : (lbServer.indexOf(message.author.id) + 1).toString().padStart(2, '0');
      leaderboard.push(`${posTxt} ❯ ${message.author.tag}${' '.repeat(30 - message.author.tag.length)}::  ${this.client.points.get(`${message.guild.id}-${message.author.id}`).points}`);
      const embed = new RichEmbed()
        .setAuthor(`${message.guild.name}'s Leaderboard`, message.guild.iconURL)
        .setDescription('```' + leaderboard.join('\n') + '```');
      await message.channel.send({embed});
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Leaderboard;