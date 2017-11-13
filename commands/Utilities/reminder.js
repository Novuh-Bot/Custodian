const Command = require('../../base/Command.js');
const ms = require('ms');

function regCheck(message, reminder) {
  const remind = /([0-9]{1,3})\ (seconds|second|minutes|minute|hours|hour|days|day|weeks|week|months|month|years|year)/g.exec(reminder);
  const time = remind[0];
  let input = remind.input;
  input = input.replace(/\ \in\ /, ''); 
  input = input.replace(remind[0], ''); 
  input = input.replace(/\bme/, ''); 
  input = input.replace(/\bto/, ''); 
  input = input.replace(/ +/, ''); 
  return `${input}#${time}`;
}

function getTime(reminder) {
  const remind = /([0-9]{1,3})\ (seconds|second|minutes|minute|hours|hour|days|day|weeks|week|months|month|years|year)/g.exec(reminder);
  const time = ms(remind[0]);
  return time;
}

class Reminder extends Command {
  constructor(client) {
    super(client, {
      name: 'reminder',
      description: 'Sets a reminder.',
      usage: 'reminder [me] <reminder message>',
      extended: 'Tells the bot to remind you of something at a specified time.',
      category: 'Utilities',
      aliases: ['remember', 'remind'],
      botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!args.length) return message.channel.send('Incorrect usage, you must supply a reminder message.');
    try {
      const blah = regCheck(message, args.join(' '));
      this.client.reminders.set(`${message.guild.id}-${message.author.id}-${message.createdTimestamp + getTime(blah.split('#')[1])}`, {
        id: `${message.author.id}-${message.guild.id}`,
        reminder: blah.split('#')[0],
        reminderTimestamp: message.createdTimestamp + getTime(blah.split('#')[1])
      });
      setTimeout(async () => {
        message.author.send(`Here is your reminder: ${blah.split('#')[0]}`);
        const reminder = this.client.reminders.find('id', `${message.author.id}-${message.guild.id}`);
        this.client.reminders.delete(`${message.guild.id}-${message.author.id}-${reminder.reminderTimestamp}`);
      }, getTime(blah.split('#')[1]));
  
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Reminder;