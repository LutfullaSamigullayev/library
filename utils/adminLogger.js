const logger = require("../config/logger");

const adminLogger = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "super_admin")) {
    const startTime = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - startTime;

      logger.info("Admin action", {
        adminId: req.user._id,
        username: req.user.username,
        role: req.user.role,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        body: req.body,
        query: req.query,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      });
    });
  }
  next();
};

module.exports = adminLogger;
