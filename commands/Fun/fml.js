const Social = require('../../base/Command.js');
const request = require('snekfetch');
const HTMLParser = require('fast-html-parser');
const { RichEmbed } = require('discord.js');

class FML extends Social {
  constructor(client) {
    super(client, {
      name: 'fml',
      description: 'Grabs a random FML story.',
      usage: 'fml',
      category: 'Fun',
      extended: 'This command grabs a random "fuck my life" story from fmylife.com and displays it in an organized embed.',
      aliases: ['fuckmylife', 'fuckme'],
      botPerms: ['EMBED_LINKS'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    try {
      const reply = await message.channel.send('```Searching for a random FML card. This may take a few moments.```');
      const res = await request.get('http://www.fmylife.com/random');
      const root = HTMLParser.parse(res.text);
      const article = root.querySelector('.block a');
      const downdoot = root.querySelector('.vote-down');
      const updoot = root.querySelector('.vote-up');
      const href = root.querySelector('.panel-content p.block a');
      const card = root.querySelector('.panel-content div.votes span.vote div');
      const signature = root.querySelector('.panel div.text-center');
      const link = 'http://www.fmylife.com' + href.rawAttrs.replace(/^href=|"/g, '');
      const cardID = card.rawAttrs.replace(/\D/g,'');
      let signatureDisplay = 'Author and date of this FML unknown';
      if (signature.childNodes.length === 1) {
        signatureDisplay = signature.childNodes[0].text;
      } else if (signature.childNodes.length === 3) {
        signatureDisplay = signature.childNodes[0].text.replace('-', '/') + signature.childNodes[2].text.replace('/', '');
      }

      const embed = new RichEmbed()
        .setTitle(`FML #${cardID}`)
        .setURL(link)
        .setColor(165868)
        .setThumbnail('http://i.imgur.com/5cMj0fw.png')
        .setFooter(signatureDisplay)
        .setDescription(`_${article.childNodes[0].text}\n\n_`)
        .addField('I agree, your life sucks.', updoot.childNodes[0].text, true)
        .addField('You deserved it.', downdoot.childNodes[0].text, true);
      
      if (article.childNodes[0].text.length < 5) {
        return message.channel.send('Today, something went wrong, so you\'ll have to try again in a few moments. FML');
      }
      reply.edit({embed});
    } catch (error) {
      if (error.message === 'Cannot send an empty message') {
        throw 'Today, something went wrong, so you\'ll have to try again in a few moments. FML';
      }
      throw error;
    }
  }
}

module.exports = FML;