/*
This file is created using the Klasa ReactionHandler. Klasa is open-sourced under the MIT license.

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

const { ReactionCollector } = require('discord.js');

class ReactionHandler extends ReactionCollector {

  constructor(msg, filter, options, display, emojis) {
    super(msg, filter, options);

    this.display = display;

    this.methodMap = new Map(Object.entries(this.display.emojis).map(([key, value]) => [value, key]));

    this.currentPage = this.options.startPage || 0;

    this.prompt = this.options.prompt;

    this.time = typeof this.options.time === 'number' ? this.options.time : 30000;

    this.awaiting = false;

    this.selection = this.display.emojis.zero ? new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    }) : Promise.resolve(null);

    this.reactionsDone = false;

    this._queueEmojiReactions(emojis.slice(0));
    this.on('collect', (user, reaction) => {
      console.log(user);
      reaction.remove(reaction.users.second());
      this[this.methodMap.get(reaction.emoji.name)](user);
    });
    this.on('end', () => {
      if (this.reactionsDone) this.message.reactions.removeAll();
    });
  }

  first() {
    this.currentPage = 0;
    this.update();
  }

  back() {
    if (this.currentPage <= 0) return;
    this.currentPage--;
    this.update();
  }

  forward() {
    if (this.currentPage > this.display.pages.length - 1) return;
    this.currentPage++;
    this.update();
  }

  last() {
    this.currentPage = this.display.pages.length - 1;
    this.update();
  }

  async jump(user) {
    if (this.awaiting) return;
    this.awaiting = true;
    const mes = await this.message.channel.send(this.prompt);
    const collected = await this.message.channel.awaitMessages(mess => mess.author === user, { max: 1, time: this.time });
    this.awaiting = false;
    await mes.delete();
    if (!collected.size) return;
    const newPage = parseInt(collected.first().content);
    collected.first().delete();
    if (newPage && newPage > 0 && newPage <= this.display.pages.length) {
      this.currentPage = newPage - 1;
      this.update();
    }
  }

  info() {
    this.message.edit(this.display.infoPage);
  }

  stop() {
    if (this.resolve) this.resolve(null);
    super.stop();
  }

  zero() {
    if (this.display.options.length - 1 < this.currentPage * 10) return;
    this.resolve(this.currentPage * 10);
    this.stop();
  }

  one() {
    if (this.display.options.length - 1 < 1 + (this.currentPage * 10)) return;
    this.resolve(1 + (this.currentPage * 10));
    this.stop();
  }

  two() {
    if (this.display.options.length - 1 < 2 + (this.currentPage * 10)) return;
    this.resolve(2 + (this.currentPage * 10));
    this.stop();
  }

  three() {
    if (this.display.options.length - 1 < 3 + (this.currentPage * 10)) return;
    this.resolve(3 + (this.currentPage * 10));
    this.stop();
  }

  four() {
    if (this.display.options.length - 1 < 4 + (this.currentPage * 10)) return;
    this.resolve(4 + (this.currentPage * 10));
    this.stop();
  }

  five() {
    if (this.display.options.length - 1 < 5 + (this.currentPage * 10)) return;
    this.resolve(5 + (this.currentPage * 10));
    this.stop();
  }

  six() {
    if (this.display.options.length - 1 < 6 + (this.currentPage * 10)) return;
    this.resolve(6 + (this.currentPage * 10));
    this.stop();
  }

  seven() {
    if (this.display.options.length - 1 < 7 + (this.currentPage * 10)) return;
    this.resolve(7 + (this.currentPage * 10));
    this.stop();
  }

  eight() {
    if (this.display.options.length - 1 < 8 + (this.currentPage * 10)) return;
    this.resolve(8 + (this.currentPage * 10));
    this.stop();
  }

  nine() {
    if (this.display.options.length - 1 < 9 + (this.currentPage * 10)) return;
    this.resolve(9 + (this.currentPage * 10));
    this.stop();
  }

  update() {
    this.message.edit('', { embed: this.display.pages[this.currentPage] });
  }

  async _queueEmojiReactions(emojis) {
    if (this.ended) return this.message.clearReactions();
    await this.message.react(emojis.shift());
    if (emojis.length) return this._queueEmojiReactions(emojis);
    this.reactionsDone = true;
    return null;
  }

}

module.exports = ReactionHandler;