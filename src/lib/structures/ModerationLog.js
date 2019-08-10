const { MessageEmbed } = require('discord.js');
const { read } = require('node-yaml');

class ModerationLog {
  constructor(guild) {
    this.guild = guild;
    this.client = guild.client;

    this.case = null;
    this.reason = null;
    this.type = null;
    this.moderator = null;
    this.user = null;
  }

  setType(data) {
    this.type = data;
    return this;
  }
  
  setUser(data) {
    this.user = {
      id: data.id,
      tag: data.tag
    };
    return this;
  }

  setModerator(data) {
    this.moderator = {
      id: data.id,
      tag: data.tag,
      avatar: data.displayAvatarURL()
    };
    return this;
  }

  setReason(data) {
    if (reason instanceof Array) reason = reason.join(' ');
    this.reason = reason;
    return this;
  }


  async send() {
    // TODO: Write, gets guild settings
    const res = await this.client.db.getGuildSettings(this.guild.id);
    const { rich, logChannel } = res.rows[0];

    const channel = this.guild.channels.get(logChannel);
    if (!channel) throw 'The modlog channel doesn\'t exist, did it get deleted? Remember, it must be a channel ID.';

    if (rich == true) {
      const _case = await this.getCase();
      await this.packCase();
      const embed = await this.embed();
      return channel.send({ embed });
    } else {
      await this.getCase();
      await this.packCase();      
      const modlog = await this.buildString(this.type);
      return channel.send(modlog);
    }
  }

  async getCase() {
    // TODO: Write, returns length of infractions table
    const _case = await this.client.db.getInfractionsSize();
    this.case = Number(_case) + 1;
  }

  async packData() {
    await this.client.db.createInfraction(this.moderator.tag, this.moderator.id, this.case, this.user.tag, this.user.id, this.type, this.reason);
  }

  async buildString(type) {
    const data = read('../../static/actions.yaml');
    const dataType = this.getType(type);

    switch (type) {
      case 'ban': {
        const rawDataString = data[dataType].format;
        const dataString = rawDataString.format(this.user, this.user.id, this.moderator.tag, this.moderator.id, this.reason);
        return dataString; 
      }

      case 'unban': {
        const rawDataString = data[dataType].format;
        const dataString = rawDataString.format(this.user.id, this.moderator.tag, this.moderator.id, this.reason);
        return dataString;
      }

      case 'softban': {
        const rawDataString = data[dataType].format;
        const dataString = rawDataString.format(this.user, this.user.id, this.moderator.tag, this.moderator.id, this.reason);
        return dataString;
      }

      case 'kick': {
        const rawDataString = data[dataType].format;
        const dataString = rawDataString.format(this.user, this.user.id, this.moderator.tag, this.moderator.id, this.reason);
        return dataString;
      }

      case 'mute': {
        const rawDataString = data[dataType].format;
        const dataString = rawDataString.format(this.user, this.user.id, this.moderator.tag, this.moderator.id, this.reason);
        return dataString;
      }

      case 'warn': {
        const rawDataString = data[dataType].format;
        const dataString = rawDataString.format(this.user, this.user.id, this.moderator.tag, this.moderator.id, this.reason);
        return dataString;
      }
    }
  }

  get embed() {
    const embed = new MessageEmbed()
      .setAuthor(this.moderator.tag, this.moderator.avatar)
      .setColor(ModerationLog.color(this.type))
      .setDescription([
        `**Type**: ${this.type.toProperCase()}`,
        `**User**: ${this.user.tag} (${this.user.id})`,
        `**Reason**: ${this.reason ? this.reason : `Use \`--reason ${this.case}\` to set a reason.`}`
      ])
      .setFooter(`Case ${this.case}`)
      .setTimestamp();
    return embed;
  }

  static color(type) {
    switch (type) {
      case 'ban': return 16724253;
      case 'unban': return 1822618;
      case 'softban': return 15014476;
      case 'kick': return 16573465;
      case 'mute': return 16777215;
      case 'warn': return 16777215;
    }
  }

  static getType(type) {
    switch (type) {
      case 'ban': return 'MEMBER_BANNED';
      case 'unban': return 'MEMBER_UNBANNED';
      case 'softban': return 'MEMBER_SOFTBANNED';
      case 'kick': return 'MEMBER_KICKED';
      case 'mute': return 'MEMBER_MUTED';
      case 'warn': return 'MEMBER_WARNED';
    }
  }
}

module.exports = ModerationLog;