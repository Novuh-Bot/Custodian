if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

const Discord = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const klaw = require('klaw');
const path = require('path');
const fs = require('fs');
const Idiot = require('idiotic-api');

class Custodian extends Discord.Client {
  constructor(options) {
    super(options);

    this.config = require('./config.js');
    this.api = new Idiot.Client(this.config.yorkAPIKey);
    this.queue = {};
    this.playlists = new Enmap();
    this.commands = new Enmap();
    this.aliases = new Enmap();
    this.invspam = new Enmap();

    this.settings = new Enmap({provider: new EnmapLevel({name: 'settings'})});
    this.consent = new Enmap({provider: new EnmapLevel({name: 'consent'})});
    this.reminders = new Enmap({provider: new EnmapLevel({name: 'reminders'})});
  }

  permlevel(message) {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  log(type, msg, title) {
    if (!title) title = 'Log';
    console.log(`[${type}] [${title}] ${msg}`);
  }

  permCheck(message, perms) {
    if (message.channel.type !== 'text') return;
    return message.channel.permissionsFor(message.guild.me).missing(perms);
  }

  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(client);
      props.conf.location = commandPath;
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return client.log('Log', `Unable to load command ${commandName}: ${e}`, 'ERROR');
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
  
    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`${commandPath}/${commandName}.js`)];
    return false;
  }

  /* SETTINGS FUNCTIONS
  These functions are used by any and all location in the bot that wants to either
  read the current *complete* guild settings (default + overrides, merged) or that
  wants to change settings for a specific guild.
  */

  // getSettings merges the client defaults with the guild settings. guild settings in
  // enmap should only have *unique* overrides that are different from defaults.
  getSettings(id) {
    const defaults = client.getSettings('default');
    let guild = client.getSettings(id);
    if (typeof guild != 'object') guild = {};
    const returnObject = {};
    Object.keys(defaults).forEach((key) => {
      returnObject[key] = guild[key] ? guild[key] : defaults[key];
    });
    return returnObject;
  }

  // writeSettings overrides, or adds, any configuration item that is different
  // than the defaults. This ensures less storage wasted and to detect overrides.
  writeSettings(id, newSettings) {
    const defaults = client.getSettings('default');
    let settings = client.getSettings(id);
    if (typeof settings != 'object') settings = {};
    for (const key in newSettings) {
      if (defaults[key] !== newSettings[key]) {
        settings[key] = newSettings[key];
      } else {
        delete settings[key];
      }
    }
    client.settings.set(id, settings);
  }
}

const client = new Custodian({
  fetchAllMembers: true
});
console.log(client.config.permLevels.map(p=>`${p.level} : ${p.name}`));

require('./modules/functions.js')(client);

const init = async () => {

  const commandList = [];
  klaw('./commands').on('data', (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== '.js') return;
    const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    commandList.push(cmdFile.name);
    if (response) console.log(response);
  }).on('end', () => {
    client.log('Log', `Loaded a total of ${commandList.length} commands.`);
  }).on('error', (error) => client.log('ERROR', error));

  const eventList = [];
  klaw('./events').on('data', (item) => {  
    const eventFile = path.parse(item.path);
    if (!eventFile.ext || eventFile.ext !== '.js') return;
    const eventName = eventFile.name.split('.')[0];
    try {
      const event = new (require(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`))(client);    
      eventList.push(event);      
      client.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`)];
    } catch (error) {
      client.log('ERROR', `Error loading event ${eventFile.name}: ${error}`);
    }
  }).on('end', () => {
    client.log('Log', `Loaded a total of ${eventList.length} events.`);
  }).on('error', (error) => client.log('ERROR', error));

  fs.readdir('./commands/', (err, files) => {
    client.log('Log', `Loaded a total of ${files.length} command groups.`);
    if (err) client.log('Log', err, 'ERROR');
  });

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.token);

};

init();
