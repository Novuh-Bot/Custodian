const Moderation = require('../../base/Moderation.js');
const ms = require('ms');

class Lockdown extends Moderation {
  constructor(client) {
    super(client, {
      name: 'lockdown',
      description: 'Locks down a channel.',
      usage: 'lockdown <time in ms>',
      category: 'Moderation',
      extended: 'Revokes chat permissions in a channel.',
      aliases: ['ld'],
      botPerms: ['MANAGE_CHANNELS', 'SEND_MESSAGES'],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    if (!this.client.lockit) this.client.lockit = [];
    const time = args.join(' ');
    const validUnlocks = ['release', 'unlock'];
    if (!time) throw `${message.author} |\`❌\`| ${lang.lockdownNoTime}`;

    if (validUnlocks.includes(time)) {
      message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: null
      }).then(() => {
        message.channel.send('Lockdown lifted.');
        clearTimeout(this.client.lockit[message.channel.id]);
        delete this.client.lockit[message.channel.id];
      }).catch(error => {
        console.log(error);
      });
    } else {
      message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: false
      }).then(() => {
        message.channel.send(`Channel locked down for ${ms(ms(time), { long:true })}`).then(() => {
          this.client.lockit[message.channel.id] = setTimeout(() => {
            message.channel.overwritePermissions(message.guild.id, {
              SEND_MESSAGES: null
            }).then(message.channel.send('Lockdown lifted')).catch(console.error);
            delete this.client.lockit[message.channel.id];
          }, ms(time));
        }).catch(error => {
          console.log(error);
        });
      });
    }
  }
}

module.exports = Lockdown;