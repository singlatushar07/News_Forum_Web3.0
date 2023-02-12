// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract NewsForumContract {
    address owner;

    User[] public users;
    mapping(address => uint256) addressToUserId;
    
    Article[] public articles;
    mapping(uint256 => address) articleToOwner;

    modifier OnlyOwner {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    struct Article {
        uint id;
        string title;
        string content;
        address author;
        address[] upvotes;
        address[] downvotes;
        bool isValidated;
        bool valid;
    }

    struct User {
        string name;
        string email;
        address id;
        bool valid;
    }

    constructor() {
        owner = msg.sender;
    }

    function addNewUser(string memory _name, string memory _email, address _wallet) external OnlyOwner {
        users.push(User(_name, _email, _wallet, true));
        addressToUserId[_wallet] = users.length - 1;
    }

    function updateUser(string memory _name, string memory _email) external {
        require(users[addressToUserId[msg.sender]].valid == true, "You must be registered to update your profile");

        users[addressToUserId[msg.sender]].name = _name;
        users[addressToUserId[msg.sender]].email = _email;
    }

    function addArticle(string memory _title, string memory _content) external {
        require(users[addressToUserId[msg.sender]].valid == true, "You must be registered to add an article");
        
        uint id = articles.length;
        articles.push(Article(id, _title, _content, msg.sender, new address[](0), new address[](0), false, true));
        articleToOwner[id] = msg.sender;
    }

    function updateArticle(uint articleId, string memory _title, string memory _content) external {
        require(users[addressToUserId[msg.sender]].valid == true, "You must be registered to update an article");
        require(articleToOwner[articleId] == msg.sender, "You must be the author of the article to update it");
        require(articles[articleId].valid == true, "Article does not exist");

        articles[articleId].title = _title;
        articles[articleId].content = _content;
    }

    function upvoteArticle(uint articleId) external {
        require(users[addressToUserId[msg.sender]].valid == true, "You must be registered to upvote an article");
        require(articles[articleId].valid == true, "Article does not exist");

        for (uint i = 0; i < articles[articleId].upvotes.length; i++) {
            if (articles[articleId].upvotes[i] == msg.sender) {
                revert("You have already upvoted this article");
            }
        }

        for (uint i = 0; i < articles[articleId].downvotes.length; i++) {
            if (articles[articleId].downvotes[i] == msg.sender) {
                delete articles[articleId].downvotes[i];
                return;
            }
        }

        articles[articleId].upvotes.push(msg.sender);
    }

    function downvoteArticle(uint articleId) external {
        require(users[addressToUserId[msg.sender]].valid == true, "You must be registered to downvote an article");
        require(articles[articleId].valid == true, "Article does not exist");

        for (uint i = 0; i < articles[articleId].downvotes.length; i++) {
            if (articles[articleId].downvotes[i] == msg.sender) {
                revert("You have already downvoted this article");
            }
        }

        for (uint i = 0; i < articles[articleId].upvotes.length; i++) {
            if (articles[articleId].upvotes[i] == msg.sender) {
                delete articles[articleId].upvotes[i];
                return;
            }
        }

        articles[articleId].downvotes.push(msg.sender);
    }

    function getArticleById (uint _id) external view returns (Article memory) {
        return articles[_id];
    }

    function getMyArticles () external view returns (Article[] memory) {
        Article[] memory myArticles = new Article[](articles.length);
        uint counter = 0;
        for (uint i = 0; i < articles.length; i++) {
            if (articles[i].author == msg.sender) {
                myArticles[counter] = articles[i];
                counter++;
            }
        }
        return myArticles;
    }

    function getNumberOfUpvotes(uint articleId) external view returns (uint) {
        return articles[articleId].upvotes.length;
    }

    function getNumberOfDownvotes(uint articleId) external view returns (uint) {
        return articles[articleId].downvotes.length;
    }

    function getAllArticles () external view returns (Article[] memory) {
        Article[] memory allArticles = new Article[](articles.length);
        uint counter = 0;
        for (uint i = 0; i < articles.length; i++) {
            if (articles[i].isValidated == true) {
                allArticles[counter] = articles[i];
                counter++;
            }
        }
        return allArticles;
    }
}
