const Command = require('../../base/Command.js');
const config = require('../../config.js');
const {RichEmbed} = require('discord.js');

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      description: 'Evaluates arbitrary Javascript.',
      category:'System',
      usage: 'eval < -haste | -post | -direct | -log > <expression>',
      aliases: ['ev'],
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) {
    if (!message.flags.length) {
      throw `|\`❌\`| ${this.help.usage}`;
    }

    switch (message.flags[0]) {
      case ('haste'): {
        const code = args.join(' ');
        const evaled = eval(code);
        const clean = await this.client.clean(this.client, evaled);
        const hasteURL = await require('snekfetch')
          .post('https://hastebin.com/documents')
          .send(clean).catch(e => {throw new Error(`Error posting data: ${e}`);});
        const url = `https://hastebin.com/${hasteURL.body.key}.js`;
        message.channel.send(`Here is the output: ${url}.`);
        break;
      }

      case ('post'): {
        const code = args.join(' ');
        const evaled = eval(code);
        const clean = await this.client.clean(this.client, evaled);
        const embed = new RichEmbed()
          .setAuthor('Custodian', 'https://cdn.discordapp.com/avatars/379424813170819083/ed4021d7989fa4419fa1583af3f8898a')
          .setFooter('Custodian')
          .setColor('RANDOM')
          .setTimestamp()
          .addField('Input :inbox_tray:', `\`\`\`\n${args}\n\`\`\``)
          .addField('Output :outbox_tray:', `\`\`\`\n${clean}\n\`\`\``);
        message.channel.send({ embed });
        break;
      }

      case ('direct'): {
        const code = args.join(' ');
        const evaled = eval(code);
        const clean = await this.client.clean(this.client, evaled);
        const embed = new RichEmbed()
          .setAuthor('Custodian', 'https://cdn.discordapp.com/avatars/379424813170819083/ed4021d7989fa4419fa1583af3f8898a')
          .setFooter('Custodian')
          .setColor('RANDOM')
          .setTimestamp()
          .addField('Input :inbox_tray:', `\`\`\`\n${args}\n\`\`\``)
          .addField('Output :outbox_tray:', `\`\`\`\n${clean}\n\`\`\``);
        message.author.send({ embed });
        break;
      }

      case ('log'): {
        const code = args.join(' ');
        const evaled = eval(code);
        const clean = await this.client.clean(this.client, evaled);
        const embed = new RichEmbed()
          .setAuthor('Custodian', 'https://cdn.discordapp.com/avatars/379424813170819083/ed4021d7989fa4419fa1583af3f8898a')
          .setFooter('Custodian')
          .setColor('RANDOM')
          .setTimestamp()
          .addField('Input :inbox_tray:', `\`\`\`\n${args}\n\`\`\``)
          .addField('Output :outbox_tray:', `\`\`\`\n${clean}\n\`\`\``);
        this.client.channels.get(`${config.logChannel}`).send({ embed });
      }
    }
  }
}

module.exports = Eval;