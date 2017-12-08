module.exports = (message) => {
  if (!message.guild) return true;
  return message.channel.permissionsFor(message.client.user).has('EMBED_LINKS').then(console.log('Has'));
};