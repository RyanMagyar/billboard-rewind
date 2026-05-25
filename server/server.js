const app = require("./app");
const logger = require("./utils/logger");

const port = 3000;

app.listen(port, () => {
  logger.info({ port }, "Server listening");
});
