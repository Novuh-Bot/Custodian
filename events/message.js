const moment = require('moment');
require('moment-duration-format');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {

    if (message.author.bot) return;

    const defaults = this.client.config.defaultSettings;
    const settings = message.guild ? this.client.settings.get(message.guild.id) : defaults;
    message.settings = settings;
    
    const level = this.client.permlevel(message);

    const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}> `);
    const prefixMention = mentionPrefix.exec(message.content);

    const prefixes = [settings.prefix, defaults.prefix, `${prefixMention}`];
    let prefix = false;

    for (const thisPrefix of prefixes) {
      if (message.content.indexOf(thisPrefix) == 0) prefix = thisPrefix;
    }

    if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>$`))) {
      let mentionMsg = '';
      settings.prefix === defaults.prefix ? mentionMsg = `The prefix is \`${settings.prefix}\`.` : mentionMsg = `This server's prefix is \`${settings.prefix}\`, whilst the default prefix is \`${defaults.prefix}\``;
      return message.channel.send(mentionMsg);
    }

    if (!prefix && message.channel.type === 'dm') { 
      this.client.log('DM', `${message.author.username} ⇒ ${this.client.user.username}: ${message}`);
    }

    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();    

    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    if (!cmd) return;

    const rateLimit = await this.client.ratelimit(message, level, cmd.help.name, cmd.conf.cooldown); 
    
    if (typeof rateLimit == 'string') {
      this.client.log('Log', `${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) got ratelimited while running command ${cmd.help.name}`);
      return message.channel.send(`Please wait ${rateLimit.toPlural()} to run this command.`);
    }
    
    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send('This command is unavailable via private message. Please run this command in a guild.');

    if (level < this.client.levelCache[cmd.conf.permLevel]) {
      if (settings.systemNotice === 'true') {
        return message.channel.send(`You do not have permission to use this command.
Your permission level is ${level} (${this.client.config.permLevels.find(l => l.level === level).name})
This command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
      } else {
        return;
      }
    }

    message.author.permLevel = level;

    message.flags = [];
    while (args[0] && args[0][0] === '-') {
      message.flags.push(args.shift().slice(1));
    }
    
    this.client.log('Log', `[${moment(message.createdAt).format('h:mm:ss')}] ${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, 'CMD');
    console.log(message.type);

    if (message.channel.type === 'text') {      
      const mPerms = message.channel.permissionsFor(message.guild.me).missing(cmd.conf.botPerms);
      if (mPerms.includes('SEND_MESSAGES')) return;
      if (mPerms.length) return message.channel.send(`The bot does not have the following permissions \`${mPerms.join(', ')}\``);
    }

    cmd.run(message, args, level).catch(error => {
      console.log(error);
      message.channel.send(error);
    });
  }
};