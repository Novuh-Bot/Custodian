const Command = require('../../base/Command.js');
const {RichEmbed} = require('discord.js');

class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      description: 'Displays all the available commands for your permission level.',
      category: 'System',
      usage: 'help [command]',
      aliases: ['h', 'halp'],
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    if (!args[0]) {
      const settings = message.guild ? this.client.settings.get(message.guild.id) : this.client.config.defaultSettings;
      
      const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level) : this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);
      
      const commandNames = myCommands.keyArray();
      const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
      let currentCategory = '';
      let output = `= Command List =\n\n[Use ${this.client.config.defaultSettings.prefix}help <commandname> for details]\n`;
      const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
      sorted.forEach( c => {
        const cat = c.help.category.toProperCase();
        if (currentCategory !== cat) {
          output += `\n== ${cat} ==\n`;
          currentCategory = cat;
        }
        output += `${settings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
      });
      await message.channel.send(output, {code:'asciidoc', split: true});
      
      const TOS = new RichEmbed()
        .setAuthor('Custodian', `${this.client.user.displayAvatarURL}`)
        .setTitle('Custodian Terms of Service')
        .setFooter('\n\nCustodian © 2017 OGNovuh', `${this.client.user.displayAvatarURL}`)
        .setTimestamp()
        .setDescription('By using this bot, Custodian, or joining/being in any guild/server that the bot, Custodian, is in, you automatically agree that you allow the bot, Custodian, to do the following.')
        .addField('\u200B', '➢ Collect/Store the following data on you:\n➢ Username and Discriminator\n➢ User ID\n➢ Deleted Messages\n➢ Edited Messages\n➢ Message IDs\n➢ Infractions\n➢ Nicknames');
      message.channel.send({ embed: TOS });
    } else {
      let command = args[0];
      const settings = message.guild ? this.client.settings.get(message.guild.id) : this.client.config.defaultSettings;
      if (this.client.commands.has(command)) {
        command = this.client.commands.get(command);
        if (level < this.client.levelCache[command.conf.permLevel]) return;
        message.channel.send(`= ${command.help.name} = \n${command.help.description}\ncategory:: ${command.help.category}\nusage:: ${settings.prefix}${command.help.usage}\naliases:: ${command.conf.aliases.join(', ')}\ndetails:: ${command.help.extended}\npermissions:: ${command.conf.botPerms.join(', ')}`, {code:'asciidoc'});
      }
    }
  }
}


module.exports = Help;