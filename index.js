const { init, createLogger } = require('./src/lib/Client.js');

if (process.env.NODE_ENV === 'development') {
  init(process.env.DEV_TOKEN).catch(e => console.log(e));
  createLogger();
} else {
  init(process.env.PROD_TOKEN).catch(e => console.log(e));
  createLogger();
}

process.on('unhandledRejection', err => {
  console.error(`Uncaught Promise Error: ${err}:${err.stack}`);
});

process.on('uncaughtException', (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
  client.logger.error(`Uncaught Exception: ${errorMsg}`);
  console.error(err);
  // Always best practice to let the code crash on uncaught exceptions. 
  // Because you should be catching them anyway.
  process.exit(1);
});