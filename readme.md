# Consenter: A Consent Management System
This project was undertaken as a final year project, that shows how Blockchain technology, can be used to for consent management in online spaces. This repository contains the views and the smart contracts used to achieve this. Other than this repository, there is another one that represents an API that connects to a MySQL database that was used as a cache for data storage.

## Components
- Database Manager - API written Node and ExpressJS that provides access to an underlying MySQL database.
- UserClient - A front-facing VueJS app that can be used by any party to interact with the system. 

## How it Works
The system consists of three users: An institution (admin), a data subject, and a third party. The admin is responsible for registering all users (data subjects and third parties). It starts with the admin logging in (assuming the user already exists in the database). The admin then needs to deploy his own contract which will serve as the parent contract for all the data subjects in his institution. This contract is Transaction.sol in this project. 

The admin then proceeds to create a third party and a new data subject, after which a contract is automatically deployed on behalf of the data subject. The contract is InitialContract.sol. The third party then logs in and is able to see the available data subjects, and can request for information. The new data subject then logs in and is able to edit his information, and review requests made for his/her data.

## Project setup
To install all packages required for this project, you need yarn dependency manager. Use the links below to install, depending on your OS 

- [Installing Yarn for Ubuntu](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
- [Installing Yarn for Windows](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
- [Installing Yarn for macOS](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

Afterwards run,
```
yarn install
```
## Key Packages
The web3 package was used for all requests to the blockchain to make use of Metamask's JSON RPC API. All this to allow each user to sign each transaction with their private key.

Compilation of the contracts was done using solc, which is the Solidity compiler. Since all contracts are compiled, you do not need to run the command again.

To use this application, the Metamask browser extension is needed. You also need to have at least three different addresses each for the admin, data subject and the third party.

### Compiles and hot-reloads for development
To start the development environment, run the command
```
yarn serve
```

