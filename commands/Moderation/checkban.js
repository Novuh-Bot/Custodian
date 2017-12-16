const Moderation = require('../../base/Moderation.js');

class Checkban extends Moderation {
  constructor(client) {
    super(client, {
      name: 'checkban',
      description: 'Checks to see if a user is banned.',
      usage: 'checkban <user id | user mention>',
      category: 'Moderation',
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) {
    message.channel.send('Coming soon!');
  }
}

module.exports = Checkban;