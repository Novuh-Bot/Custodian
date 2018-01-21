/**
 * Grab the server settings.
 */
const settings = this.client.settings.get(message.guild.id);

/**
 * Declare the servers language based on the lang key in the settings.
 */
const serverLang = `${settings.lang}`;

/**
 * Require the language file.
 */
const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);

/**
 * Require the general error file for basic errors.
 */
const generalErr = require(`../../languages/${serverLang}/general.json`);