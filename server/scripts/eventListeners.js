const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider();
const NewsForumContract = require('/Users/aashishpiitk/News_Forum_Web3.0/server/artifacts/contracts/NewsForum.sol/NewsForumContract.json');
const contractABI = NewsForumContract.abi;
const contractAddress = '0x5095d3313C76E8d29163e40a0223A5816a8037D8';
const newsForum = new ethers.Contract(contractAddress, contractABI, provider);

// const address = '0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f';
// const NewsForum = ethers.getContractFactory('NewsForumContract');
// const newsForum = NewsForum.attach(address);

newsForum.on('ArticleValidatedByUser', (articleId, validator) => {
  console.log(`Article Id -> ${articleId} and Validator -> ${validator}`);
});

newsForum.on('TryGivingPower', (articleId, author) => {
  console.log(`Article Id -> ${articleId} and Author -> ${author}`);
});

newsForum.on('ArticleUpvoted', (articleId, upvoter) => {
    console.log(`Article Id -> ${articleId} and Upvoter -> ${upvoter}`);
  });

newsForum.on('eligibleValidator', (userAd) => {
    console.log(`canbeValidator power given to -> ${userAd}`);
});

newsForum.on('RewardSummary', (receiver, receiverRewards, totalReward) => {
    console.log(`User -> ${receiver} has totalRewards -> {receiverRewards}, and totalRewards with forum are -> {totalReward}`);
});
  