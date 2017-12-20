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
      usage: 'weather <location>',
      category: 'Utilities',
      extended: 'Get the weather for the nominated location.',
      aliases: ['w'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const settings = this.client.settings.get(message.guild.id);
      const serverLang = `${settings.lang}`;
      const lang = require(`../../languages/${setLang}.json`);
      const _message = await message.reply(`${lang.weatherReply}`);
      if (!args[0]) {
        _message.edit(`${lang.weatherNoArgs}`);
      } else {
        const cb = '```'; // lazy af yo
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