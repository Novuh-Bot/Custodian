const Command = require('../../base/Command.js');
const RichDisplay = require('../../modules/RichDisplay.js');

const { RichEmbed } = require('discord.js');

const perpage = 10;

class Ehelp extends Command {
  constructor(client) {
    super(client, {
      name: 'ehelp',
      description: 'Experimental paginated help.',
      category: 'System',
      cooldown: 30,
      botPerms: ['ADD_REACTIONS', 'EMBED_LINKS', 'SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, [type, page], level) {
    const display = new RichDisplay(new RichEmbed()
      .setColor(message.guild.me.highestRole.color || 5198940)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)
    );
    
    let currentCategory = '';

    const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level) : this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);


    const sorted = this.client.commands.sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    if (!type) {
      const description = `Command category list\n\nUse \`${message.settings.prefix}help 
      <category>\` to find commands for a specific category`;
      const output = sorted.filter(c => !(level < 10 && c.help.category == 'Owner') || !(c.help.category === 'NSFW' && !message.channel.nsfw)).map(c => {
        const cat = c.help.category.toProperCase();
        if (currentCategory !== cat && !type) {
          currentCategory = cat;
          return `\n\`${message.settings.prefix}help ${cat.toLowerCase()}\` | Shows ${cat} commands`;
        }
      }).join('');
      display.addPage(template => template.setDescription(output).setTitle('Command Category List'));
    } else {
      let n = 0;
      sorted.forEach(c => {
        if (c.help.category.toLowerCase() === type.toLowerCase()) {
          n++;
        }
      });
    
      let output = '';
      let num = 0;
      const pg = parseInt(page) && parseInt(page) <= Math.ceil(n / perpage) ? parseInt(page) : 1;
      for (const c of sorted.values()) {
        if (c.help.category.toLowerCase() === type.toLowerCase()) {
          if (c.help.category === 'Owner' && level < 10 ) return;
          if (c.help.category === 'NSFW' && !message.channel.nsfw) return;
          if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
            if (level < this.client.levelCache[c.conf.permLevel]) return;
            output += `\n\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 50 ? c.help.description.slice(0,50) +'...': c.help.description}`;
          }
          num++;
        }
      }
    
      if (num) {
        display.addPage(template => template.setDescription(`A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\`\n\n${num > 10 && pg === 1 ? `To view more commands do\` ${message.settings.prefix}help <category> 2\`` : '' }`).addField('Commands', output));
      }
    }

    return display.run(await message.channel.send('Loading embed.'));
  }
}

module.exports = Ehelp;