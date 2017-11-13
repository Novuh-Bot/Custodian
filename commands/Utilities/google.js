const { parse } = require('fast-html-parser');
const { RichEmbed } = require('discord.js');
const { get } = require('snekfetch'),
  qs = require('querystring'),
  uf = require('unfluff').lazy;
const Command = require('../../base/Command.js');

class Google extends Command {
  constructor(client) {
    super(client, {
      name: 'google',
      description: 'Searches something on Google.',
      extended: 'Searches Google for your question.',
      category: 'Utilities',
      usage: 'google [search]',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, level) { // eslint-disable-line no-unused-vars
    const time = Date.now();
    const term = message.content.split(' ').slice(1).join(' ');
    const searchurl = 'http://google.com/search?q=' + encodeURIComponent(term);
    const searchmessage = await message.channel.send('Searching for ' + term);
    const body = await get(searchurl);
    const $ = new parse(body.text);

    const result = (await Promise.all($.querySelectorAll('.r').filter(e => e.childNodes[0].tagName === 'a' && e.childNodes[0].attributes.href).filter(e => !e.childNodes[0].attributes.href.replace('/url?', '').startsWith('/')).slice(0, 5)
      .map(async (e) => {
        let url = e.childNodes[0].attributes.href.replace('/url?', '');
        if (url.startsWith('/')) url = 'http://google.com' + url;
        else url = qs.parse(url).q;
        const body = await get(url);
        const details = uf(body.text);
        const obj = {
          url,
          snippet: () => (details.description() || '') + '\n' + (details.text() || '') /*.replace(/\n+/g, ' ')*/ .substring(0, 180) + '...',
          image: () => details.image()
        };
        try {
          obj.title = new parse(body.text).querySelector('head').childNodes.find(e => e.tagName === 'title').childNodes[0].text;
        } catch (e) {
          obj.title = details.title() || 'No title found';
        }
        return obj;
      })));
    if (!result.length) return searchmessage.edit('No results found for ' + term);
    const first = result.shift();
    if (message.guild.me.hasPermission('EMBED_LINKS')) {
      const embed = new RichEmbed()
        .setColor('GREEN')
        .setAuthor(`Results for "${term}"`, 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAADwkE/KyrKDjjeV1o/photo.jpg', searchurl)
        .setTitle(first.title)
        .setURL(first.url)
        .setThumbnail(first.image())
        .setDescription(first.snippet())
        .setTimestamp()
        .setFooter(Date.now() - time + ' ms')
        .addField('Top results', result.map(r => `${r.title}\n[${r.url}](${r.url})\n`));

      searchmessage.edit({ embed });
    } else {
      let str = '';
      str += `Results for "${term}":\n\n`;
      str += `${first.title}\n\n${first.snippet()}\n\n`;
      str += `Top results\n\n${result.map(r => `${r.title}\n${r.url}\n`).join('\n')}`;

      searchmessage.edit(str);
    }
  }
}

module.exports = Google;