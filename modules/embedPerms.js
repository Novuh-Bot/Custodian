module.exports = (message) => {
  if (!message.guild) return true;
  return message.channel.permissionsFor(message.client.user).hasPermission('EMBED_LINKS');
};