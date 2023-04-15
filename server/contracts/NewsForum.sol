// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import "hardhat/console.sol";

contract NewsForumContract {
    uint256 public constant validationsForChange = 10;
    //uint256 public constant VALIDATION_REWARD = 10;
    //uint256 public constant NUMBER_OF_ACTIVE_VALIDATORS = 3;
    uint256 public totalRewardCount = 10;
    uint256 public maxNumberOfActiveValidators = 10;
    uint256 public constant upvotesCountForAwardToValidator = 5;
    uint256 public constant rewardToEditorUponArticleValidation = 1;
    uint256 public constant rewardToValidatorsUponReachingUpvotes = 1;
    uint256 public constant minArticleValidationsToGetValidatorPower = 4;
    uint256 public constant maxUnvalidatedArticles = minArticleValidationsToGetValidatorPower;
    uint256 public constant maxNumberOfWordsInArticle = 200;
    uint256 public constant maxNumberOfWordsInTitle = 30;

    uint256 public currentNumberOfValidators = 0;
    
   // address owner;

    User[] public users;
    mapping(address => uint256) addressToUserId;
    mapping(uint256 => address) UserIdToaddress;
    
    Article[] public articles;
    mapping(uint256 => address) articleToOwner;

    // modifier OnlyOwner {
    //     require(msg.sender == owner, "Only owner can call this function");
    //     _;
    // }
    modifier OnlyRegistered {
        require(users[addressToUserId[msg.sender]].valid == true, "You must be registered to perform the action");
        _;
    }
    modifier OnlyValidator {
        require(users[addressToUserId[msg.sender]].isActiveValidator == true, "You must be a validator to perform the action");
        _;
    }
    modifier OnlyValidated(uint articleId){
        require(articles[articleId].isValidated == true, "Action allowed only for validated articles");
        _;
    }

    event ValidationPowerTransferred(address fromUser, address toUser);
    event UserAdded(uint256 userId);
    event UserUpdated(uint256 userId);
    event ArticleAdded(uint256 articleId);
    event ArticleUpdated(uint256 articleId);
    event ArticleValidated(uint256 articleId);
    event eligibleValidator(address User);
    event ArticleValidatedByUser(uint256 articleId, address validator);
    event TryGivingPower(uint256 articleId, address author);
    event ArticleUpvoted(uint256 articleId, address upvoter);
    event ArticleDownvoted(uint256 articleId, address upvoter);
    event RewardSummary(address receiver, uint256 receiverRewards, uint256 totalReward);
    event NewActiveValidatorAdded(address validator);

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
        string authorName;
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
        uint256 unvalidatedArticlesCount;
        bool isActiveValidator;
    }

    constructor() {
        //owner = msg.sender;
        //pushing an invalid user to do some specific tests on the contract
        users.push(User("Invalid User", "", address(0), false, 0, false, 0, 0, 0, 0, false));
        //addign the owner as the first user which has validator rights
        // addNewUser("Owner", "owner@gmail.com", msg.sender);
        // users[1].isActiveValidator = true;
        // users[1].canBeValidator = true;

        articles.push(Article(0, "Invalid Article", "", address(0),
                                new address[](0), new address[](0), new address[](0),
                                false, false, 0, false,""));
    }
    
    function addNewUser(string memory _name, string memory _email, address _wallet) public {
        bool canBeValidator = false;
        if(currentNumberOfValidators < maxNumberOfActiveValidators/2){
            canBeValidator = true;
            currentNumberOfValidators += 1;
        }
        users.push(User(_name, _email, _wallet, true, block.timestamp, canBeValidator, 0, 0, 0, 0, canBeValidator));
        addressToUserId[_wallet] = users.length - 1;
        UserIdToaddress[users.length - 1] = _wallet;
        emit UserAdded(users.length - 1);

    }

    function updateUser(string memory _name, string memory _email) external OnlyRegistered {
        users[addressToUserId[msg.sender]].name = _name;
        users[addressToUserId[msg.sender]].email = _email;
        users[addressToUserId[msg.sender]].timestamp = block.timestamp;
        emit UserUpdated(addressToUserId[msg.sender]);
    }

    function getUserCount() external view returns (uint) {
        return users.length;
    }

    function getUser(uint userId) external view returns (User memory) {
        require(users[userId].valid == true, "User does not exist");
        return users[userId];
    }

    function verifyLength(string memory str, uint256 maxLength) internal pure returns (bool) {
        bytes memory bytesStr = bytes(str);
        uint wordCount = 0;
        bool lastCharWasSpace = true;

        for (uint i = 0; i < bytesStr.length; i++) {
            if (bytesStr[i] == ' ') {
                lastCharWasSpace = true;
            } else if (lastCharWasSpace) {
                wordCount++;
                lastCharWasSpace = false;
            }
        }

        return wordCount <= maxLength;
    }


    function addArticle(string memory _title, string memory _content, string memory _username) external OnlyRegistered {
        require(users[addressToUserId[msg.sender]].unvalidatedArticlesCount < maxUnvalidatedArticles, "You have reached the maximum number of unvalidated articles");
        require(verifyLength(_title, maxNumberOfWordsInTitle), "Title must have less than 30 words");
        require(verifyLength(_content, maxNumberOfWordsInArticle), "Article must have less than 200 words");
        uint id = articles.length;
        articles.push(Article(id, _title, _content, msg.sender,
                                new address[](0), new address[](0), new address[](0),
                                false, true, block.timestamp, false,_username));
        articleToOwner[id] = msg.sender;
        users[addressToUserId[msg.sender]].unvalidatedArticlesCount += 1;
        emit ArticleAdded(id);
    }

    function updateArticle(uint articleId, string memory _title, string memory _content) external OnlyRegistered {
        require(articleToOwner[articleId] == msg.sender, "You must be the author of the article to update it");
        require(articles[articleId].valid == true, "Article does not exist");
        require(verifyLength(_title, maxNumberOfWordsInTitle), "Title must have less than 30 words");
        require(verifyLength(_content, maxNumberOfWordsInArticle), "Article must have less than 200 words");

        articles[articleId].title = _title;
        articles[articleId].content = _content;
        articles[articleId].timestamp = block.timestamp;
        emit ArticleUpdated(articleId);
    }

    function giveAwardToValidators(uint articleId) internal {
        for (uint i = 0; i < articles[articleId].validators.length; i++) {
            address valiAd = articles[articleId].validators[i];
            uint256 userId = addressToUserId[valiAd];
            //reward the user with this userId
            users[userId].rewardCount = users[userId].rewardCount + rewardToValidatorsUponReachingUpvotes;
            totalRewardCount = totalRewardCount + rewardToValidatorsUponReachingUpvotes;
            emit RewardSummary(valiAd, users[userId].rewardCount, totalRewardCount);

            if(users[userId].rewardCount >= totalRewardCount/2){
                users[userId].canBeValidator = true;
                emit eligibleValidator(UserIdToaddress[userId]);
            }
        }
    }

    function rewardArticleEditor(uint articleId) internal {
        //when half of the current active validators validate an article, then the editor gets some reward

        address authorAddress = articles[articleId].author;
        uint256 userId = addressToUserId[authorAddress];
        users[userId].rewardCount = users[userId].rewardCount + rewardToEditorUponArticleValidation;
        totalRewardCount = totalRewardCount + rewardToEditorUponArticleValidation;
        emit RewardSummary(authorAddress, users[userId].rewardCount, totalRewardCount);

        if(users[userId].rewardCount >= totalRewardCount/2){
            if(!users[userId].canBeValidator){
                users[userId].canBeValidator = true;
            }
            if(!users[userId].isActiveValidator && currentActiveValidators() < maxNumberOfActiveValidators){
                users[userId].isActiveValidator = true;
                currentNumberOfValidators += 1;
                emit NewActiveValidatorAdded(authorAddress);
            }
            emit eligibleValidator(authorAddress);
        }
    }

    function upvoteArticle(uint articleId) external OnlyRegistered OnlyValidated(articleId){
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
        emit ArticleUpvoted(articleId, msg.sender);

        if(articles[articleId].validatorsRewardedUponUpvotes == false && articles[articleId].upvotes.length == upvotesCountForAwardToValidator){
            //this reward is given only once when the upvotes reach a certain count
            giveAwardToValidators(articleId);
            articles[articleId].validatorsRewardedUponUpvotes = true;
        }
    }

    function downvoteArticle(uint articleId) external OnlyRegistered OnlyValidated(articleId){
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
        emit ArticleDownvoted(articleId, msg.sender);
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

    function getAllUsers() external view returns (User[] memory){
        return users;
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

    function findNewValidator() private {
        uint userIdOfCurrent = addressToUserId[msg.sender];
        //iterate over all the users
        for(uint i = 1; i < users.length; i++){
            address newUser = UserIdToaddress[i];
            if(i != userIdOfCurrent && users[i].canBeValidator == true &&  users[i].isActiveValidator == false){
                //this is a potential new validator
                users[i].isActiveValidator = true;
                users[i].articlesValidatedSinceLastAppoint = 0;

                //remove the current caller/user from validators list
                users[addressToUserId[msg.sender]].isActiveValidator = false;
                users[userIdOfCurrent].articlesValidatedSinceLastAppoint = 0;
                
                //emit an event to the logs of power transfer
                emit ValidationPowerTransferred(msg.sender, newUser);

                //break the loop as we found one new validator
                break;
            }
        }
    }

    function transferValidationPowerIfPossible() private {
        //will transfer power only if new valiator is available and validationsForChange articles validated
        //otherwise the validation power remains with the current user/caller

        uint userId = addressToUserId[msg.sender];
        // if(users[userId].articlesValidatedSinceLastAppoint >= validationsForChange && msg.sender != owner){
        if(users[userId].articlesValidatedSinceLastAppoint >= validationsForChange){
            //the user has already valiated atleast validationsForChange articles
            //we can give the validation power to someone else if availabe
            findNewValidator();
        }
    }

    function currentActiveValidators() private view returns (uint256){
        uint256 count = 0;
        for(uint i = 0; i < users.length; i++){
            if(users[i].isActiveValidator == true){
                count += 1;
            }
        }
        return count;
    }

    function validateArticle(uint articleId) external OnlyRegistered OnlyValidator {
        //this function will be called when an "active vƒalidator" clicks on validate article button after reading the article

        require(articles[articleId].valid == true, "Article does not exist");
        require(articles[articleId].isValidated == false, "Article has already been validated");
        require(articles[articleId].author != msg.sender, "You cannot validate your own article");
        
        for (uint i = 0; i < articles[articleId].validators.length; i++) {
            if (articles[articleId].validators[i] == msg.sender) {
                revert("You have already validated this article");
            }
        }

        articles[articleId].validators.push(msg.sender);
        emit ArticleValidatedByUser(articleId, msg.sender);
        
        //increase the count of validated articles
        uint256 userId = addressToUserId[msg.sender];
        users[userId].articlesValidatedSinceLastAppoint += 1;

        //if the article is validated by more than half of the total validators then it can
        //be shown on the forum
        if(articles[articleId].isValidated == false && articles[articleId].validators.length >= maxNumberOfActiveValidators/2) {
            articles[articleId].isValidated = true;
            users[addressToUserId[articles[articleId].author]].unvalidatedArticlesCount -= 1;
            emit ArticleValidated(articleId);
            //reward the validators who validated this article
            rewardArticleEditor(articleId);

            
            //fetch the user who edited/wrote this article which the msg.sender just validated
            address editorAddress = articles[articleId].author;
            emit TryGivingPower(articleId, editorAddress);
            uint256 editorId = addressToUserId[editorAddress];
            //incrementing the count of articles which are validated by atleast half of the validators and are written by the same author/editor
            users[editorId].articleValidatedCount++;
            if(users[editorId].canBeValidator == false && users[editorId].articleValidatedCount >= minArticleValidationsToGetValidatorPower){
                //give the powers 
                users[editorId].canBeValidator = true;
                //check if you can make the user an active validator as well
                if(currentActiveValidators() < maxNumberOfActiveValidators){
                    users[editorId].isActiveValidator = true;
                    currentNumberOfValidators += 1;
                    emit NewActiveValidatorAdded(editorAddress);
                }
                emit eligibleValidator(UserIdToaddress[editorId]);
            }
        }

        //check if we need to transfer the valiation power to other eligible validators
        if(currentActiveValidators() >= maxNumberOfActiveValidators){
            transferValidationPowerIfPossible();
        }
    }
}
