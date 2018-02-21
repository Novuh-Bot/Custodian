const { Message, Channel } = require('discord.js');
const ms = require('ms');


String.prototype.toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

String.prototype.toPlural = function() {
  return this.replace(/((?:\D|^)1 .+?)s/g, '$1');
};
  
Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Message.prototype.lang = function(message, lang, category, key) {
  const serverLang = require(`../languages/${lang}/${category}/${category}.json`);
  message.channel.send(`${message.author} |\`❌\`| ${serverLang[key]}`);
};

Channel.prototype.lock = async function(client, message, time) {
  if (!this.client.lockit) this.client.lockit = [];
  message.channel.overwritePermissions(message.guild.id, {
    SEND_MESSAGES: false
  }).then(() => {
    message.channel.send(`The channel has been locked down for ${ms(ms(time), { long: true })}.`).then(() => {
      this.client.lockit[message.channel.id] = setTimeout(() => {
        message.channel.overwritePermissions(message.guild.id, {
          SEND_MESSAGES: null
        }).then(message.channel.send('The lockdown has been lifted.')).catch(console.error);
        delete this.client.lockit[message.channel.id];
      }, ms(time));
    });
  });
};

Channel.prototype.unlock = async function(message) {
  message.channel.overwritePermissions(message.guild.id, {
    SEND_MESSAGES: null
  });
};