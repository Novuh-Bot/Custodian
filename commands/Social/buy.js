const Social = require(`${process.cwd()}/base/Social.js`);

class Buy extends Social {
  constructor(client) {
    super(client, {
      name: 'buy',
      description: 'Buys a role listed in the servers shop.',
      category: 'Social',
      usage: 'buy <role:string>',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const name = args.join(' ').toLowerCase();
    const user = message.author.id;
    const points = await this.usrBal(message, user);

    if (!name) throw 'Please supply the name of the role you wish to buy.';

    const item = this.client.store.find('name', name);

    if (!item) throw 'That item doesn\'t exist in the store, please make sure you have spelled the name correctly.';

    if (message.member.roles.has(item.id)) throw 'You already have this role.';

    if (item.price > points) {
      message.channel.send(`You currently have ${points}, but the role costs ${item.price}.`);
    }

    const response = this.client.awaitReply(message, `Are you sure you want to purchase ${item.name} for ${item.price}?`);
    if (['y', 'yes'].includes(response)) {
      const score = this.client.points.get(`${message.guild.id}-${message.author.id}`);
      const bal = score - itemPrice;
      this.client.points.set(`${message.guild.id}-${message.author.id}`, bal);

      await message.member.addRole(item.id);
      message.channel.send('You have bought the role! :tada:');
    } else 
    if (['n', 'no', 'cancel'].includes(response)) {
      message.channel.send('Transaction cancelled.');
    }
  }
}

module.exports = Buy;