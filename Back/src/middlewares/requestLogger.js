module.exports = function (dateOptions) {
  if (dateOptions !== undefined) {
    return function requestLogger(req, res, next) {
      try {
        res.on('finish', () => {
          const today = new Date();
          let color;
          if (res.statusCode >= 500) {
            color = '\x1b[31m';
          } else if (res.statusCode >= 400) {
            color = '\x1b[33m';
          } else {
            color = '\x1b[32m';
          }
          console.info(`\n${today.toLocaleTimeString('fr-FR', dateOptions)}:${today.getMilliseconds()}\n
              ${color}${req.method.toString().padEnd(20)}${req.originalUrl.toString().padEnd(80)}${res.statusCode} ${res.statusMessage}
              \x1b[0m\n------------------------------------------------------------------------------------------------------------------------------------\n`);
        });
        next();
      } catch (error) {
        next(error);
      }
    };
  }
};
