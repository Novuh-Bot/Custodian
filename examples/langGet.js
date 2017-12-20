const settings = this.client.settings.get(message.guild.id);
const setLang = `${settings.lang}`;
const lang = require(`../../languages/${setLang}.json`);