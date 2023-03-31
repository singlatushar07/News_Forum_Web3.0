const hre = require("hardhat");
async function main() {
    const chai = await hre.ethers.getContractFactory("NewsForum");
    const contract = await chai.deploy(); //instance of contract
    await contract.deployed();
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });