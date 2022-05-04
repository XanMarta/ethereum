const shortid = require("shortid")
const _ = require("lodash")
const stream = require("stream")
const router = require("express").Router()
const User = require("./database").User
const Metadata = require("./database").Metadata
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


const send_buffer = async (buffer, filename, res) => {
    if (!filename) {
        filename = "file"
    }
    let readstream = new stream.PassThrough()
    readstream.end(buffer)
    res.set("Content-disposition", "attachment; filename=" + filename)
    readstream.pipe(res)
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
    if (!req.files.file) {
        res.status(400).send("File not found")
    } else {
        let fileid = req.body.fileid
        if (!fileid) {
            fileid = shortid.generate() + shortid.generate()
        } else {
            fileid = fileid.replace(/\W/g, "_")
        }
        let filename = req.files.file.name
        let filebuffer = req.files.file.data
        // Hash
        let _hash = await ipfs.ipfs_add(filebuffer)
        // let _hash = shortid.generate()  // Fake hash
        try {
            await lms.addHash(fileid, req.userid, _hash)
            await Metadata.add(fileid, filename)
            await User.add_file(req.userid, fileid)
            res.send(fileid)
        } catch (err) {
            res.status(400).send("Invalid owner")
            console.log(err)
        }
    }
})


router.get("/view/:fileid", async (req, res) => {
    try {
        let hash = await lms.viewHash(req.params.fileid)
        let owner = await User.get(hash.owner)
        let metadata = await Metadata.get(req.params.fileid)
        let versions = []
        for (var i = 0; i < hash.versions.length; i++) {
            versions.push({
                hash: hash.versions[i],
                name: metadata.versions[i].name,
                creationTime: metadata.versions[i].creationTime
            })
        }
        res.send({
            owner: owner.email,
            name: metadata.name,
            versions: versions
        })
    } catch (err) {
        res.status(400).send("File not found")
    }
})


router.get("/list", auth, async (req, res) => {
    let result = await User.get(req.userid)
    res.send(result.collection)
})


router.get("/list/:userid", async (req, res) => {
    let result = await User.get(req.params.userid)
    res.send(result.collection)
})


router.get("/download/:fileid", async (req, res) => {
    try {
        let result = await lms.viewHash(req.params.fileid)
        let _hash = _.last(result.versions)
        let metadata = await Metadata.get(req.params.fileid)
        let _name = _.last(metadata.versions).name
        let buffer = await ipfs.ipfs_get(_hash)
        await send_buffer(buffer, _name, res)
    } catch (err) {
        res.status(400).send("File not found")
    }
})


router.get("/download/:fileid/:versionid", async (req, res) => {
    try {
        let result = await lms.viewHash(req.params.fileid)
        let vid = parseInt(req.params.versionid)
        if (vid != NaN && _.inRange(vid, result.versions.length)) {
            let _hash = result.versions[vid]
            let metadata = await Metadata.get(req.params.fileid)
            let _name = metadata.versions[vid].name
            let buffer = await ipfs.ipfs_get(_hash)
            await send_buffer(buffer, _name, res)
        } else {
            res.status(400).send("File not found")
        }
    } catch (err) {
        res.status(400).send("File not found")
    }
})


module.exports = router
