const shortid = require("shortid")
const router = require("express").Router()
const User = require("./database").User
const jwt = require("./token")
const ipfs = require("./ipfs")
const lms = require("./lms")


const auth = (req, res, next) => {
    const token = req.header("token")
    if (!token) {
        res.status(400).send("Invalid token")
    } else {
        const decoded = jwt.verify(token)
        if (!decoded) {
            res.status(400).send("Invalid token")
        } else {
            req.userid = decoded
            next()
        }
    }
}


router.post("/register", async (req, res) => {
    if (req.body.email) {
        try {
            let _id = await User.register(req.body.email)
            let token = jwt.generate(_id)
            res.send(token)
        } catch (e) {
            res.status(400).send("User already existed")
        }
    } else {
        res.status(400).send("Invalid credential")
    }
})


router.post("/login", async (req, res) => {
    if (req.body.email) {
        try {
            let _id = await User.login(req.body.email)
            let token = jwt.generate(_id)
            res.send(token)
        } catch (e) {
            res.status(400).send("Invalid credential")
        }
    } else {
        res.status(400).send("Invalid credential")
    }
})


router.get("/auth", auth, async (req, res) => {
    res.send("Hello there")
})


router.post("/upload", auth, async (req, res) => {
    if (!req.files) {
        res.status(400).send("File not found")
    } else {
        if (!req.files.file) {
            res.status(400).send("Invalid request")
        } else {
            let fileid = shortid.generate() + shortid.generate()
            let filename = req.files.file.name
            let filebuffer = req.files.file.data
            // Hash
            // let _hash = await ipfs.ipfs_add(filebuffer)
            let _hash = "1234"
            try {
                await lms.addHash(fileid, req.userid, _hash)
                // Save to database
                res.send(fileid)
            } catch (err) {
                res.status(400).send("Invalid owner")
                console.log(err)
            }
        }
    }
})


router.post("/download", auth, async (req, res) => {
    if (!req.body.id) {
        res.status(400).send("Invalid parameter")
    } else {
        let result = await lms.viewHash(req.body.id)
        res.send(result)
    }
})


module.exports = router
