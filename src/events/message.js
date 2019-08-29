const Event = require('../lib/structures/Event');

const moment = require('moment');
require('moment-duration-format');

class Message extends Event {
  constructor(client) {
    super(client, {
      name: 'message'
    });
  }

  async run(message) {
    let prefix;

    if (message.author.bot) return;
    
    const level = this.client.permlevel(message);
    message.author.permLevel = level;
    
    const added = await this.client.db.isServerAdded(message.guild.id);
    
    if (added === true) {
      const res = await this.client.db.query(`SELECT prefix FROM guilds WHERE id = ${message.guild.id}`);
      prefix = res.rows[0].prefix;
    } else {
      prefix = '--';
    }

    if (!prefix) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = await this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    if (!cmd) return;

    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send('This command is unavailable via private message. Please run this command in a guild.');


    message.flags = [];
    while (args[0] && args[0][0] === '-') {
      message.flags.push(args.shift().slice(1));
    }
    
    this.client.logger.command(`[${moment(message.createdAt).format('h:mm:ss')}] ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);

    if (message.channel.type === 'text') {
      const mPerms = this.client.permCheck(message, cmd.conf.botPerms);
      if (mPerms.length) return message.channel.send(`The bot does not have the following permissions \`${mPerms.join(', ')}\``);
    }

    cmd.run(message, args, level).catch(error => {
      console.log(error);
      message.channel.send(error);
    });
  }
}

module.exports = Message;