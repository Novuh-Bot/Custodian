/**
 * Grab the server settings.
 */
const settings = this.client.settings.get(message.guild.id);

/**
 * Declare the servers language based on the lang key in the settings.
 * @param {SettingsLang} language A language key that the server should have set in it's settings.
 */
const serverLang = `${settings.lang}`;

/**
 * Require the language file.
 * @param {ServerLanguage} language A language that the server should be set to use for i18n.
 */
const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);

/**
 * Require the general error file for basic errors.
 * @param {ServerLanguage} language A language that the server should be set to use for i18n.
 */
const generalErr = require(`../../languages/${serverLang}/general.json`);