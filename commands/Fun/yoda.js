const Social = require('../../base/Social.js');
const snek = require('snekfetch');

class Yoda extends Social {
  constructor(client) {
    super(client, {
      name: 'yoda',
      description: 'With this, like Yoda you can speak. Yes',
      category: 'Fun',
      usage: 'yoda <message>',
      extended: 'This command will turn any supplied text into Yoda speech, results may vary.',
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const speech = args.join(' ');
      if (speech.length < 2) throw `${message.author} |\`❌\`| Invalid command usage, you must supply text for Yoda. Yes.`;
      const { text } = await snek.get(`http://yoda-api.appspot.com/api/v1/yodish?text=${encodeURIComponent(speech.toLowerCase())}`);
      message.channel.send(JSON.parse(text).yodish);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Yoda;