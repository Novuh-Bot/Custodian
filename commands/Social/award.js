const Social = require('../../base/Social.js');

class Award extends Social {
  constructor(client) {
    super(client, {
      name: 'award',
      description: 'Gives a nominated user points.',
      usage: 'award <@mention|userid> <amount>',
      category:'Moderation',
      extended: 'This will give points to a nominated user.',
      cost: 0,
      hidden: true,
      aliases: ['reward', 'give'],
      botPerms: [],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const user = await this.verifySocialUser(args[0]);
      if (isNaN(args[1])) throw 'Not a valid amount';
      if (args[1] < 0) throw 'You cannot pay less than zero, whatcha trying to do? rob em?';
      else if (args[1] < 1) throw 'You paying \'em with air? boi don\'t make me slap you 👋';
      if (message.author.id === user) throw 'You cannot reward yourself, why did you even try it?';
      await this.cmdRew(message, user, parseInt(args[1]));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Award;