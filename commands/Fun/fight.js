const Command = require('../../base/Command.js');
const fights = [
  ', but they tripped over a rock and fell in the ocean.',
  ', but they hurt themselves in confusion.',
  '. SHORYUKEN!',
  '. HADOUKEN!',
  '. KA-POW!',
  'with a pillow.',
  'with a large fish.',
  ', but they stumbled over their shoe laces.',
  ', but they miss.',
  'with a burnt piece of toast.',
  ', but it wasn\'t every effective...',
  '. It did 16 damage. I expected more.',
  '. Does he really think he can take them on?',
  '. DEMACIA'
];

class Fight extends Command {
  constructor(client) {
    super(client, {
      name: 'fight',
      description: 'Sends a fight message.',
      extended: 'Mention a user to \'fight\' them.',
      usage: 'fight <mention>',
      aliases: [],
      category: 'Fun',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    const user = message.mentions.users.first();
    if (!user) throw `${message.author} |\`❌\`| ${lang.fightNoMntn}`;
    if (message.mentions.users.first() < 1) return message.reply(`|\`❌\`| ${lang.fightNoMntn}`);
    message.channel.send(`${message.author.username} is fighting ${user.username}${fights[Math.floor(Math.random() * fights.length)]}`);
  }
}

module.exports = Fight;