/*
This file is created using the Klasa RichDisplay method. Klasa is open-sourced under the MIT license.

MIT License

Copyright (c) 2017-2018 dirigeants

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const { RichEmbed: Embed } = require('discord.js');
const ReactionHandler = require('./ReactionHandler.js');

class RichDisplay {
  constructor(embed = new Embed()) {
    this.embedTemplate = embed;
    this.pages = [];
    this.infoPage = null;
    this.emojis = {
      first: '⏮',
      back: '◀',
      forward: '▶',
      last: '⏭',
      info: 'ℹ',
      stop: '⏹'
    };
    this.footered = false;
    this.footerPrefix = '';
    this.footerSuffix = '';
  }

  get template() {
    return new Embed(this.embedTemplate);
  }

  setEmojis(emojis) {
    Object.assign(this.emojis, emojis);
  }

  setFooterPrefix(prefix) {
    this.footered = false;
    this.footerPrefix = prefix;
    return this;
  }

  setFooterSuffix(suffix) {
    this.footered = false;
    this.footerSuffix = suffix;
    return this;
  }
  
  useCustomFooters() {
    this.footered = true;
    return this;
  }
  
  addPage(embed) {
    this.pages.push(this._handlePageGeneration(embed));
    return this;
  }
  
  setInfoPage(embed) {
    this.infoPage = this._handlePageGeneration(embed);
    return this;
  }
  
  async run(msg, options = {}) {
    if (!this.footered) this._footer();
    if (!options.filter) options.filter = () => true;
    const emojis = this._determineEmojis(
      [],
      !('stop' in options) || ('stop' in options && options.stop),
      !('firstLast' in options) || ('firstLast' in options && options.firstLast),
    );
    const message = msg.editable ? await msg.edit('', { embed: this.pages[options.startPage || 0] }) : await msg.channel.send(this.pages[options.startPage || 0]);
    return new ReactionHandler(
      message,
      (reaction, user) => emojis.includes(reaction.emoji.name) && user !== msg.client.user && options.filter(reaction, user),
      options,
      this,
      emojis
    );
  }
  
  async _footer() {
    for (let i = 1; i <= this.pages.length; i++) this.pages[i - 1].setFooter(`${this.footerPrefix}${i}/${this.pages.length}${this.footerSuffix}`);
    if (this.infoPage) this.infoPage.setFooter('ℹ');
  }
  
  _determineEmojis(emojis, stop, jump, firstLast) {
    if (this.pages.length > 1 || this.infoPage) {
      if (firstLast) emojis.push(this.emojis.first, this.emojis.back, this.emojis.forward, this.emojis.last);
      else emojis.push(this.emojis.back, this.emojis.forward);
    }
    if (this.infoPage) emojis.push(this.emojis.info);
    if (stop) emojis.push(this.emojis.stop);
    if (jump) emojis.push(this.emojis.jump);
    return emojis;
  }
  
  _handlePageGeneration(cb) {
    if (typeof cb === 'function') {
      // eslint-disable-next-line callback-return
      const page = cb(this.template);
      if (page instanceof Embed) return page;
    } else if (cb instanceof Embed) {
      return cb;
    }
    throw new Error('Expected a MessageEmbed or Function returning a MessageEmbed');
  }
}

module.exports = RichDisplay;