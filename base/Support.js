const Command = require('./Command.js');

class Support extends Command {

  constructor(client, options) {
    super(client, Object.assign(options, {
      category: 'Support',
      guildOnly: false,
      permLevel: 'Bot Support'
    }));
  }

  async checkConsent(client, message, msg) {
    const embed = this.supportMsg(message, msg);
    const agree = ['yes', 'y'];
    const disagree = ['no', 'n'];
    const consent = this.client.consent.get(message.author.id);
    const channel = this.client.guilds.get('335951728560046080').channels.exists('topic', message.author.id);
    if (!consent) this.client.consent.set(message.author.id, false);
    if (consent && channel) {
      this.client.channels.find('topic', message.author.id).send({
        embed
      }).then(() => message.channel.send('Sent Successfully'));
    } else {
      const response = await this.client.awaitReply(message, '```By submitting the Support ticket below, you authorise the bot, the bot creator, and other bot support members ("the Staff") to store and use your Username, Discriminator, Message Content, and any other End User Data in matters relative to usage of the bot, record keeping, and support. You also agree not to hold the Staff responsible for any actions that are taken, that also comply with these terms.```\n\nDo you wish to send this message? (**y**es | **n**o)\n\n\nReply with `cancel` to cancel the message. The message will timeout after 60 seconds.\n\n\n', 60000, embed);
      if (agree.includes(response)) {
        this.client.consent.set(message.author.id, true);
        const channel = (await this.client.guilds.get('335951728560046080').createChannel(message.author.tag.replace('#', '-').toLowerCase(), 'text')).setTopic(message.author.id).then(c => {
          c.send({
            embed
          });
          message.channel.send('Support channel opened. Your ticket ID is Math.random().toString(36).replace(/[^a-z]+/g, \'\')');
        });
      } else

      if (disagree.includes(response)) {
        message.channel.send('Cancelled message.');
      } else {
        message.channel.send('That is not a valid response.');
      }
    }
  }

  async supportMsg(message, msg) {
    const {
      RichEmbed
    } = require('discord.js');
    const embed = new RichEmbed()
      .setColor(0x00ffb8)
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setDescription(msg)
      .setTimestamp();
    return embed;
  }
}

module.exports = Support;