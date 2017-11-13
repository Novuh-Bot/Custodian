const Command = require('../../base/Command.js');
/*
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data', 'afk.json');
*/

class AFK extends Command {
    constructor(client) {
        super(client, {
            name: 'afk',
            description: 'Set your AFK.',
            extended: 'Set yourself as AFK with an optional message.',
            usage: 'afk <user id> [response message]',
            category: 'Utilities',
            aliases: [],
            botPerms: ['SEND_MESSAGES'],
            permLevel: 'User'
        })
    }

    async run(message, [action, userid, ...reply], level) {
        const afk = this.client.afk.get(message.guild.id);
        if (action === 'on') {
            if(!userid) return message.reply('please add your user ID for verification purposes.')
            if(reply.length < 1) return message.reply('please give me a reply for if someone tags you.');
    
            afk[userid] = reply.join(" ");

            this.client.afk.set(message.guild.id, afk);
            message.reply(`you've been set to AFK with an automated response of ${reply.join(" ")}`)
            
        }
    }
}

module.exports = AFK;