const settings = this.client.settings.get(message.guild.id);
const serverLang = `${settings.lang}`;
const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
const generalErr = require(`../../languages/${serverLang}/general.json`);