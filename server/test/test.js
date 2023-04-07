const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { string } = require("hardhat/internal/core/params/argumentTypes");

async function printUsersInfo(hardhatNewsForumContract) {
    //return "Hello";

    const allUsers = await hardhatNewsForumContract.getAllUsers();
    for (let i = 0; i < allUsers.length; i++){
        const user = allUsers[i];
        console.log(user);
        // console.log("Name of user is -> ", user.name);
        // console.log("Address is-> ", user.userAddress);
        // console.log("IsValidated Value-> ", user.isValidator);
        // console.log("Can be validator-> ", user.canBeValidator);
        // console.log("Reward Count of User is -> ", parseInt(user.rewardCount, 10));
    }
}

describe("NewsForumContract", function () {
    async function deployTokenFixture() {
        const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
        const NewsForumContract = await ethers.getContractFactory("NewsForumContract");
        const hardhatNewsForumContract = await NewsForumContract.deploy();
        await hardhatNewsForumContract.deployed();
        const user1 = { name: "tushadsar", email: "tsingdas@gmail.com", address: addr1.address };
        await hardhatNewsForumContract.addNewUser(user1.name, user1.email, user1.address);
        //use of a fixture
        return { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2, addr3, addr4 };
    }

    it("Should add a user", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const numUsers = parseInt(await hardhatNewsForumContract.getUserCount(), 10);
        const user2 = { name: "tushar", email: "tsi@gmail.com", address: addr2.address };
        await hardhatNewsForumContract.addNewUser(user2.name, user2.email, user2.address);
        expect(await hardhatNewsForumContract.getUserCount()).to.equal(numUsers + 1);
        const user = await hardhatNewsForumContract.getUser(numUsers);
        expect(user.name).to.equal(user2.name);
        expect(user.email).to.equal(user2.email);
        expect(user.userAddress).to.equal(user2.address);
    });

    it("Unauthorized user should not be able to add a user", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const user2 = { name: "tushar", email: "tsi@gmail.com", address: addr2.address };
        await expect(hardhatNewsForumContract.connect(addr2).addNewUser(user2.name, user2.email, user2.address)).to.be.revertedWith("Only owner can call this function");
    });

    it("Should update a user", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1 } = await loadFixture(deployTokenFixture);
        const numUsers = parseInt(await hardhatNewsForumContract.getUserCount(), 10);
        const newUserDetails = { name: "tushar", email: "tsin@gmail.com", address: addr1.address };
        await hardhatNewsForumContract.connect(addr1).updateUser(newUserDetails.name, newUserDetails.email);
        const user = await hardhatNewsForumContract.getUser(numUsers - 1);
        expect(user.name).to.equal(newUserDetails.name);
        expect(user.email).to.equal(newUserDetails.email);
        expect(user.userAddress).to.equal(newUserDetails.address);
    });

    it("Unauthorized user should not be able to update a user", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const newUserDetails = { name: "tushar", email: "tsin@gmail.com", address: addr1.address };
        await expect(hardhatNewsForumContract.connect(addr2).updateUser(newUserDetails.name, newUserDetails.email)).to.be.revertedWith("You must be registered to perform the action");
    });

    it("Should add an article", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content", author: addr1.address };
        await hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content);
        expect(await hardhatNewsForumContract.getArticleCount()).to.equal(numArticles + 1);
        const newArticle = await hardhatNewsForumContract.getArticleById(numArticles);
        expect(newArticle.title).to.equal(article.title);
        expect(newArticle.content).to.equal(article.content);
        expect(newArticle.author).to.equal(article.author);

    });

    it("Unauthorized user should not be able to add an article", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const article = { title: "title", content: "content", author: addr1.address };
        await expect(hardhatNewsForumContract.connect(addr2).addArticle(article.title, article.content)).to.be.revertedWith("You must be registered to perform the action");
    });

    it("Should update an article", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content", author: addr1.address };
        await hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content);
        const newArticle = { title: "new title", content: "new content", author: addr1.address };
        await hardhatNewsForumContract.connect(addr1).updateArticle(numArticles, newArticle.title, newArticle.content);
        const updatedArticle = await hardhatNewsForumContract.getArticleById(numArticles);
        expect(updatedArticle.title).to.equal(newArticle.title);
        expect(updatedArticle.content).to.equal(newArticle.content);
        expect(updatedArticle.author).to.equal(newArticle.author);
    })

    it("Unauthorized user should not be able to update an article", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content", author: addr1.address };
        await hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content);
        const newArticle = { title: "new title", content: "new content", author: addr1.address };
        await expect(hardhatNewsForumContract.connect(addr1).updateArticle(numArticles + 1, newArticle.title, newArticle.content)).to.be.reverted;
    })

    it("Should return all articles", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const articles = [{ title: "article1", content: "content1", author: addr1.address }, { title: "article2", content: "content2", author: addr1.address }, { title: "article3", content: "content3", author: addr1.address }];
        for (let i in articles) {
            await hardhatNewsForumContract.connect(addr1).addArticle(articles[i].title, articles[i].content);
            const a = await hardhatNewsForumContract.getArticleById(numArticles + parseInt(i, 10));
        }
        expect(await hardhatNewsForumContract.getArticleCount()).to.equal(numArticles + articles.length);
        let allArticles = await hardhatNewsForumContract.getAllArticles();

        // Ignoring first invalid article
        allArticles = allArticles.slice(1);

        for (let i in allArticles) {
            expect(allArticles[i].title).to.equal(articles[i].title);
            expect(allArticles[i].content).to.equal(articles[i].content);
            expect(allArticles[i].author).to.equal(articles[i].author);
        }
    });

    it("Should upvote and downvote an article", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const users = []
        for (let i = 0; i < 10; i++) {
            const signer = await ethers.getSigner(i + 2);
            const user = { name: "user" + i, email: "tsi" + i + "@gmail.com", signer: signer };
            users.push(user);
            await hardhatNewsForumContract.addNewUser(user.name, user.email, user.signer.address);
        }
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content", author: addr1.address };
        await hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content);

        for (let i = 0; i < users.length; i++) {
            await hardhatNewsForumContract.connect(users[i].signer).upvoteArticle(numArticles);
        }
        expect(await hardhatNewsForumContract.getNumberOfUpvotes(numArticles)).to.equal(users.length);

        for (let i = 0; i < users.length; i++) {
            await hardhatNewsForumContract.connect(users[i].signer).downvoteArticle(numArticles);
        }
        expect(await hardhatNewsForumContract.getNumberOfDownvotes(numArticles)).to.equal(0);

        for (let i = 0; i < users.length; i++) {
            await hardhatNewsForumContract.connect(users[i].signer).downvoteArticle(numArticles);
        }
        expect(await hardhatNewsForumContract.getNumberOfDownvotes(numArticles)).to.equal(users.length);
    });

    it("Only registered users can upvote and downvote the articles", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const users = []
        for (let i = 0; i < 10; i++) {
            const signer = await ethers.getSigner(i + 2);
            const user = { name: "user" + i, email: "tsi" + i + "@gmail.com", signer: signer };
            users.push(user);
            if (i < 5) {
                await hardhatNewsForumContract.addNewUser(user.name, user.email, user.signer.address);
            }
        }
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content", author: addr1.address };
        await hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content);
        for (let i = 0; i < users.length; i++) {
            if (i >= 5) {
                await expect(hardhatNewsForumContract.connect(users[i].signer).upvoteArticle(numArticles)).be.reverted;
            }
        }
        for (let i = 0; i < users.length; i++) {
            if (i >= 5) {
                await expect(hardhatNewsForumContract.connect(users[i].signer).downvoteArticle(numArticles)).be.reverted;
            }
        }
    });

    it("Should validate an article if the user is an Active Validator", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content", author: addr1.address };
        await hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content);
        const article1 = await hardhatNewsForumContract.getArticleById(numArticles);
        // console.log(article1);
        await hardhatNewsForumContract.connect(owner).validateArticle(numArticles);
        const validatedArticle = await hardhatNewsForumContract.getArticleById(numArticles);
        //article is validatd by just one validator cause we have set NUM_VALIDATORS to 3, so 3/2 gives 1
        expect(validatedArticle.isValidated).to.equal(true);
    });

    it("Should give reward to the editor when an article gets validated", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content", author: addr1.address };
        await hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content);
        const article1 = await hardhatNewsForumContract.getArticleById(numArticles);
        //console.log(article1);

        const id_of_addr1 = 2;
        //initial reward of the editor
        let user1 = await hardhatNewsForumContract.getUser(id_of_addr1);
        const initialBalance = parseInt(user1.rewardCount, 10);
        //console.log("initial balance is ",  initialBalance);
        //now validate the article at index=1 by the owner

        //expect(validatedArticle.isValidated).to.equal(false);
        //console.log((await hardhatNewsForumContract.getArticleById(numArticles)).isValidated);
        const tx = await hardhatNewsForumContract.connect(owner).validateArticle(numArticles);
        // await tx.wait();
        // let events = await hardhatNewsForumContract.queryFilter("ArticleValidated");
        // console.log("Article Validated Event emitted", events);
        // events = await hardhatNewsForumContract.queryFilter("RewardSummary");
        // console.log("Reward Summary Event Emitted", events);
        // events = await hardhatNewsForumContract.queryFilter("eligibleValidator");
        // console.log("eligibleValidator event emitted", events);
        // const allUsers = await hardhatNewsForumContract.getAllUsers();
        // console.log(allUsers[2]);

        //as only 3/2 validators needed, hence the aritcle is validated now
        const validatedArticle = await hardhatNewsForumContract.getArticleById(numArticles);
        //expect(validatedArticle.isValidated).to.equal(true);
        //console.log(validatedArticle.isValidated);
        //now check the balance of the editor
        user1 = await hardhatNewsForumContract.getUser(id_of_addr1);
        const finalBalance = parseInt(user1.rewardCount, 10);
        //reward should be rewardToEditorUponArticleValidation
        const rewardToEditorUponArticleValidation = parseInt(await hardhatNewsForumContract.rewardToEditorUponArticleValidation(), 10);
        //console.log(rewardToEditorUponArticleValidation);
        expect(finalBalance).to.equal(initialBalance + rewardToEditorUponArticleValidation);


    });

    it("Should give reward to validators once the article reaches certain number of upvotes", async function () {
        //validate the article by owner, user1 and user2
        //but all of them should have validation power to be able to validate an article.
        //need to give them the validation power artficially
        //or we can have one article each by user1 and user2, validate those by owner so that user1 and user2 get validation power
        //use this validation 
        //then each of owner, user1 and user2 upvote an article by user3(which can be validated by any of the three validators)
        //when three upvotes reached on this article by user 3, all the validators of this article shold get the reward
        
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2, addr3, addr4} = await loadFixture(deployTokenFixture);
        const user1 = { name: "tushadsar", email: "tsingdas@gmail.com", address: addr1.address };
        await hardhatNewsForumContract.addNewUser(user1.name, user1.email, user1.address);
    });

    it("Should not validate an article if the user is not an Active Validator", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        //await console.log(await hardhatNewsForumContract.getUserCount());
        // Do I need to add a user with addr1??????????
        //await printUsersInfo(hardhatNewsForumContract);


        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content", author: addr1.address };
        await hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content);
        const article1 = await hardhatNewsForumContract.getArticleById(numArticles);
        // console.log(article1);
        await expect(hardhatNewsForumContract.connect(addr1).validateArticle(numArticles)).to.be.revertedWith("You must be a validator to perform the action");
    });

    it("User should get canBeValidator powers when atleast 4 articles published by the user are validated", async function () {

    });

    it("Should not allow the author of the article to validate the article", async function () {

    });

    it("Should shift the validation power when required and if possible", async function () {
        
    });
    
});