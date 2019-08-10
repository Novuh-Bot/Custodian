const Command = require('../../lib/structures/Command');
const ModerationLog = require('../../lib/structures/ModerationLog');

class Warn extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      _usage: '<member:member> [reason:string]' 
    });
  }

  async run(message, [member, ...reason], level) {
    member = message.mentions.members.first() || message.guild.members.get(member);
    member = await this.verifyMember(message.guild, member);

    reason = reason.length > 0 ? reason.join( ' ') : null;

    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.respond('You cannot perform that action on someone of an equal or higher role.');

    new ModerationLog(message.guild)
      .setType('warn')
      .setModerator(message.author)
      .setUser(member.user)
      .setReason(reason)
      .send();
  }
}