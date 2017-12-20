const Social = require('../../base/Social.js');

class Deduct extends Social {
  constructor(client) {
    super(client, {
      name: 'deduct',
      description: 'Takes points away from the nominated user.',
      usage: 'deduct <@mention|userid> <amount>',
      category:'Moderation',
      extended: 'This will take points away from a nominated user.',
      cost: 5,
      hidden: true,
      aliases: ['punish', 'take'],
      botPerms: [],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const settings = this.client.settings.get(message.guild.id);
      const serverLang = `${settings.lang}`;
      const lang = require(`../../languages/${setLang}.json`);
      const user = await this.verifySocialUser(args[0]);
      if (isNaN(args[1])) throw 'Not a valid amount';
      if (args[1] < 0) throw 'You cannot deduct less than zero, whatcha trying to do? reward em?';
      else if (args[1] < 1) throw 'You trying to deduct their air? boi don\'t make me slap you 👋';
      if (message.author.id === user) throw 'You cannot punish yourself, why did you even try it?';
      await this.cmdPun(message, user, parseInt(args[1]));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Deduct;