// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./InitializeContract.sol";
import "hardhat/console.sol";

contract Transaction is Ownable {
    /*
    This contract holds information of the Data Processor
    to whom the data subject is affiliated with. It could be
    an educational institution, a hospital or a place of work.
     */

    //mapping that stores all users and their contracts
    mapping(address => address) public users;
    bytes32 public institutionName;
    address public institutionAddress;
    uint256 public counter;
    

    constructor(
        bytes32 _institutionName
    ) {
        institutionAddress = owner();
        institutionName = _institutionName;
    }

    function setUserCounter(address _contract, address _user) public {
        users[_user] = _contract;
        counter+=1;
    }

    function getUser(address _user) public view returns (address) {
        return users[_user];
    }

}