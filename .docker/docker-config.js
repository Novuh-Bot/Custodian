const config = {
  // Bot Admins, level 9 by default. Array of ID strings.
  "admins": [],

  // Bot Support, level 8 by default. Array of ID strings.
  "support": [],

  // Your bot"s token. Available on Available on https://discordapp.com/developers/applications/me.
  "token": '{{token}}',

  "youtubeAPIKey": '{{youtube-api-key}}',

  "logChannel": '{{log-channel}}',

  "dashboard": {
    "oauthSecret": '{{oauth-secret}}',
    "callbackURL": '{{callback-url}}',
    "sessionSecret": '{{session-secret}}',
    "domain": '{{domain}}',
    "port": '{{port}}'
  },

  "defaultSettings": {
    "prefix": "/",
    "lang": "en-US",
    "modLogChannel": "mod-log",
    "modRole": "Moderator",
    "adminRole": "Administrator",
    "muteRole": "Muted",
    "requestRole": "Change Me!",
    "systemNotice": "true",
    "requestChannel": "staff",
    "welcomeEnabled": "false",
    "welcomeChannel": "welcome",
    "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
    "extensiveLogging": "false",
    "levelNotice": "false",
    "minPoints": "1",
    "maxPoints": "50",
    "pointsReward": "250",
    "dailyTime": "24",
    "costMulti": "10",
    "customEmoji": "false",
    "gEmojiID": "367673348899078165",
    "uEmoji": "💲" 
  },

  permLevels: [
    { level: 0,
      name: 'User', 
      check: () => true
    },

    { level: 2,
      name: 'Moderator',
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: 'Administrator', 
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return (adminRole && message.member.roles.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },
    { level: 4,
      name: 'Server Owner', 
      check: (message) => message.channel.type === 'text' ? (message.guild.owner.user.id === message.author.id ? true : false) : false
    },
    { level: 8,
      name: 'Bot Support',
      check: (message) => config.support.includes(message.author.id)
    },

    { level: 9,
      name: 'Bot Admin',
      check: (message) => config.admins.includes(message.author.id)
    },

    { level: 10,
      name: 'Bot Owner', 
      check: (message) => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;