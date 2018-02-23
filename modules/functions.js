const { inspect } = require('util');
const moment = require('moment');
require('moment-duration-format');

module.exports = (client) => {
  
  client.ratelimit = async (message, level, key, duration) => {
    if (level > 2) return false;
    
    duration = duration * 1000;
    const ratelimits = client.ratelimits.get(message.author.id) || {}; //get the ENMAP first.
    if (!ratelimits[key]) ratelimits[key] = Date.now() - duration; //see if the command has been run before if not, add the ratelimit
    const differnce = Date.now() - ratelimits[key]; //easier to see the difference
    if (differnce < duration) { //check the if the duration the command was run, is more than the cooldown
      return moment.duration(duration - differnce).format('D [days], H [hours], m [minutes], s [seconds]', 1); //returns a string to send to a channel
    } else {
      ratelimits[key] = Date.now(); //set the key to now, to mark the start of the cooldown
      client.ratelimits.set(message.author.id, ratelimits); //set it
      return true;
    }
  };

  client.checkConsent = async (client, message, msg) => {
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
        const channel = (await client.guilds.get('313460664699977729').createChannel(message.author.tag.replace('#', '-').toLowerCase(), 'text')).setTopic(message.author.id).then(c => {
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

  client.wait = require('util').promisify(setTimeout);

  process.on('uncaughtException', (err) => {
    const errorMessage = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    const errorMsg = inspect(errorMessage, { depth: 10 });
    console.error('Uncaught Exception: ', errorMsg);
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
  });
};