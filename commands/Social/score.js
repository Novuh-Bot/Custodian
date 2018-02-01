const Social = require('../../base/Social.js');

class Score extends Social {
  constructor(client) {
    super(client, {
      name: 'score',
      description: 'Displays your current score level and points.',
      usage: 'score [member:user]',
      category: 'Social',
      cost: 0,
      aliases: ['points', 'level', 'bal', 'balance'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const user = args.join(' ') || message.author.id;
    const points = await this.usrBal(message, user);
    return await message.channel.send(points);
  }
}

module.exports = Score;