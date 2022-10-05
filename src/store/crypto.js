// import { ethers } from "ethers";
import { defineStore } from "pinia";
// import contractABI from '../artifacts/contracts/Transaction.sol/Transaction.json'
// const address = '0xb8702b0765130711774a6E31246D31f14841c878'
const hre = require("hardhat")

export const useCryptoStore = defineStore('contract', () => {
    async function createContract() {
        try {
        const [deployer] = await hre.ethers.getSigners();

        console.log(
            'Deploying contracts with the account', deployer.address
        )

        const InitializeContract = await hre.ethers.getContractFactory("InitializeContract");
        const initializeContract = await InitializeContract.deploy();

        await initializeContract.deployed();

        console.log("Contract deployed to:", initializeContract.address);
        } catch(e){
            console.log('e', e)
        }
    }

    return {
        createContract
    }
})