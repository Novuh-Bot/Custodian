const Social = require(`${process.cwd()}/base/Social.js`);

class List extends Social {
  constructor(client) {
    super(client, {
      name: 'list',
      description: 'List a role to the guilds store.',
      category: 'Social',
      usage: 'list <role>',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const action = args.shift();
    const price = args.pop();
    const name = args.join(' ');

    if (action === 'add') {
      if (!name) throw 'Please add the exact name of the role.';
      if (!message.guild.roles.find('name', name)) throw 'Please enter the **correct** name of the the role.';
      if (this.client.store.has(name)) throw 'This role is already on sale.';
      if (!price) throw 'Please specify a price.';

      const role = { name: name.toLowerCase(), id: message.guild.roles.find('name', name).id.toString(), price: price, guildID: message.guild.id };
      this.client.store.set(role.id, role);
      message.reply(`${name} is now on sale.`);
    } else
    
    if (action === 'del') {
      if (!name) throw 'Please specify the exact name of the role.';
      if (!this.client.store.has(name)) throw 'This role is not on sale';

      const response = await this.client.awaitReply(message, `Are you sure you want to remove ${name} from the store?`);
      if (['y', 'yes'].includes(response)) {
        await this.client.store.delete(name);
        message.reply('The role is not off the store.');
      } else 

      if (['n', 'no', 'cancel'].includes(response)) {
        message.reply('Action cancelled.');
      }
    }
  }
}

module.exports = List;