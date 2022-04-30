const IPFS = require("ipfs-api")

const ipfs = IPFS({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https"
});


async function ipfs_add(buffer) {
    let ipfs_hash = await ipfs.add(buffer)
    return await ipfs_hash[0].hash
}


async function ipfs_get(hash) {
    let ipfs_file = await ipfs.files.get(hash)
    return ipfs_file[0].content
}


module.exports = { ipfs_add, ipfs_get }
