const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: "admin_logs",
      options: { useUnifiedTopology: true },
      level: "info",
      tryReconnect: true,
      expireAfterSeconds: 60 * 60 * 24 * 30, // loglar 30 kunda o‘chadi
    }),
  ],
});

module.exports = logger;
