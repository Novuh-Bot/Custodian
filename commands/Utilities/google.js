const { parse } = require('fast-html-parser');
const { get } = require('snekfetch');
const { parse: qs } = require('querystring');
const { lazy: uf } = require('unfluff');
const { RichEmbed } = require('discord.js');
const Command = require('../../base/Command.js');

/* eslint-disable no-useless-escape */
/* eat a dick, codacy */

const gcolor = ['#4285FA', '#0F9D58', '#F4B400', '#DB4437'];

class Google extends Command {
  constructor(client) {
    super(client, {
      name: 'google',
      description: 'Searches something on Google.',
      category: 'Utilities',
      usage: 'google <search:string>',
      extended: 'Searches Google for your question.',
      aliases: ['g'],
      botPerms: ['EMBED_LINKS'],
      permLevel: 'Bot Admin'
    });
  }


  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.settings.get(message.guild.id);
    const serverLang = `${settings.lang}`;
    const lang = require(`../../languages/${serverLang}/${this.help.category}/${this.help.category}.json`);
    const generalErr = require(`../../languages/${serverLang}/general.json`);
    
    const time = Date.now();
    const term = args.join(' ');
    const searchurl = 'http://google.com/search?safe=active&gl=uk&hl=en&q=' + encodeURIComponent(term);
    const searchmessage = await message.channel.send('Searching for ' + term);
    const body = await get(searchurl);
    const $ = new parse(body.text);

    /*
    All results are under class .r
    There are 3 different types of URLs from google searches, in the href tag:
    /url?q=URL - This one is most common
    /search?q=TERM - This one is typically a Google Images result or similar - these are removed!
    URL - Direct links are usually Google Books results
    */

    const result = (await Promise.all(
      $.querySelectorAll('.r')
        .filter(e => e.childNodes[0].tagName === 'a' && e.childNodes[0].attributes.href)
        .filter(e => e.childNodes[0].attributes.href.replace('/url?', '').indexOf('/search?') === -1)
        .slice(0, 5)
        .map(async (e) => {
          let url = e.childNodes[0].attributes.href.replace('/url?', '');
          if (url.startsWith('/')) url = 'http://google.com' + url;
          else url = qs(url).q || url;

          const body = await get(url);
          const details = uf(body.text);
          const obj = {
            url,
            snippet: () => {
              const x = (details.description() || '').substring(0, 240);
              const y = (details.text() || '').substring(0, 240) + '...';
              return y.includes(x) ? y : x + '\n' + y;
            },
            image: () => details.image()
          };
          try {
            obj.title = new parse(body.text).querySelector('head').childNodes.find(e => e.tagName === 'title').childNodes[0].text;
          } catch (e) {
            obj.title = details.title() || 'No title found';
          }
          return obj;
        })
    ));

    /*
    Results now have the structure:
    [
      {
        title: Page title,
        url: Page URL,
        snippet: Function, returns page snippet
        image: Function, returns an image from the page
      },
      {...},
      ...
    ]
    */

    if (!result.length) return searchmessage.edit(`${lang.noRslt}` + term);
    const first = result.shift();
    const vanityurl_1 = /^https?:\/\/[\w\.\-_]+(?::\d+|\.\w*)(?:\/|$)/g.exec(first.url);
    const vanityurl = vanityurl_1 && vanityurl_1[0] ? vanityurl_1[0] : first.url;   
    const embed = new RichEmbed()
      .setColor(gcolor[Math.floor(Math.random() * gcolor.length)])
      .setAuthor(`Results for "${term}"`, 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAADwkE/KyrKDjjeV1o/photo.jpg', searchurl)
      .setTitle(`${first.title.substring(0, 200)} - ${vanityurl.substring(0, 50) + (vanityurl.length > 50 ? '...' : '')}`)
      .setURL(first.url);
    try {
      embed.setThumbnail(first.image().replace(/^\.*\/(.*)/, `${first.url}$1`));
    } catch (e) {
      embed.thumbnail = undefined;
      void e;
    }
    embed.setDescription(first.snippet())
      .setTimestamp()
      .setFooter(Date.now() - time + ' ms');
    const embeds = result.reduce((acc, r) => {
      const vu_1 = /^https?:\/\/[\w\.\-_]+(?::\d+|\.\w*)(?:\/|$)/g.exec(r.url);
      const vu = vu_1 && vu_1[0] ? vu_1[0] : r.url;
      const u = r.url.substring(0, 200) + (r.url.length > 200 ? '...' : ''); //203
      const text = `${r.title.substring(0, 200) + (r.title.length > 200 ? '...' : '')}\n[${u}](${u.endsWith('...') ? vu.substring(0, 300) + (vu.length > 300 ? '...' : '') : u})`;
      if (acc[acc.length - 1].length + text.length < 1000) acc[acc.length - 1] += `${text}\n`;
      else acc[acc.length] = text;
      return acc;
    }, ['']);
    for (const [i, e] of embeds.entries()) {
      embed.addField(i === 0 ? 'Top Results' : '\u200b', e);
    }
    searchmessage.edit({
      embed
    });
  }
}

module.exports = Google;