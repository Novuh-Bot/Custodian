const moment = require('moment');
const bot = require('../package.json');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    await this.client.wait(1000);

    if (this.client.users.has('1')) {
      this.client.users.delete('1');
    }

    this.client.appInfo = await this.client.fetchApplication();
    setInterval( async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);
  
    this.client.log('Log', `${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers on version ${bot.version}.`, 'Ready!');

    this.client.guilds.filter(g => !this.client.settings.has(g.id)).forEach(g => this.client.settings.set(g.id, this.client.config.defaultSettings));
    this.client.user.setActivity(`/help | Keeping ${this.client.guilds.size} clean!`);

    if (!this.client.blacklist.get('list')) this.client.blacklist.set('list', []);

    setInterval(() => {
      const toRemind = this.client.reminders.filter(r => r.reminderTimestamp <= Date.now());
      toRemind.forEach(reminder => {
        this.client.users.get(reminder.id).send(`You asked me to remind you about: \`${reminder.reminder}\``);
        this.client.reminders.delete(`${reminder.id}-${reminder.reminderTimestamp}`);
      }); 
    }, 60000);

    require('../modules/dashboard.js')(this.client);    
  
  }
};