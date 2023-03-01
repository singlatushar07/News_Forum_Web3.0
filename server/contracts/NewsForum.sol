// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";


contract NewsForumContract {
    uint256 public constant VALIDATIONS_REQUIRED = 10;
    uint256 public constant VALIDATION_REWARD = 10;
    uint256 public constant NUMBER_OF_VALIDATORS = 1;

    address owner;

    User[] public users;
    mapping(address => uint256) addressToUserId;
    
    Article[] public articles;
    mapping(uint256 => address) articleToOwner;

    mapping (address => bool) validators;

    modifier OnlyOwner {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    modifier OnlyRegistered {
        require(users[addressToUserId[msg.sender]].valid == true, "You must be registered to perform the action");
        _;
    }
    modifier OnlyValidator {
        require(validators[msg.sender] == true, "You must be a validator to perform the action");
        _;
    }

    event ArticleValidated(uint256 articleId);

    struct Article {
        uint id;
        string title;
        string content;
        address author;
        address[] upvotes;
        address[] downvotes;
        address[] validators;
        bool isValidated;
        bool valid;
        uint timestamp;
    }

    struct User {
        string name;
        string email;
        address id;
        bool valid;
        uint timestamp;
    }

    constructor() {
        owner = msg.sender;
    }

    function addNewUser(string memory _name, string memory _email, address _wallet) external OnlyOwner {
        users.push(User(_name, _email, _wallet, true, block.timestamp));
        addressToUserId[_wallet] = users.length - 1;
    }

    function updateUser(string memory _name, string memory _email) external OnlyRegistered {
        users[addressToUserId[msg.sender]].name = _name;
        users[addressToUserId[msg.sender]].email = _email;
        users[addressToUserId[msg.sender]].timestamp = block.timestamp;
    }

    function updateValidators() external OnlyOwner {
        // Logic to update validators
    }

    function addArticle(string memory _title, string memory _content) external OnlyRegistered {
        uint id = articles.length;
        articles.push(Article(id, _title, _content, msg.sender, new address[](0), new address[](0), new address[](0), false, true, block.timestamp));
        articleToOwner[id] = msg.sender;
    }

    function updateArticle(uint articleId, string memory _title, string memory _content) external OnlyRegistered {
        require(articleToOwner[articleId] == msg.sender, "You must be the author of the article to update it");
        require(articles[articleId].valid == true, "Article does not exist");

        articles[articleId].title = _title;
        articles[articleId].content = _content;
        articles[articleId].timestamp = block.timestamp;
    }

    function upvoteArticle(uint articleId) external OnlyRegistered {
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

    function downvoteArticle(uint articleId) external OnlyRegistered {
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

    function getArticleById (uint articleId) external view returns (Article memory) {
        require(articles[articleId].valid == true, "Article does not exist");
        return articles[articleId];
    }

    function getMyArticles () external OnlyRegistered view returns (Article[] memory) {
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

    function getAllArticlesForValidation () external view OnlyValidator returns (Article[] memory) {
        Article[] memory allArticles = new Article[](articles.length);
        uint counter = 0;
        for (uint i = 0; i < articles.length; i++) {
            if (articles[i].isValidated == false) {
                allArticles[counter] = articles[i];
                counter++;
            }
        }
        return allArticles;
    }

    function validateArticle(uint articleId) external OnlyRegistered OnlyValidator {
        require(articles[articleId].valid == true, "Article does not exist");
        require(articles[articleId].isValidated == false, "Article has already been validated");
        
        for (uint i = 0; i < articles[articleId].validators.length; i++) {
            if (articles[articleId].validators[i] == msg.sender) {
                revert("You have already validated this article");
            }
        }
        
        articles[articleId].validators.push(msg.sender);

        if(articles[articleId].validators.length >= NUMBER_OF_VALIDATORS/2) {
            articles[articleId].isValidated = true;
            emit ArticleValidated(articleId);
        }
    }
}
