const Command = require('../../base/Command.js');
const { RichEmbed } = require('discord.js');

class Exset extends Command {
  constructor(client) {
    super(client, {
      name: 'exset',
      description: 'View or change settings for your server.',
      category: 'System',
      usage: 'exset <view/get/edit> <key> <value>',
      guildOnly: true,
      aliases: ['setting', 'settings'],
      permLevel: 'Administrator',
      botPerms: ['SEND_MESSAGES']
    });
  }
  
  async run(message, args, level) {
    const settings = this.client.settings.get(message.guild.id);

    if (!message.flags.length) {
      const embed = new RichEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL)
        .setFooter(this.client.user.username, this.client.user.avatarURL)
        .setTimestamp()
        .setColor('RANDOM')
        .addField('Prefix', `${settings.prefix}`, true)
        .addField('Language', `${settings.lang}`, true)
        .addField('Mod Role', `${settings.modRole}`, true)
        .addField('Admin Role', `${settings.adminRole}`, true)
        .addField('Mute Role', `${settings.muteRole}`, true)
        .addField('System Notice', `${settings.systemNotice}`, true)
        .addField('Welcome Enabled', `${settings.welcomeEnabled}`, true)
        .addField('Welcome Channel', `${settings.welcomeChannel}`, true)
        .addField('Welcome Message', `${settings.welcomeMessage}`, true)
        .addField('Extensive Logging', `${settings.extensiveLogging}`, true)
        .addField('Level Up Notice', `${settings.levelNotice}`, true)
        .addField('Minimum Points', `${settings.minPoints}`, true)
        .addField('Maximum Points', `${settings.maxPoints}`, true)
        .addField('Daily Reward', `${settings.pointsReward}`, true)
        .addField('Daily Time', `${settings.dailyTime}`, true)
        .addField('Cost Multiplier', `${settings.costMulti}`, true)
        .addField('Custom Emoji', `${settings.customEmoji}`, true)
        .addField('Global Emoji ID', `${settings.gEmojiID}`, true)
        .addField('Server Emoji', `${settings.uEmoji}`, true)
        .addField('Request Channel', `${settings.requestChannel}`, true)
        .addField('Request Role', `${settings.requestRole}`, true);
      message.channel.send({ embed });
    }
    
    switch (message.flags[0]) {
      case ('add'): {
        const key = args[1];
        const value = args[2];
        if (!key) return message.reply('Please specify a key to add.');
        if (settings[key]) return message.reply('This key already exists in the settings.');
        if (value.length < 1) return message.reply('Please specify a value');

        settings[key] = value.join(' ');

        this.client.settings.get(message.guild.id, settings);
        message.reply(`${key} successfully added with the value of ${value.join(' ')}`);
        break;
      }

      case ('edit'): {
        if (!key) return message.reply('Please specify a key to edit');
        if (!settings[key]) return message.reply('This key does not exist in the settings');
        if (value.length < 1) return message.reply('Please specify a new value');
      
        settings[key] = value.join(' ');
  
        this.client.settings.set(message.guild.id, settings);
        message.reply(`${key} successfully edited to ${value.join(' ')}`);
        break;
      }

      case ('del'): {
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
        break;
      }

      case ('get'): {
        if (!key) return message.reply('Please specify a key to view');
        if (!settings[key]) return message.reply('This key does not exist in the settings');
        message.reply(`The value of ${key} is currently ${settings[key]}`);
      }
    }
  }
}

module.exports = Exset;