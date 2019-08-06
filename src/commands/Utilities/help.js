const Command = require('../../lib/structures/Command');

class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      description: 'Display this!',
      category: 'Utilities',
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const res = await this.client.db.selectPrefix(message.guild.id);
    const prefix = res.rows[0].prefix;

    if (!args[0]) {
      const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level) : this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);
      
      const commandNames = myCommands.keyArray();
      const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
      let currentCategory = '';
      let output = `= Command List =\n\n[Use ${prefix}help <commandname> for details]\n`;
      const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
      sorted.forEach( c => {
        const cat = c.help.category.toProperCase();
        if (currentCategory !== cat) {
          output += `\u200b\n== ${cat} ==\n`;
          currentCategory = cat;
        }
        output += `${prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
      });
      message.channel.send(output, {code:'asciidoc', split: { char: '\u200b' }});
    } else {
      let command = args[0];
      if (this.client.commands.has(command)) {
        command = this.client.commands.get(command);
        if (level < this.client.levelCache[command.conf.permLevel]) return;
        message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\nalises:: ${command.conf.aliases.size > 0 ? command.conf.aliases.join(', ') : 'No aliases'}`, {code:'asciidoc'});
      }
    }
  }
}

module.exports = Help;