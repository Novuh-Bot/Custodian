const slowmode = new Map();

exports.run = async (client, message, level) => {
  if (!message.guild) return;
  if (message.mentions.users.size === 0) return;

  if (!message.member) await message.guild.fetchMember(message.author).catch( err => console.log(err));
  if (!message.member) return;

  let { nmsRate, nmsBanCount, nmsEnabled } = message.settings;
  nmsEnabled = (nmsEnabled === 'true') ? true : false;
  if (!nmsEnabled) return;
  nmsRate = parseInt(nmsRate, 10);
  nmsBanCount = parseInt(nmsBanCount, 10);

  if (!message.guild.me.hasPermission('BAN_MEMBERS') || !message.member.bannable) return;
  if (message.mentions.users.size == 1 && message.mentions.users.first().bot) return;

  let entry = slowmode.get(message.author.id);
  if (!entry) {
    entry = 0;
    slowmode.set(message.author.id, entry);
  }

  entry += message.mentions.users.size + message.mentions.roles.size;

  if (entry > nmsBanCount) {
    client.log('log', `[${message.guild.name}] ${message.author.username} spamming mentions x${entry}`);
    message.member.ban(1).then(member => {
      message.channel.send(`:no_entry_sign: User ${member.user.tag} (${member.id}) has just been banned for mentioning ${entry} users. :hammer: Users that have been mentioned, we apologize for the inconvience.`);
      client.emit('log', `[${member.id}] Banned ${member.user.username} from ${message.guild.id} for mentioning too many users (${entry})`);
    })
      .catch(e => {
        client.log('error', `[${message.author.id}] Tried to ban ${message.author.tag} from ${message.guild.name} but they have a higher role.`);
        console.log(e);
      });
    slowmode.delete(message.author.id);
  } else {
    slowmode.set(message.author.id, entry);
    setTimeout(() => {
      entry -= message.mentions.users.size + message.mentions.roles.size;
      if (entry <= 0) slowmode.delete(message.author.id);
    }, nmsRate);
  }
};

exports.init = async (client) => {
  const defaults = client.settings.get('default');
  if (!defaults.nmsEnabled) defaults.nmsEnabled = 'false';
  if (!defaults.nmsBanCount) defaults.nmsBanCount = '10';
  if (!defaults.nmsRate) defaults.nmsRate = '7500';
  client.settings.set('default', defaults);
};