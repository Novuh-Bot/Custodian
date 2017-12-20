const settings = this.client.settings.get(message.guild.id);
const serverLang = `${settings.lang}`;
const lang = require(`../../languages/${setLang}.json`);