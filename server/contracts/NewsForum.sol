// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";


contract NewsForumContract {
    uint256 public constant VALIDATIONS_REQUIRED = 10;
    uint256 public constant VALIDATION_REWARD = 10;
    uint256 public constant NUMBER_OF_VALIDATORS = 1;
    uint256 public totalRewardCount = 0;
    uint256 public maxNumberOfActiveValidators = 10;
    uint256 public constant upvotesCountForAwardToValidator = 5;
    uint256 public constant rewardToEditorUponArticleValidation = 1;
    uint256 public constant rewardToValidatorsUponReachingUpvotes = 1;
    

    address owner;

    User[] public users;
    mapping(address => uint256) addressToUserId;
    mapping(uint256 => address) UserIdToaddress;
    
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

    event ValidationPowerTransferred(address fromUser, address toUser);
    event ArticleValidated(uint256 articleId);
    event eligibleValidator(address User);

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
        bool validatorsRewardedUponUpvotes;
    }

    struct User {
        string name;
        string email;
        address userAddress;
        bool valid;
        uint timestamp;
        bool canBeValidator;
        uint256 articlesValidatedSinceLastAppoint;
        uint256 rewardCount;
        uint256 articleValidatedCount;
    }

    constructor() {
        owner = msg.sender;
        users.push(User("Invalid User", "", address(0), false, 0, false, 0, 0, 0));
        articles.push(Article(0, "Invalid Article", "", address(0),
                                new address[](0), new address[](0), new address[](0),
                                false, false, 0, false));
    }

    function addNewUser(string memory _name, string memory _email, address _wallet) external OnlyOwner {
        users.push(User(_name, _email, _wallet, true, block.timestamp, false, 0, 0, 0));
        validators[msg.sender] = false;
        addressToUserId[_wallet] = users.length - 1;
        UserIdToaddress[users.length - 1] = _wallet;
    }

    function updateUser(string memory _name, string memory _email) external OnlyRegistered {
        users[addressToUserId[msg.sender]].name = _name;
        users[addressToUserId[msg.sender]].email = _email;
        users[addressToUserId[msg.sender]].timestamp = block.timestamp;
    }

    function getUserCount() external view returns (uint) {
        return users.length;
    }

    function getUser(uint userId) external view returns (User memory) {
        require(users[userId].valid == true, "User does not exist");
        return users[userId];
    }

    function updateValidators() external OnlyOwner {
        // Logic to update validators
    }


    function addArticle(string memory _title, string memory _content) external OnlyRegistered {
        uint id = articles.length;
        articles.push(Article(id, _title, _content, msg.sender,
                                new address[](0), new address[](0), new address[](0),
                                false, true, block.timestamp, false));
        articleToOwner[id] = msg.sender;

        // uint userId = addressToUserId[msg.sender];
        // users[userId].articleValidatedCount += 1;
        
        // if(users[userId].articleValidatedCount >= 4){
        //     //this user can be a validator
        //     users[userId].canBeValidator = true;
        //     emit eligibleValidator(msg.sender);
        // }        
    }

    function updateArticle(uint articleId, string memory _title, string memory _content) external OnlyRegistered {
        require(articleToOwner[articleId] == msg.sender, "You must be the author of the article to update it");
        require(articles[articleId].valid == true, "Article does not exist");

        articles[articleId].title = _title;
        articles[articleId].content = _content;
        articles[articleId].timestamp = block.timestamp;
    }

    function giveAwardToValidators(uint articleId) private{
        for (uint i = 0; i < articles[articleId].validators.length; i++) {
            address valiAd = articles[articleId].validators[i];
            uint256 userId = addressToUserId[valiAd];
            //reward the user with this userId
            users[userId].rewardCount = users[userId].rewardCount + rewardToValidatorsUponReachingUpvotes;
            totalRewardCount = totalRewardCount + rewardToValidatorsUponReachingUpvotes;

            if(users[userId].rewardCount >= totalRewardCount/2){
                users[userId].canBeValidator = true;
                emit eligibleValidator(UserIdToaddress[userId]);
            }
        }
    }

    function rewardArticleEditor(uint articleId) private {
        //when half of the current active validators validate an article, then the editor gets some reward

        //get the editor/author of the article
        address authorAddress = articles[articleId].author;
        //get the userId
        uint256 userId = addressToUserId[authorAddress];
        //give reward to this userId
        users[userId].rewardCount = users[userId].rewardCount + rewardToEditorUponArticleValidation;
        totalRewardCount = totalRewardCount + rewardToEditorUponArticleValidation;

        if(users[userId].rewardCount >= totalRewardCount/2){
            users[userId].canBeValidator = true;
            emit eligibleValidator(UserIdToaddress[userId]);
        }
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

        if(articles[articleId].validatorsRewardedUponUpvotes == false && articles[articleId].upvotes.length == upvotesCountForAwardToValidator){
            //this reward is given only once when the upvotes reach a certain count
            giveAwardToValidators(articleId);
            articles[articleId].validatorsRewardedUponUpvotes = true;
        }
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
        for (uint i = 1; i < articles.length; i++) {
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
    
    function getAllArticles() external view returns (Article[] memory) {
        return articles;
    }

    function getAllValidatedArticles () external view returns (Article[] memory) {
        Article[] memory allArticles = new Article[](articles.length);
        uint counter = 0;
        for (uint i = 1; i < articles.length; i++) {
            if (articles[i].isValidated == true) {
                allArticles[counter] = articles[i];
                counter++;
            }
        }
        return allArticles;
    }

    function getArticleCount () external view returns (uint) {
        return articles.length;
    }

    function getAllArticlesForValidation () external view OnlyValidator returns (Article[] memory) {
        Article[] memory allArticles = new Article[](articles.length);
        uint counter = 0;
        for (uint i = 1; i < articles.length; i++) {
            if (articles[i].isValidated == false) {
                allArticles[counter] = articles[i];
                counter++;
            }
        }
        return allArticles;
    }

    function findNewValidator() private{
        uint userIdOfCurrent = addressToUserId[msg.sender];
        //iterate over all the users
        for(uint i = 1; i < users.length; i++){
            address newUser = UserIdToaddress[i];
            if(i != userIdOfCurrent && users[i].canBeValidator == true && validators[newUser] == false){
                //this is a potential new validator
                validators[newUser] == true;
                users[i].articlesValidatedSinceLastAppoint = 0;

                //remove the current caller/user from validators list
                validators[msg.sender] = false;
                users[userIdOfCurrent].articlesValidatedSinceLastAppoint = 0;
                
                //emit an event to the logs of power transfer
                emit ValidationPowerTransferred(msg.sender, newUser);

                //break the loop as we found one new validator
                break;
            }
        }
    }

    function transferValidationPowerIfPossible() private{
        //will transfer power only if new valiator is available and 10 articles validated
        //otherwise the validation power remains with the current user/caller

        uint userId = addressToUserId[msg.sender];
        if(users[userId].articlesValidatedSinceLastAppoint == 10){
            //the user has already valiated atleast 10 articles
            //we can give the validation power to someone else if availabe
            findNewValidator();
        }
    }

    function currentActiveValidators() private returns (uint256){
        // uint256 count = 0;
        // for(uint i = 0; i < validators.length; i++){
        //     if(validators[i] == true){
        //         count += 1;
        //     }
        // }
        // return count;
    }

    function validateArticle(uint articleId) external OnlyRegistered OnlyValidator {
        //this function will be called when an "active validator" clicks on validate article button after reading the article

        require(articles[articleId].valid == true, "Article does not exist");
        require(articles[articleId].isValidated == false, "Article has already been validated");
        
        for (uint i = 0; i < articles[articleId].validators.length; i++) {
            if (articles[articleId].validators[i] == msg.sender) {
                revert("You have already validated this article");
            }
        }

        articles[articleId].validators.push(msg.sender);
        //increase the count of validated articles
        uint256 userId = addressToUserId[msg.sender];
        users[userId].articlesValidatedSinceLastAppoint += 1;

        //if the article is validated by more than half of the total validators then it can
        //be shown on the forum
        if(articles[articleId].isValidated == false && articles[articleId].validators.length >= NUMBER_OF_VALIDATORS/2) {
            articles[articleId].isValidated = true;
            emit ArticleValidated(articleId);
            //reward the validators who validated this article
            rewardArticleEditor(articleId);


            //fetch the user who edited/wrote this article which the msg.sender just validated
            address editorAddress = articles[articleId].author;
            uint256 editorId = addressToUserId[editorAddress];
            //incrementing the count of articles which are validated by atleast half of the validators and are written by the same author/editor
            users[editorId].articleValidatedCount++;
            if(users[editorId].canBeValidator == false && users[editorId].articleValidatedCount >= 4){
                //give the powers 
                users[editorId].canBeValidator = true;
                emit eligibleValidator(UserIdToaddress[editorId]);
            }
        }

        //check if we need to transfer the valiation power to other eligible validators
        if(maxNumberOfActiveValidators <= currentActiveValidators()){
            transferValidationPowerIfPossible();
        }
    }
}
