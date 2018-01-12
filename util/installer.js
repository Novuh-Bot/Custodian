/* eslint-disable quotes */

const inquirer = require("inquirer");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const fs = require("fs");

let baseConfig = fs.readFileSync("./util/base.txt", "utf8");

const defaultSettings = `{
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
}`;

const settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

let prompts = [
  {
    type: "list", 
    name: "resetDefaults", 
    message: "Do you want to reset default settings?", 
    choices: ["Yes", "No"]
  },
  {
    type: "input",
    name: "token",
    message: "Please enter the bot token from the application page. (https://discordapp.com/developers/applications/me)"
  },
  {
    type: "input",
    name: "youtubeAPIKey",
    message: "Please enter the YouTube API Key."
  },
  {
    type: "input",
    name: "logChannel",
    message: "Please enter the channel ID from your Discord Server for master logs."
  },
  {
    type: "input",
    name: "oauthSecret",
    message: "Please enter the oauth secret found under your client secret on the bot application page."
  },
  {
    type: "input",
    name: "callbackURL",
    message: "Please enter the dashboards callback URL."
  },
  {
    type: "input",
    name: "sessionSecret",
    message: "Please enter a session secret. This can be complete gibberish."
  },
  {
    type: "input",
    name: "domain",
    message: "Please enter the domain your dashboard should run on."
  },
  {
    type: "input",
    name: "port",
    message: "Please enter the port your dashboard should run on."
  }
];

(async function() {
  console.log("Setting Up Custodian Configuration...");
  await settings.defer;
  if (!settings.has("default")) {
    prompts = prompts.slice(1);
    console.log("First Start! Inserting default guild settings in the database...");
    await settings.setAsync("default", defaultSettings);
  }

  const answers = await inquirer.prompt(prompts);

  if (answers.resetDefaults && answers.resetDefaults === "Yes") {
    console.log("Resetting default guild settings...");
    await settings.setAsync("default", defaultSettings);
  }

  baseConfig = baseConfig
    .replace("{{token}}", `"${answers.token}"`)
    .replace("{{youtube-api-key}}", `"${answers.youtubeAPIKey}"`)
    .replace("{{log-channel}}", `"${answers.logChannel}"`)
    .replace("{{oauth-secret}}", `"${answers.oauthSecret}"`)
    .replace("{{callback-url}}", `"${answers.callbackURL}"`)
    .replace("{{session-secret}}", `"${answers.sessionSecret}"`)
    .replace("{{domain}}", `"${answers.domain}"`)
    .replace("{{port}}", `"${answers.port}"`);
    
  fs.writeFileSync("./config.js", baseConfig);

  console.log("REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!");
  console.log("Configuration has been written, enjoy!");
  await settings.close();
}());