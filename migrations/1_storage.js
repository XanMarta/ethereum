var IPFS = artifacts.require("./Storage.sol");
module.exports = function (deployer) {
    deployer.deploy(IPFS)
}
