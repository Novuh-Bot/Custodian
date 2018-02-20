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
  "extensiveLogging": "false"
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
    name: "yorkAPIKey",
    message: "Please enter your API key for An Idiot's API. If you do not have one, enter a random string."
  },
  {
    type: "input",
    name: "youtubeAPIKey",
    message: "Please enter the YouTube API Key."
  },
  {
    type: "input",
    name: "twitchId",
    message: "Please enter your Twitch API ID."
  },
  {
    type: "input",
    name: "twitchSecret",
    message: "Please enter your Twitch API Secret."
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
    .replace("{{york-api-key}}", `"${answers.yorkAPIKey}"`)
    .replace("{{youtube-api-key}}", `"${answers.youtubeAPIKey}"`)
    .replace("{{twitch-id}}", `"${answers.twitchId}"`)
    .replace("{{twitch-secret}}", `"${answers.twitchSecret}"`);
    
  fs.writeFileSync("./config.js", baseConfig);

  console.log("REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!");
  console.log("Configuration has been written, enjoy!");
  await settings.close();
}());