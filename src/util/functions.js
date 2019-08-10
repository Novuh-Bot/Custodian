const constants = require('../constants');

module.exports = (client) => {

  client.canRun = async (command, member) => {
    const user = member.guild.resolve(member.id);
    const serverAdmin = user.permissions.has('MANAGE_GUILD') || constants.admins.includes(user.id);

    if (command.conf.permissions.has('admin') && !serverAdmin) return false;
    return true; 
  };

};