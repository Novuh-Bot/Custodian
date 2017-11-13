const { inspect } = require('util');
const Command = require('../../base/Command.js');

class Set extends Command {
  constructor(client) {
    super(client, {
      name: 'set',
      description: 'View or change settings for your server.',
      category: 'System',
      usage: 'set <view/get/edit> <key> <value>',
      guildOnly: true,
      aliases: ['setting', 'settings', 'conf'],
      permLevel: 'Administrator',
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars

    const settings = this.client.settings.get(message.guild.id);
  
    if (action === 'add') {
      if (!key) return message.reply('Please specify a key to add');
      if (settings[key]) return message.reply('This key already exists in the settings');
      if (value.length < 1) return message.reply('Please specify a value');

      settings[key] = value.join(' ');
  
      this.client.settings.set(message.guild.id, settings);
      message.reply(`${key} successfully added with the value of ${value.join(' ')}`);
    } else

    if (action === 'edit') {
      if (!key) return message.reply('Please specify a key to edit');
      if (!settings[key]) return message.reply('This key does not exist in the settings');
      if (value.length < 1) return message.reply('Please specify a new value');
    
      settings[key] = value.join(' ');

      this.client.settings.set(message.guild.id, settings);
      message.reply(`${key} successfully edited to ${value.join(' ')}`);
    } else
  
    if (action === 'del') {
      if (!key) return message.reply('Please specify a key to delete.');
      if (!settings[key]) return message.reply('This key does not exist in the settings');
      
      const response = await this.client.awaitReply(message, `Are you sure you want to permanently delete ${key}? This **CANNOT** be undone.`);

      if (['y', 'yes'].includes(response)) {

        delete settings[key];
        this.client.settings.set(message.guild.id, settings);
        message.reply(`${key} was successfully deleted.`);
      } else
      if (['n','no','cancel'].includes(response)) {
        message.reply('Action cancelled.');
      }
    } else
  
    if (action === 'get') {
      if (!key) return message.reply('Please specify a key to view');
      if (!settings[key]) return message.reply('This key does not exist in the settings');
      message.reply(`The value of ${key} is currently ${settings[key]}`);
    } else {
      message.channel.send(inspect(settings), {code: 'json'});
    }
  }
}

module.exports = Set;
