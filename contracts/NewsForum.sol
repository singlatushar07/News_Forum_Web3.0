// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract NewsForumContract {
    News[] public news;
    User[] public users;
    
    struct News {
        string title;
        string content;
        address author;
        uint256 timestamp;
    }

    struct User {
        string name;
        string email;
        string password;
        uint256 timestamp;
    }
}
