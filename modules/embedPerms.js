/**
 * Permission check to utilize embeds in channels.
 * @param {message} message The message that triggers the embed check.
 */
module.exports = (message) => {
  if (!message.guild) return true;
  return message.channel.permissionsFor(message.client.user).has('EMBED_LINKS');
};