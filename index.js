const version = '8.5.0';
if (process.version < version) throw new Error('Node 8.5.0 or higher is required. Update Node on your system.');
require('./modules/Prototypes.js');

const { Client, Collection } = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const klaw = require('klaw');
const path = require('path');
const fs = require('fs');
const Idiot = require('idiotic-api');

class Custodian extends Client {
  constructor(options) {
    super(options);

    this.config = require('./config.js');
    
    this.api = new Idiot.Client(this.config.apiKeys.yorkAPIKey);
    
    this.queue = {};
    this.playlists = new Enmap();
    this.commands = new Enmap();
    this.aliases = new Enmap();
    
    this.ratelimits = new Collection();

    this.settings = new Enmap({ provider: new EnmapLevel({ name: 'settings' }) });
    this.consent = new Enmap({ provider: new EnmapLevel({ name: 'consent' }) });
    this.reminders = new Enmap({ provider: new EnmapLevel({ name: 'reminders' }) });
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
}

const client = new Custodian({
  fetchAllMembers: true
});

console.log(client.config.permLevels.map(p=>`${p.level} : ${p.name}`));

client.on('error', err => console.log(err));

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
