// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = hre.ethers.utils.parseEther("1");

  // const Lock = await hre.ethers.getContractFactory("NewsForumContract");
  // const lock = await Lock.deploy();

  // await lock.deployed();

  // console.log(
  //   `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  // );
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
  // console.log(localStorage.getItem("privateKey"));
  // const private_key = localStorage.getItem("privateKey")
  // const wallet = new ethers.Wallet(private_key,provider);
  // const provider = new ethers.providers.JsonRpcProvider();
  const privateKey = 'df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e';
  const wallet = new ethers.Wallet(privateKey, provider);

  const contractFactory = await hre.ethers.getContractFactory("NewsForumContract");
  const contract = await contractFactory.connect(wallet).deploy();
  console.log(wallet.address)
  await contract.deployed();
  console.log("Contract deployed to: ", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
