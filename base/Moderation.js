const Command = require('./Command.js');

class Moderation extends Command {
  
  constructor(client, options) {
    super(client, Object.assign(options, {
      category: 'Moderation',
      guildOnly: true,
      permLevel: 'Moderator'
    }));

    this.actions = {
      w: { color: 0xFFFF00, display: 'Warn'    },
      m: { color: 0xFF9900, display: 'Mute'    },
      k: { color: 0xFF3300, display: 'Kick'    },
      hb: { color: 0xFF9933, display: 'Hackban'},
      s: { color: 0xFF2F00, display: 'Softban' },
      b: { color: 0xFF0000, display: 'Ban'     },
      u: { color: 0x006699, display: 'Unban'   },
      ld: { color: 0x7289DA, display: 'Lockdown'},
      bl: { color: 0x7289DA, display: 'Blacklist'}
    };
    
  }

  async modCheck(message, user, level) {
    try {
      const modBot = message.guild.me;
      const id = await this.verifyUser(user);
      const target = await message.guild.fetchMember(id).catch(() => { message.channel.send(`${message.author}, |\`❓\`| Cannot find member in guild.`); });
      if (target.highestRole.position >= modBot.highestRole.position) return message.channel.send(`${message.author}, |\`🛑\`| You cannot perform that action on someone of equal, or higher role.`);
      if (message.author.id === id) return message.channel.send(`${message.author}, |\`🛑\`| You cannot moderate yourself.`);
      const author = target.user;
      const member = target;
      const msg = { author:author, member:member, guild: message.guild, client: this.client, channel: message.channel };
      if (level <= this.client.permlevel(msg)) return message.channel.send(`${message.author}, |\`🛑\`| You cannot perform that action on someone of equal, or a higher permission level.`);
      return target;
    } catch (error) {
      throw error;
    }
  }

  async hackCheck(message, user, level) {
    try {
      const modBot = message.guild.me;
      const id = await this.verifyUser(user);
      const target = await this.client.fetchUser(id).catch(() => { message.channel.send(`${message.author}, |\`❓\`| I cannot fetch that member.`); });
      if (message.author.id === id) message.channel.send(`${message.author}, |\`🛑\`| You cannot moderate yourself.`);
      return target;
    } catch (error) {
      throw error;
    }
  }

  embedSan(embed) {
    embed.message ? delete embed.message : null;
    embed.footer ? delete embed.footer.embed : null;
    embed.provider ? delete embed.provider.embed : null;
    embed.thumbnail ? delete embed.thumbnail.embed : null;
    embed.image ? delete embed.image.embed : null;
    embed.author ? delete embed.author.embed : null;
    embed.fields ? embed.fields.forEach(f => {delete f.embed;}) : null;
    return embed;
  }
  
  async caseNumber(client, modlog) {
    const messages = await modlog.fetchMessages({limit: 100});
    const log = messages.filter(m => m.author.id === client.user.id
      && m.embeds[0]
      && m.embeds[0].type === 'rich'
      && m.embeds[0].footer
      && m.embeds[0].footer.text.startsWith('Case')
    ).first();
    if (!log) return 1;
    const thisCase = /Case\s(\d+)/.exec(log.embeds[0].footer.text);
    return thisCase ? parseInt(thisCase[1]) + 1 : 1;
  }
  
  async caseEmbed(color, description, author, timestamp, footer) {
    const embed = {
      'color': color,
      'description': description,
      'author': {
        'name': author
      },
      'timestamp': timestamp,
      'footer': {
        'text': footer
      }
    };
    return embed;
  }

  async buildModLog(client, guild, action, target, mod, reason) {
    const settings = client.settings.get(guild.id);
    const caseNumber = await this.caseNumber(client, guild.channels.find('name', settings.modLogChannel));
    const thisAction = this.actions[action];
    if (reason.length < 1) reason = `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNumber} <reason>.`;
    const embed = await this.caseEmbed(thisAction.color, `**Action:** ${thisAction.display}\n**Target:** ${target.user.tag} (${target.id})\n**Moderator:** ${mod.tag} (${mod.id})\n**Reason:** ${reason}`,`${mod.tag} (${mod.id})`, new Date(), `Case ${caseNumber}`);
    return guild.channels.find('name', settings.modLogChannel).send({embed});
  }

  async buildHackLog(client, guild, action, target, mod, reason) {
    const settings = client.settings.get(guild.id);
    const caseNumber = await this.caseNumber(client, guild.channels.find('name', settings.modLogChannel));
    const thisAction = this.actions[action];
    if (reason.length < 1) reason = `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNumber} <reason>.`;
    const embed = await this.caseEmbed(thisAction.color, `**Action:** ${thisAction.display}\n**Target:** N/A (${target})\n**Reason:** ${reason}`,`${mod.tag} (${mod.id})`, new Date(), `Case ${caseNumber}`);
    return guild.channels.find('name', settings.modLogChannel).send({embed});
  }
  
  // await this.buildModLog(this.client, message.guild, 'b', target, message.author, reason);

  async buildRequest(client, guild, author, action, reason) {
    const settings = client.settings.get(guild.id);
    const thisRequester = author;
    const thisAction = action;
    const thisReason = reason;
    const request = `= Action Requested =\n\n[ Requested by ${thisRequester} ]\n\n== Action ==\n${thisAction}\n\n== Reason == \n${thisReason}`;
    const channel = guild.channels.find('name', settings.requestChannel);
    await channel.send(`<@&${settings.requestRole}>`);
    channel.send(`${request}`, {code:'asciidoc'});
  } 

  
}



module.exports = Moderation;