const { inspect } = require('util');

module.exports = class {
  constructor(client) {
    this.client = client;

    this.starEmbed = async (color, description, author, authorURL, timestamp, footer, image) => {
      const embed = { 
        'color': color, 
        'description': description, 
        'author': { 
          'name': author,
          'url': authorURL
        },
        'image': { 
          'url': image 
        }, 
        'timestamp': timestamp, 
        'footer': { 
          'text': footer 
        } 
      };
      return embed; 
    };

    this.extension = async (reaction, attachment) => {
      const imageLink = attachment.split('.');
      const typeOfImage = imageLink[imageLink.length - 1];
      const image = /(jpg|jpeg|png|gif)/gi.exec(typeOfImage);
      if (!image) return '';
      return attachment;
    };
  }

  async run(reaction, user) {
    if (reaction.emoji.name !== '⭐') return;
    if (reaction.message.author.id === user.id) return reaction.message.channel.send(`${user}, you cannot star your own messages.`);
    if (reaction.message.author.bot) return reaction.message.channel.send(`${user}, you cannot star bot messages.`);
    try {
      const fetch = await reaction.message.guild.channels.find('name', this.client.settings.get(reaction.message.guild.id).starboardChannel).fetchMessages({ limit: 100 });
      const stars = fetch.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(reaction.message.id));
      if (stars) {
        const star = /\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/g.exec(stars.embeds[0].footer.text);
        const _star = stars.embeds[0];
        const embed = await this.starEmbed(_star.color, _star.description, _star.author.name, _star.author.displayAvatarURL, _star.createdTimestamp, `⭐ ${parseInt(star[1])+1} | ${reaction.message.id}`, _star.image.url);
        const starMsg = await reaction.message.guild.channels.find('name', this.client.settings.get(reaction.message.guild.id).starboardChannel).fetchMessage(stars.id);
        await starMsg.edit({ embed });
      }
      if (!stars) {
        if (!reaction.message.guild.channels.exists('name', this.client.settings.get(reaction.message.guild.id).starboardChannel)) throw `It appears that you do not have a \`${client.settings.get(reaction.message.guild.id).starboardChannel}\` channel.`;
        const image = reaction.message.attachments.size > 0 ? await this.extension(reaction, reaction.message.attachments.array()[0].url) : '';
        if (image === '' && reaction.message.cleanContent.length < 1) return reaction.message.channel.send(`${user}, you cannot star an empty message.`);
        const embed = await this.starEmbed(15844367, reaction.message.cleanContent, reaction.message.author.tag, reaction.message.author.displayAvatarURL, new Date(), `⭐ 1 | ${reaction.message.id}`, `${image}`);
        await reaction.message.guild.channels.find('name', this.client.settings.get(reaction.message.guild.id).starboardChannel).send({ embed });
      }
    } catch (error) {
      throw error;
    }
  } 
};