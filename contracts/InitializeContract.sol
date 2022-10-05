// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract InitializeContract is Ownable {
    //owner of the contract
    // address public owner;

    //struct to hold personal information
    struct PersonalInfo {
        bytes32 name;
        bytes32 dob;
        bytes32 nationality;
        address affiliation;
    }

    //struct to hold contact information
    struct Contact {
        bytes32 phoneNumber;
        bytes32 mailingAddress;
        bytes32 city;
        bytes32 country;
    }

    //struct to hold education information
    struct Education {
        bytes32 universityName;
        bytes32 highSchoolName;
        bytes2 highSchoolGrade;
        bytes32 gpa;
        uint256 noOfRetakes;
        uint8 pendingUnits;
    }

    //struct to hold financial information
    struct Financial {
        bytes32 bankName;
    }

    //creating a new instance of each data point
    PersonalInfo internal personal;
    Contact internal contact;
    Education internal education;
    Financial internal finance;

    //array of third parties with viewing rights for each of the categories
    mapping(address => bool) public personalInfoProcessors;
    mapping(address => bool) public contactProcessors;
    mapping(address => bool) public educationProcessors;
    mapping(address => bool) public financeProcessors;

    // mapping(uint256 => PersonalInfo) public info;

    //constructor to initialize the contract
    constructor(
        bytes32 _name,
        bytes32 _dob,
        bytes32 _nationality,
        address _affiliation,uint16
        address _newOwner
    ) {
        // owner = msg.sender;
        transferOwnership(_newOwner);
        personal = PersonalInfo(_name, _dob, _nationality, _affiliation);
    }

    // getters and setters for the individual data points
    function getPersonalInfo(address _requester) public view returns (PersonalInfo memory) {
        if (msg.sender == owner()){
            return personal;
        } else {
            require(personalInfoProcessors[_requester] == true, "You are not allowed to access this");
            return personal;
        }
    }

    function setPersonalInfo(
        bytes32 _name,
        bytes32 _dob,
        bytes32 _nationality,
        address _affiliation
    ) public onlyOwner {
        personal = PersonalInfo(_name, _dob, _nationality, _affiliation);
    }

    function getContact(address _requester)
        public
        view
        returns (Contact memory)
    {
        if (msg.sender == owner()) {
            return contact;
        } else {
            require(
                contactProcessors[_requester] == true,
                "You are not allowed to access this"
            );
            return contact;
        }
    }

    function setContact(
        bytes32 _phoneNumber,
        bytes32 _mailingAddress,
        bytes32 _city,
        bytes32 _country
    ) public onlyOwner {
        contact = Contact(_phoneNumber, _mailingAddress, _city, _country);
    }

    function getEducation(address _requester)
        public
        view
        returns (Education memory)
    {
        if (msg.sender == owner()) {
            return education;
        } else {
            require(
                educationProcessors[_requester] == true,
                "You are not allowed to access this"
            );
            return education;
        }
    }

    function setEducation(
        bytes32 _universityName,
        bytes32 _highSchoolName,
        bytes2 _highSchoolGrade,
        bytes32 _gpa,
        uint256 _noOfRetakes,
        uint8 _pendingUnits
    ) public onlyOwner {
        education = Education(
            _universityName,
            _highSchoolName,
            _highSchoolGrade,
            _gpa,
            _noOfRetakes,
            _pendingUnits
        );
    }

    function ownerAddress() public view returns (address) {
        return address(this);
    }

    // 1 - Personal Info
    // 2 - Contact
    // 4 - Education
    // 8 - Financial

    function grant(address _requester, uint16 _data) public onlyOwner {
        if (_data == 1) {
            require(
                personalInfoProcessors[_requester] == false,
                "Address already exists"
            );
            personalInfoProcessors[_requester] = true;
        } else if (_data == 2) {
            require(
                contactProcessors[_requester] == false,
                "Address already exists"
            );
            contactProcessors[_requester] = true;
        } else if (_data == 4) {
            require(
                educationProcessors[_requester] == false,
                "Address already exists"
            );
            educationProcessors[_requester] = true;
        } else {
            require(
                financeProcessors[_requester] == false,
                "Address already exists"
            );
            financeProcessors[_requester] = true;
        }
    }

    function revoke(address _requester, uint16 _data) public onlyOwner {
        if (_data == 1) {
            require(
                personalInfoProcessors[_requester] == true,
                "Address does not exists"
            );
            personalInfoProcessors[_requester] = false;
        } else if (_data == 2) {
            require(
                contactProcessors[_requester] == true,
                "Address does not exists"
            );
            contactProcessors[_requester] = false;
        } else if (_data == 4) {
            require(
                educationProcessors[_requester] == true,
                "Address does not exists"
            );
            educationProcessors[_requester] = false;
        } else {
            require(
                financeProcessors[_requester] == true,
                "Address does not exists"
            );
            financeProcessors[_requester] = false;
        }
    }
}
