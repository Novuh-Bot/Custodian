/*
  Weather Command Supplied by Nomsy#7453 (139457768120647680)
  http://evie.ban-hammered.me/i/dp9gl.png
*/
const snekfetch = require('snekfetch');
const Command = require('../../base/Command.js');

class Weather extends Command {
  constructor(client) {
    super(client, {
      name: 'weather',
      description: 'The weather report.',
      usage: 'weather <location:string>',
      category: 'Utilities',
      extended: 'Get the weather for the nominated location.',
      aliases: ['w'],
      botPerms: ['SEND_MESSAGES'],
      cooldown: 30
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const { lang } = this.client.settings.get(message.guild.id);
      
      const _message = await message.lang(message, lang, this.help.category, 'weatherReply');
      if (!args[0]) {
        _message.delete();
        message.lang(message, lang, this.help.category, 'weatherNoArgs');
      } else {
        const cb = '```';
        snekfetch.get(`http://wttr.in/${args.join(' ').replace(' ', '%20')}?T0`).then((data) => {
          _message.edit(`${cb}\n${data.text}\n${cb}`);
        }).catch(console.error);
      }
    
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Weather;