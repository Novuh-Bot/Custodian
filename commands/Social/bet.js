const Social = require('../../base/Social.js');

class Bet extends Social {
  constructor(client) {
    super(client, {
      name: 'bet',
      description: 'Bet some of your money in a chance to earn big.',
      category: 'Social',
      usage: 'famous',
      aliases: []
    });
  }
  
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const score = this.client.points.get(`${message.guild.id}-${message.author.ir}`);
    const j = await this.client.getSettings(message.guild.id).getField('settings').getField('jackpot').run();
    const jackpot = Number(j);
    if (score < 100) return message.reply('you are too poor to bet. Please try again later.');
    if (args[0] > score) return message.reply('trying to spend money you don\'t have? Nice try.. Try using the money you **actually** have.');
    if (args[0] == undefined) return message.reply('you have to place a bet..');
    if (args[0] < 100) return message.reply('sorry, you must bet more than $100.');
    const response = await this.client.awaitReply(message, await `Your current bet is ${args[0]}, are you sure?`);
    if (['y', 'yes'].includes(response.toLowerCase())) {
      console.log(jackpot);
      let chance = Math.random()*0.5;
      let betchance = (Math.sqrt(score)/25)/Math.sqrt(args[0])*10;
      if (balance > 1000) { betchance = (Math.sqrt(score)/80)/Math.sqrt(args[0]); chance = Math.random()*1.1; console.log('More than 1000');}
      console.log(chance);
      console.log(betchance);
      if (chance < betchance) {
        const amt = balance + jackpot;
        await this.client.getSettings(message.guild.id).update({'settings':{'jackpot':3000}}).run();
        await message.reply(`You won! You've earned the jackpot of $${jackpot}`);
        score.points += amt;
        this.client.points.set(`${message.guild.id}-${message.author.id}`, score);
      }
      if (chance > betchance) {
        const amt = balance - args[0];
        const jp = jackpot + Number(args[0]);
        console.log(jp);
        await this.client.getSettings(message.guild.id).update({'settings':{'jackpot':jp}}).run();
        await message.reply(`sorry, you lost the bet, -$${args[0]}`);
        score.points -= args[0];
        return this.client.points.set(`${message.guild.id}-${message.author.id}`, score);
      }
    }
  }
}

module.exports = Bet;