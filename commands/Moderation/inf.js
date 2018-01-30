const Moderation = require('../../base/Moderation.js');

class Inf extends Moderation {
  constructor(client) {
    super(client, {
      name: 'inf',
      description: 'Searches for a moderation action.',
      usage: 'inf <case number>',
      aliases: ['infraction'],
      extended: 'Searches for information about a specified moderation action.',
      category: 'Moderation',
      botPerms: ['READ_MESSAGES', 'SEND_MESSAGES'],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    const id = args.shift();
    const modlog = message.guild.channels.find('name', settings.modLogChannel);
    await modlog.fetchMessages({limit:100}).then((messages) => {
      const caseLog = messages.filter(m => m.author.id === this.client.user.id &&
            m.embeds[0] &&
            m.embeds[0].type === 'rich' &&
            m.embeds[0].footer &&
            m.embeds[0].footer.text.startsWith('Case') &&
            m.embeds[0].footer.text === `Case ${id}`
      ).first();
      modlog.fetchMessage(caseLog.id).then(logMsg => {
        const reason = logMsg.embeds[0];
        reason.reason = reason.description.split('**Reason:** ')[1];
        reason.mod = reason.description.split('\n')[2].replace('**Moderator:** ', '');
        message.channel.send(`\`\`\`|     ID     |     Type     |     Moderator     |     Active     |     Reason     |\n|---------------------------------------------------------------------------------|\n|  ${id}     |     Action     |     ${reason.mod}     |     Yes     |     ${reason.reason}     |\`\`\``);
      });
    });
  }
}

module.exports = Inf;