const Command = require('../../base/Command.js');

class Christmas extends Command {
  constructor(client) {
    super(client, {
      name: 'christmas',
      category: 'Fun',
      usage: 'christmas',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    message.channel.send(`
    \`\`\`
               *
               *
              ***                 M   M  EEEEE RRRRR  RRRRR  Y   Y
             *****                MM MM  E     R    R R    R  Y Y
            *******               M M M  EEE   RRRRR  RRRRR    Y
           *********              M   M  E     R   R  R   R    Y
         *************            M   M  EEEEE R   R  R   R    Y
            *******
           *********
         *************
       *****************
          ***********               X   X    M   M   AAA   SSSS   !!
        ***************              X X     MM MM  A   A S       !!
       *****************              X   -- M M M  AAAAA  SSS    !!
     *********************           X X     M   M  A   A     S
        ***************             X   X    M   M  A   A SSSS    !!
      *******************
    ***********************
            ******
            ******
            ******\`\`\``);
  }
}

module.exports = Christmas;