const Web3 = require("web3")
const contract = require("truffle-contract")

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
const artifact = require("../build/Storage.json")
const LMS = contract(artifact)
LMS.setProvider(web3.currentProvider)

const ether = {
    accounts: null,
    lms: null
}

ether.init = async () => {
    console.log("Init LMS ...")
    ether.accounts = await web3.eth.getAccounts()
    ether.lms = await LMS.deployed()
}

// LMS function

ether.addHash = async (fileid, userid, hash) => {
    return await ether.lms.addHash(fileid, userid, hash, { from: ether.accounts[0] })
}

ether.viewHash = async (fileid) => {
    let result = await ether.lms.viewHash(fileid)
    return {
        owner: result[0],
        version: result[1],
        isValue: result[2]
    }
}


module.exports = ether
