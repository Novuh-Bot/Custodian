module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(error) {
    global.logger.error(error);
  }
};