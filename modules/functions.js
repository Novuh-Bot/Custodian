const { Message } = require('discord.js');

module.exports = (client) => {
  
  /**
   * Check to gain consent to store messages from the user, and open a support case under their account name and ID.
   * @param {Client} client The client that is calling this function.
   * @param {message} message The message on which the check is being preformed.
   * @param {msg} msg The supplied message that is sent to support.
   */
  client.checkConsent= async (client, message, msg) => {
    const ticketIdentifier = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    const embed = client.supportMsg(message, msg, ticketIdentifier);
    const agree = ['yes', 'y'];
    const disagree = ['no', 'n'];
    const consent = client.consent.get(message.author.id);
    const channel = client.guilds.get('335951728560046080').channels.exists('topic', message.author.id);
    if (!consent) client.consent.set(message.author.id, false);
    if (consent && channel) {
      this.client.channels.find('topic', message.author.id).send({
        embed
      }).then(() => message.channel.send('Sent Successfully'));
    } else {
      const response = await client.awaitReply(message, '```By submitting the Support ticket below, you authorise the bot, the bot creator, and other bot support members ("the Staff") to store and use your Username, Discriminator, Message Content, and any other End User Data in matters relative to usage of the bot, record keeping, and support. You also agree not to hold the Staff responsible for any actions that are taken, that also comply with these terms.```\n\nDo you wish to send this message? (**y**es | **n**o)\n\n\nReply with `cancel` to cancel the message. The message will timeout after 60 seconds.\n\n\n', 60000, embed);
      if (agree.includes(response)) {
        client.consent.set(message.author.id, true);
        const channel = (await client.guilds.get('335951728560046080').createChannel(message.author.tag.replace('#', '-').toLowerCase(), 'text')).setTopic(message.author.id).then(c => {
          c.send({
            embed
          });
          message.channel.send(`Support channel opened. Your ticket ID is ${ticketIdentifier}`);
        });
      } else

      if (disagree.includes(response)) {
        message.channel.send('Cancelled message.');
      } else {
        message.channel.send('That is not a valid response.');
      }
    }
  };

  /**
   * Support message to be sent to the support guild.
   * @param {message} message The message object.
   * @param {msg} msg The message that is sent to support.
   * @param {ticketIdentifier} ticketIdentifier Case ticket identifier.
   */
  client.supportMsg = (message, msg, ticketIdentifier) => {
    const {
      RichEmbed
    } = require('discord.js');
    const embed = new RichEmbed()
      .setColor(0x00ffb8)
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setFooter(ticketIdentifier)
      .setDescription(msg)
      .setTimestamp();
    return embed;
  };

  /**
   * Simplified method of awaitMessages. Creates a message filter searching for replies from the author.
   * @param {msg} msg Message object.
   * @param {message} question Message object assigned to the question value.
   * @param {integer} limit Integer defined to the limit value.
   */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m=>m.author.id == msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  /**
   * Function to clean an evaled string.
   * @param {Client} client 
   * @param {text} text 
   */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == 'Promise')
      text = await text;
    if (typeof evaled !== 'string')
      text = require('util').inspect(text, {depth: 0});

    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    return text;
  };

  /**
   * Simplified version of getting Guild settings.
   * @param {GuildID} id 
   */
  client.getSettings = (id) => {
    const defaults = client.getSettings('default');
    let guild = client.getSettings(id);
    if (typeof guild != 'object') guild = {};
    const returnObject = {};
    Object.keys(defaults).forEach((key) => {
      returnObject[key] = guild[key] ? guild[key] : defaults[key];
    });
    return returnObject;
  };
  
  /**
   * Simplified version of setting Guild settings.
   * @param {GuildID} id 
   * @param {Value} newSettings 
   */
  client.writeSettings = (id, newSettings) => {
    const defaults = client.getSettings('default');
    let settings = client.getSettings(id);
    if (typeof settings != 'object') settings = {};
    for (const key in newSettings) {
      if (defaults[key] !== newSettings[key])  {
        settings[key] = newSettings[key];
      }
    }
    client.settings.set(id, settings);
  };


  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };

  Message.prototype.lang = function(message, lang, category, key) {
    const serverLang = require(`../languages/${lang}/${category}/${category}.json`);
    message.channel.send(`${serverLang[key]}`);
  };

  client.wait = require('util').promisify(setTimeout);

  process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
  });
};