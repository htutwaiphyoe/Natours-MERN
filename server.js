// third-party modules
const dotenv = require("dotenv");

dotenv.config({ path: `./.env` });
// Own modules
const app = require("./app");
// Server configuration
const port = process.env.PORT || 8000;
app.listen(port, () => {});
