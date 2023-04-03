const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { string } = require("hardhat/internal/core/params/argumentTypes");

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

    it("Should validate an article", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content", author: addr1.address };
        await hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content);
        const article1 = await hardhatNewsForumContract.getArticleById(numArticles);
        // console.log(article1);
        await hardhatNewsForumContract.connect(owner).validateArticle(numArticles);
        const validatedArticle = await hardhatNewsForumContract.getArticleById(numArticles);
        expect(validatedArticle.isValidated).to.equal(true);
    });

    //Test 1
    //Add 4 articles from same user account and see if the user gets validation power
    //it("Users should get canBeValidator powers when 4 articles published by them", )

    //Test 2
    //Editor gets a reward when an article published by him/her gets validated by atleast half of the validators.
    // it(){

    // }

    //Test 3
    //The author of the article should not be able to validate an article, even if he is a validator

    //Test 4
    
});