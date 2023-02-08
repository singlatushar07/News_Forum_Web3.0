// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract NewsForumContract {
    Article[] public articles;
    User[] public users;
    mapping(uint256 => address) articleToOwner;

    event AddArticle(address recipent, uint tweetid);

    struct Article {
        uint id;
        string title;
        string content;
        address author;
        uint256 timestamp;
    }

    struct User {
        string name;
        string email;
        uint256 timestamp;
    }

    function addArticle(string memory _title, string memory _content) external {
        uint id = articles.length;
        articles.push(Article(id, _title, _content, msg.sender, block.timestamp));
        articleToOwner[id] = msg.sender;
        emit AddArticle(msg.sender, id);
    }

    function getAllArticles () external view returns (Article[] memory) {
        return articles;
    }

    function getMyArticles () external view returns (Article[] memory) {
        Article[] memory myArticles = new Article[](articles.length);
        uint counter = 0;
        for (uint i = 0; i < articles.length; i++) {
            if (articleToOwner[i] == msg.sender) {
                myArticles[counter] = articles[i];
                counter++;
            }
        }
        return myArticles;
    }

    function getArticleById (uint _id) external view returns (Article memory) {
        return articles[_id];
    }

    function addNewUser(string memory _name, string memory _email) external {
        users.push(User(_name, _email, block.timestamp));
    }
}
