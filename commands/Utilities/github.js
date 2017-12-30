const Command = require('../../base/Command.js');
const snek = require('snekfetch');

class Github extends Command {
  constructor(client) {
    super(client, {
      name: 'github',
      description: 'Allows you to do the thing.',
      category: 'Utilities',
      usage: 'github <author|organization> <repository name>',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    try {
      const authOrOrg = args[0];
      const repo = args[1];
      
      const ghURL = `https://www.github.com/${authOrOrg}/${repo}`;

      urlExists(ghURL, function(exists) {
        if (ghURL.status = 404) {
          throw 'Something went wrong, try again later';
        } else {
          message.channel.send(`${ghURL}`);
        }
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Github;

function urlExists(ghURL, callback) {
  snek.get(ghURL).then(function(status) {
    if (ghURL.status = 404) return;
  });
}