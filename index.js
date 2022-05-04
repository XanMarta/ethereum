const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const helmet = require("helmet")
const fileUpload = require("express-fileupload")
const lms = require("./src/lms")
const db = require("./src/database")

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(fileUpload());
app.use(cors({
    origin: "*",
    exposedHeaders: ["token"]
}));
app.use(express.static("./public"));


(async () => {
    
    await lms.init()
    await db.connect_db()

    app.use(require("./src/routes"));
    app.listen(3000, () => console.log("Listening on port 3000 ..."))

})();
