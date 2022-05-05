const path = require("path");
const { projectID, mnemonic } = require("./secrets.json")
const HDWalletProvider = require("@truffle/hdwallet-provider")

module.exports = {
  contracts_build_directory: path.join(__dirname, "/build"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${projectID}`, 0),
      network_id: 3,
      gas: 4000000,
      gasPrice: 100000000000,
      confirmations: 2,
      timeoutBlocks: 5000,
      skipDryRun: true
    }
  }
};
