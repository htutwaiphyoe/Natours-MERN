const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const port = 3000 || process.env.PORT;
const dbString = process.env.DB_CONNECTION_STRING.replace("<PASSWORD>", process.env.DB_PASS);
mongoose
    .connect(dbString, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => console.log(err));

app.listen(port, () => {
    console.log("Server listening");
});
