require('dotenv').config()
require('@nomiclabs/hardhat-waffle')


module.exports = {
  solidity: '0.8.0',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/2c79500c736344aaab707050d476516d',
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
}
