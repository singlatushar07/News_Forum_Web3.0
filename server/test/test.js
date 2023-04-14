const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture, setBalance } = require("@nomicfoundation/hardhat-network-helpers");
// const { ethers } = require('ethers');


async function printUsersInfo(hardhatNewsForumContract) {
    //return "Hello";

    const allUsers = await hardhatNewsForumContract.getAllUsers();
    for (let i = 0; i < allUsers.length; i++) {
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

    async function deployValidationFixture() {
        const [owner] = await ethers.getSigners();
        const NewsForumContract = await ethers.getContractFactory("NewsForumContract");
        const hardhatNewsForumContract = await NewsForumContract.deploy();
        await hardhatNewsForumContract.deployed();
        const maxNumberOfActiveValidators = parseInt(await hardhatNewsForumContract.maxNumberOfActiveValidators(), 10);
        const numValidators = Math.floor(maxNumberOfActiveValidators / 2);

        const validators = [];
        for (let i = 0; i < numValidators; i++) {
            const signer = await ethers.getSigner(i);
            const user = { name: "validator" + i, email: "tsi" + i + "@gmail.com", signer: signer, id: i + 1 };
            validators.push(user);
            if (i !== 0) {
                await hardhatNewsForumContract.addNewUser(user.name, user.email, user.signer.address);
            }
        }

        //use of a fixture
        return { NewsForumContract, hardhatNewsForumContract, owner, validators, maxNumberOfActiveValidators, numValidators };
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

    // it("Unauthorized user should not be able to add a user", async function () {
    //     const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
    //     const user2 = { name: "tushar", email: "tsi@gmail.com", address: addr2.address };
    //     await expect(hardhatNewsForumContract.connect(addr2).addNewUser(user2.name, user2.email, user2.address)).to.be.revertedWith("Only owner can call this function");
    // });

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
        const { NewsForumContract, hardhatNewsForumContract, owner, validators, maxNumberOfActiveValidators, numValidators } = await loadFixture(deployValidationFixture);
        // const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const users = []
        for (let i = 0; i < 10; i++) {
            const signer = await ethers.getSigner(i + numValidators);
            const user = { name: "user" + i, email: "tsi" + i + "@gmail.com", signer: signer };
            users.push(user);
            await hardhatNewsForumContract.addNewUser(user.name, user.email, user.signer.address);
        }
        const user = { name: "user" + 10, email: "tsi" + 10 + "@gmail.com", signer: await ethers.getSigner(10 + numValidators) };
        await hardhatNewsForumContract.addNewUser(user.name, user.email, user.signer.address);
        const addr1 = user.signer;
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content", author: user.signer.address };
        await hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content);
        for (let i = 0; i < numValidators; i++) {
            await hardhatNewsForumContract.connect(validators[i].signer).validateArticle(numArticles);
        }

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

    it("Only maxUnvalidatedArticles number of unvalidated articles can be added by a user", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const maxUnvalidatedArticles = await hardhatNewsForumContract.maxUnvalidatedArticles();
        const article = { title: "title", content: "content", author: addr1.address };
        for (let i = 0; i < maxUnvalidatedArticles; i++) {
            await hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content);
        }
        await expect(hardhatNewsForumContract.connect(addr1).addArticle(article.title, article.content)).be.revertedWith("You have reached the maximum number of unvalidated articles");
    });

    it("Should validate an article by Active Validators", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, validators, maxNumberOfActiveValidators, numValidators } = await loadFixture(deployValidationFixture);

        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content" };
        await hardhatNewsForumContract.connect(owner).addNewUser("name", "email", (await ethers.getSigner(numValidators)).address);
        await hardhatNewsForumContract.connect(await ethers.getSigner(numValidators)).addArticle(article.title, article.content);
        const unvalidatedArticle = await hardhatNewsForumContract.getArticleById(numArticles);
        expect(unvalidatedArticle.isValidated).to.equal(false);

        for (let i = 0; i < Math.floor(maxNumberOfActiveValidators / 2); i++) {
            await hardhatNewsForumContract.connect(validators[i].signer).validateArticle(numArticles);
            const validatedArticle = await hardhatNewsForumContract.getArticleById(numArticles);
            if (i !== Math.floor(maxNumberOfActiveValidators / 2) - 1) {
                expect(validatedArticle.isValidated).to.equal(false);
            } else {
                expect(validatedArticle.isValidated).to.equal(true);
            }
        }
    });

    it("Should give reward to the editor when an article gets validated", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, validators, maxNumberOfActiveValidators, numValidators } = await loadFixture(deployValidationFixture);

        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content" };
        const signer = await ethers.getSigner(numValidators);
        await hardhatNewsForumContract.connect(owner).addNewUser("name", "email", signer.address);
        await hardhatNewsForumContract.connect(signer).addArticle(article.title, article.content);
        const unvalidatedArticle = await hardhatNewsForumContract.getArticleById(numArticles);
        expect(unvalidatedArticle.isValidated).to.equal(false);


        const initialBalance = parseInt((await hardhatNewsForumContract.getUser(numValidators + 1)).rewardCount, 10);

        for (let i = 0; i < Math.floor(maxNumberOfActiveValidators / 2); i++) {
            await hardhatNewsForumContract.connect(validators[i].signer).validateArticle(numArticles);
        }
        const finalBalance = parseInt((await hardhatNewsForumContract.getUser(numValidators + 1)).rewardCount, 10);
        const rewardToEditorUponArticleValidation = parseInt(await hardhatNewsForumContract.rewardToEditorUponArticleValidation(), 10);
        expect(finalBalance).to.equal(initialBalance + rewardToEditorUponArticleValidation);
    });

    it("Should give reward to validators once the article reaches certain number of upvotes", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, validators, maxNumberOfActiveValidators, numValidators } = await loadFixture(deployValidationFixture);
        const upvotesCountForAwardToValidator = parseInt(await hardhatNewsForumContract.upvotesCountForAwardToValidator(), 10);
        const users = [];
        for (let i = 0; i < upvotesCountForAwardToValidator + 1; i++) {
            const signer = await ethers.getSigner(i + numValidators);
            const user = { name: "user" + i, email: "tsi" + i + "@gmail.com", signer: signer };
            users.push(user);
            await hardhatNewsForumContract.addNewUser(user.name, user.email, user.signer.address);
        }
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content", author: users[0].address };
        await hardhatNewsForumContract.connect(users[0].signer).addArticle(article.title, article.content);


        const initialBalances = [];
        for (let i = 0; i < numValidators; i++) {
            const validator = await hardhatNewsForumContract.getUser(validators[i].id);
            initialBalances.push(parseInt(validator.rewardCount, 10));
            await hardhatNewsForumContract.connect(validators[i].signer).validateArticle(numArticles);
        }

        for (let i = 1; i < users.length; i++) {
            await hardhatNewsForumContract.connect(users[i].signer).upvoteArticle(numArticles);
        }

        let a = await hardhatNewsForumContract.getArticleById(numArticles);
        const rewardToValidatorsUponReachingUpvotes = parseInt(await hardhatNewsForumContract.rewardToValidatorsUponReachingUpvotes(), 10);
        for (let i = 0; i < numValidators; i++) {
            const validator = await hardhatNewsForumContract.getUser(validators[i].id);
            expect(parseInt(validator.rewardCount, 10)).to.equal(initialBalances[i] + rewardToValidatorsUponReachingUpvotes);
        }

    });

    it("Should not validate an article if the user is not an Active Validator", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, validators, maxNumberOfActiveValidators, numValidators } = await loadFixture(deployValidationFixture);

        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content" };
        const signer1 = await ethers.getSigner(numValidators);
        const signer2 = await ethers.getSigner(numValidators + 1);
        await hardhatNewsForumContract.addNewUser("name1", "email1", signer1.address);
        await hardhatNewsForumContract.addNewUser("name2", "email2", signer2.address);
        await hardhatNewsForumContract.connect(signer1).addArticle(article.title, article.content);
        await expect(hardhatNewsForumContract.connect(signer2).validateArticle(numArticles)).to.be.revertedWith("You must be a validator to perform the action");
    });

    it("User should get canBeValidator powers when atleast minArticleValidationsToGetValidatorPower articles published by the user are validated", async function () {

        const { NewsForumContract, hardhatNewsForumContract, owner, validators, maxNumberOfActiveValidators, numValidators } = await loadFixture(deployValidationFixture);
        const minArticleValidationsToGetValidatorPower = await hardhatNewsForumContract.minArticleValidationsToGetValidatorPower();
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const signer = await ethers.getSigner(numValidators);
        const article = { title: "title", content: "content" };
        await hardhatNewsForumContract.connect(owner).addNewUser("name", "email", signer.address);
        for (let i = 0; i < minArticleValidationsToGetValidatorPower; i++) {
            await hardhatNewsForumContract.connect(signer).addArticle(article.title, article.content);
        }
        let user = await hardhatNewsForumContract.getUser(numValidators + 1);
        expect(await user.canBeValidator).to.equal(false);

        for (let j = 0; j < minArticleValidationsToGetValidatorPower; j++) {
            for (let i = 0; i < Math.floor(maxNumberOfActiveValidators / 2); i++) {
                await hardhatNewsForumContract.connect(validators[i].signer).validateArticle(numArticles + j);
            }
            user = await hardhatNewsForumContract.getUser(numValidators + 1);
            if (j == minArticleValidationsToGetValidatorPower - 1) {
                expect(await user.canBeValidator).to.equal(true);
            } else {
                expect(await user.canBeValidator).to.equal(false);
            }
        }

    });

    it("Should not allow the author of the article to validate the article even if author is an active validator", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, validators, maxNumberOfActiveValidators, numValidators } = await loadFixture(deployValidationFixture);

        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);

        const article = { title: "title", content: "content", author: validators[0].address };

        await hardhatNewsForumContract.connect(validators[0].signer).addArticle(article.title, article.content);
        await expect(hardhatNewsForumContract.connect(validators[0].signer).validateArticle(numArticles)).to.be.revertedWith("You cannot validate your own article");

    });

    it("Should not allow an already validated article to be revalidated by Active Validators", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, validators, maxNumberOfActiveValidators, numValidators } = await loadFixture(deployValidationFixture);

        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        const article = { title: "title", content: "content" };
        await hardhatNewsForumContract.connect(owner).addNewUser("name", "email", (await ethers.getSigner(numValidators)).address);
        await hardhatNewsForumContract.connect(await ethers.getSigner(numValidators)).addArticle(article.title, article.content);
        const unvalidatedArticle = await hardhatNewsForumContract.getArticleById(numArticles);
        expect(unvalidatedArticle.isValidated).to.equal(false);

        for (let i = 0; i < Math.floor(maxNumberOfActiveValidators / 2); i++) {
            await hardhatNewsForumContract.connect(validators[i].signer).validateArticle(numArticles);
        }
        await expect(hardhatNewsForumContract.connect(validators[0].signer).validateArticle(numArticles)).to.be.revertedWith("Article has already been validated");
    });



    it("Should shift the validation power when required and if possible", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, validators, maxNumberOfActiveValidators, numValidators } = await loadFixture(deployValidationFixture);
        const minArticleValidationsToGetValidatorPower = await hardhatNewsForumContract.minArticleValidationsToGetValidatorPower();
        const newValidators = [];
        for (let i = 0; i < maxNumberOfActiveValidators - numValidators; i++) {
            const signer = await ethers.getSigner(i + numValidators);
            const user = { name: "user" + i, email: "tsi" + i + "@gmail.com", signer: signer };
            newValidators.push(user);
            await hardhatNewsForumContract.addNewUser(user.name, user.email, user.signer.address);
            for (let j = 0; j < minArticleValidationsToGetValidatorPower; j++) {
                await hardhatNewsForumContract.connect(user.signer).addArticle("title", "content");
            }
        }
        let currentNumberOfArticles = (maxNumberOfActiveValidators - numValidators) * minArticleValidationsToGetValidatorPower;
        // After this loop, we will have maxNumberOfActiveValidators - numValidators new validators
        for (let i = 1; i <= currentNumberOfArticles; i++) {
            for (let j = 0; j < numValidators; j++) {
                await hardhatNewsForumContract.connect(validators[j].signer).validateArticle(i);
            }
        }

        // Now we will add one more user
        const newSigner = await ethers.getSigner(maxNumberOfActiveValidators);
        const newUser = { name: "user" + maxNumberOfActiveValidators, email: "tsi" + maxNumberOfActiveValidators + "@gmail.com", signer: newSigner };
        await hardhatNewsForumContract.addNewUser(newUser.name, newUser.email, newUser.signer.address);

        // Now we will add minArticleValidationsToGetValidatorPower articles for the new user
        for (let j = 0; j < minArticleValidationsToGetValidatorPower; j++) {
            await hardhatNewsForumContract.connect(newUser.signer).addArticle("title1", "content1");
        }

        // Now we will validate the new articles and see if the new user becomes a validator
        for (let i = 0; i < minArticleValidationsToGetValidatorPower; i++) {
            for (let j = 0; j < numValidators; j++) {
                await hardhatNewsForumContract.connect(validators[j].signer).validateArticle(currentNumberOfArticles + 1 + i);
            }
        }
        const newValidator = await hardhatNewsForumContract.getUser(maxNumberOfActiveValidators);
        expect(newValidator.canBeValidator).to.equal(true);
        expect(newValidator.isActiveValidator).to.equal(true);
    });

    it("Will add 100 users and 100 articles and perform some actions like validation and upvote and downvote", async function () {
        const { NewsForumContract, hardhatNewsForumContract, owner, validators, maxNumberOfActiveValidators, numValidators } = await loadFixture(deployValidationFixture);
        const numUsers = 100;
        const randomSigners = async (amount) => {
            const signers = [];
            for (let i = 0; i < amount; i++) {
                // Create a random wallet
                let wallet = ethers.Wallet.createRandom()
                // Connect it to a provider
                wallet = wallet.connect(ethers.provider);

                // Add it to the array
                signers.push(wallet);
                await setBalance(wallet.address, ethers.utils.parseEther('1000'))
            }
            return signers;
        }

        const signers = await randomSigners(numUsers);
        const users = [];
        const articles = [];
        for (let i = 0; i < numUsers; i++) {
            const signer = signers[i];
            const user = { name: "user" + i, email: "tsi" + i + "@gmail.com", signer: signer };
            users.push(user);
            const article = { title: "title" + i, content: "content" + i };
            articles.push(article);
            await hardhatNewsForumContract.addNewUser(user.name, user.email, user.signer.address);
            await hardhatNewsForumContract.connect(signer).addArticle(article.title, article.content);
        }
        const usersInContract = await hardhatNewsForumContract.getAllUsers();
        // validators are created and one extra is invalid user
        expect(usersInContract.length - numValidators - 1).to.equal(numUsers);
        const numArticles = parseInt(await hardhatNewsForumContract.getArticleCount(), 10);
        // One extra is invalid article
        expect(numArticles).to.equal(numUsers + 1);

        for (let i = 0; i < Math.floor(maxNumberOfActiveValidators / 2); i++) {
            for (let j = 0; j < numUsers; j++) {
                await hardhatNewsForumContract.connect(validators[i].signer).validateArticle(j + 1);
            }
        }

        let validatedArticles = await hardhatNewsForumContract.getAllValidatedArticles();
        validatedArticles = validatedArticles.filter((article) => { return article.isValidated; });
        expect(validatedArticles.length).to.equal(numUsers);
        for (let i = 1; i < numUsers; i++) {
            await hardhatNewsForumContract.connect(users[i].signer).upvoteArticle(1);
        }
        const upvotes = await hardhatNewsForumContract.getNumberOfUpvotes(1);
        expect(upvotes).to.equal(numUsers - 1);
    });

});