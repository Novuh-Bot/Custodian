const Social = require('../../base/Social.js');

class Deduct extends Social {
  constructor(client) {
    super(client, {
      name: 'deduct',
      description: 'Takes points away from the nominated user.',
      usage: 'deduct <member:user> <amount:integer>',
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
      const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
      const generalErr = require(`../../languages/${serverLang}/general.json`);
      
      const user = await this.verifySocialUser(args[0]);
      if (isNaN(args[1])) throw `${generalErr.NaN}`;
      if (args[1] < 0) throw `${lang.incorrectDeductAmnt}`;
      else if (args[1] < 1) throw `${lang.incorrectDeductBal}`;
      if (message.author.id === user) throw `${lang.socialDeductYrslf}`;
      await this.cmdPun(message, user, parseInt(args[1]));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Deduct;