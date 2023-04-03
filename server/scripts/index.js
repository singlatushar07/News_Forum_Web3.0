const {ethers} = require("hardhat");

async function getAllArticles(newsForum){
    let allArticles = await newsForum.getAllArticles();
    // Ignoring first invalid article
    //allArticles = allArticles.slice(1);

    for (let i in allArticles) {
        console.log(allArticles[i].title);
        console.log(allArticles[i].content);
        console.log(allArticles[i].author);
        console.log(allArticles[i].id);
    }
}

async function getAllUsers(newsForum){
  let allUsers = await newsForum.getAllUsers();
  // Ignoring first invalid article
  //allArticles = allArticles.slice(1);

  for (let i in allUsers) {
      console.log(allUsers[i].name);
      console.log(allUsers[i].userAddress);
      console.log(allUsers[i].canBeValidator);
      console.log(allUsers[i].rewardCount);
      console.log(allUsers[i].articleValidatedCount);
  }
}

async function main () {
    //this connects to the localhost directly
    const provider = new ethers.providers.JsonRpcProvider();

    const accounts = await ethers.provider.listAccounts();
    //console.log(accounts);

    const privateKey = '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e';
    const walletOwner = new ethers.Wallet(privateKey, provider);
    const privateKey1 = "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0";
    const wallet1 = new ethers.Wallet(privateKey1, provider);
    const privateKey2 = "0xd2cfd99246aa9aee0341281016c1fe0ddbe56b482bd1f02718dd0dc7b1aa9372";
    const wallet2 = new ethers.Wallet(privateKey2, provider);

    const address = '0x5095d3313C76E8d29163e40a0223A5816a8037D8';
    const NewsForum = await ethers.getContractFactory('NewsForumContract');
    const newsForum = await NewsForum.attach(address);
    const contractWithSigner = await newsForum.connect(walletOwner);

    //await getAllArticles(newsForum);
    //await getAllUsers(newsForum);
    
    // const userCount = await contractWithSigner.getUserCount();
    // console.log(userCount);
    // const user = await contractWithSigner.articles();
    // console.log(user);
    //await contractWithSigner.validateArticle(2);
    await newsForum.connect(wallet1).upvoteArticle(2);
    await newsForum.connect(wallet2).upvoteArticle(1);
    //await contractWithSigner.validateArticle(2);
    // const tx = await contractWithSigner.validateArticle(1);
    // await tx.wait();
    // console.log(tx.events);
  };
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });