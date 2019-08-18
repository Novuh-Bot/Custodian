require('dotenv').config();

const { Client, Collection } = require('discord.js');

const Haste = require('hastebin.js');
const Redis = require('ioredis');
const Winston = require('winston');

const klaw = require('klaw');
const path = require('path');

const db = require('../lib/structures/Database');

require('../util/Prototypes');

class Bot extends Client {
  constructor(options) {
    super(options);
    
    this.config = require('../config.js');
    this.logger = require('../modules/Logger');

    this.commands = new Collection();
    this.aliases = new Collection();

    this.playlists = new Collection();

    this.redis = new Redis();

    this.util = {
      haste: new Haste()
    };

    this.db = db;
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

  permCheck(message, perms) {
    if (message.channel.type !== 'text') return;
    return message.channel.permissionsFor(message.guild.me).missing(perms);
  }

  loadCommand(commandPath, commandName) {
    try {
      const props = new(require(`${commandPath}${path.sep}${commandName}`))(client);
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
      return client.logger.error(`Unable to load command ${commandName}: ${e}`);
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

const client = new Bot({
  fetchAllMembers: true,
  partials: ['MESSAGE', 'CHANNEL']
});

module.exports.createLogger = async () => {
  client.logger.debug('Initializing Winston logger.');
  global.logger = Winston.createLogger({
    level: 'debug',
    format: Winston.format.combine(
      Winston.format.timestamp({
        format: 'MMMM Do YYYY HH:mm:ss'
      }),
      Winston.format.printf(info =>
        `[${info.level.toUpperCase()}] ${info.timestamp}: ${info.message}`
      )),

    transports: [
      new Winston.transports.File({
        filename: 'bot.log',
        colorize: true
      })
    ]
  });
};

module.exports.init = async token => {
  const commandList = [];
  klaw('./src/commands').on('data', item => {
    const { dir, name, ext } = path.parse(item.path);
    if (!ext || ext !== '.js') return;
    const response = client.loadCommand(dir, `${name}${ext}`);
    commandList.push(name);
    if (response) console.log(response);
  }).on('end', () => {
    client.logger.load(`Loaded a total of ${commandList.length} commands.`);
  }).on('error', (error) => client.logger.error(error));

  const eventList = [];
  klaw('./src/events').on('data', item => {
    const { dir, name, ext } = path.parse(item.path);
    if (!ext || ext !== '.js') return;
    const eventName = name.split('.')[0];
    try {
      const event = new(require(`${dir}${path.sep}${name}${ext}`))(client);
      eventList.push(event);
      client.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`${dir}${path.sep}${name}${ext}`)];
    } catch (error) {
      client.logger.error(`Error loading event ${name}: ${error}`);
    }
  }).on('end', () => {
    client.logger.load(`Loaded a total of ${eventList.length} events.`);
  }).on('error', (error) => client.logger.error(error));

  const structureList = [];
  klaw('./src/lib/extenders').on('data', item => {
    const { dir, name, ext } = path.parse(item.path);
    if (!ext || ext !== '.js') return;
    try {
      const structure = require(`${dir}${path.sep}${name}${ext}`);
      structureList.push(structure);
    } catch (error) {
      client.logger.error(`Error loading structure ${name}: ${error}`);
    }
  }).on('end', () => {
    client.logger.load(`Loaded a total of ${structureList.length} structures.`);
  }).on('error', (error) => client.logger.error(error));

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.db.connect(client);

  client.login(token);
};