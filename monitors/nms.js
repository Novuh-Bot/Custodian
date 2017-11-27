const slowmode = new Map();

exports.run = async (client, message, level) => { // eslint-disable-line no-unused-vars
  if (!message.guild) return; // DMs not monitored.
  if (message.mentions.users.size === 0) return; // no one mentioned.
  
  // Fetch invisible users. The catch is for webhooks (breaks if trying to fetch a user that's a webhook)
  if (!message.member) await message.guild.fetchMember(message.author).catch( O_o => {});  // eslint-disable-line no-unused-vars
  if (!message.member) return; // probably a webhook, really, at this point.
  
  // Configurations
  const settings = message.settings;
  let { nmsRate, nmsbanCount, nmsEnabled } = settings;
  nmsEnabled = (nmsEnabled === 'true') ? true : false;
  if (!nmsEnabled) return;
  nmsRate = parseInt(nmsRate, 10);
  nmsbanCount = parseInt(nmsbanCount, 10);

  // Ignore DMS, Webhooks, Mods, and break if no perms
  if (!message.guild.me.hasPermission('BAN_MEMBERS') || !message.member.bannable) return;
  
  // Ignore if 1 mention and it's a bot (bot interaction)
  if (message.mentions.users.size == 1 && message.mentions.users.first().bot) return;
  
  // If there is no trace of the author in the slowmode map, add him.
  let entry = slowmode.get(message.author.id);
  if (!entry) {
    entry = 0;
    slowmode.set(message.author.id, entry);
  }
  
  // Count BOTH user and role mentions
  entry += message.mentions.users.size + message.mentions.roles.size;
  
  // If the total number of mentions in the last `ratelimit` is above the server ban level... well, ban their ass.
  if (entry > nmsbanCount) {
    client.log('log', `[${message.guild.name}] ${message.author.username} spamming mentions x${entry}`);
    message.member.ban(1).then(member => {
      message.channel.send(`:no_entry_sign: User ${member.user.tag} (${member.id}) has just been banned for mentioning ${entry} users. :hammer:
  Users that have been mentioned, we apologize for the annoyance.`);
      client.emit('log', `[${member.id}] Banned ${member.user.username} from ${message.guild.name} for mentioning too many users (${entry}).`);
    })
      .catch(e => {
        client.log('error', `[${message.author.id}] Tried to ban ${message.author.tag} from ${message.guild.name} but they have a higher role.`);
        console.log(e);
      });
    slowmode.delete(message.author.id);
  } else {
    slowmode.set(message.author.id, entry);
    setTimeout(()=> {
      entry -= message.mentions.users.size + message.mentions.roles.size;
      if (entry <= 0) slowmode.delete(message.author.id);
    }, nmsRate);
  }
};

exports.init = async (client) => {
  const defaults = client.settings.get('default');
  if (!defaults.nmsEnabled) defaults.nmsEnabled = 'false';
  if (!defaults.nmsbanCount) defaults.nmsbanCount = '10';
  if (!defaults.nmsRate) defaults.nmsRate = '7500';
  client.settings.set('default', defaults);
};