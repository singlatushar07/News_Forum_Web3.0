const { ethers } = require('ethers');

const contractAddress = '0x123456789abcdef123456789abcdef123456789'; // replace with your contract address
const contractABI = [/* replace with your contract ABI */];

const provider = new ethers.providers.JsonRpcProvider(); // replace with your Ethereum node URL
const signer = provider.getSigner(); // replace with your Ethereum account private key

const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Call a function on the contract
const result = await contract.myFunction();

// Send a transaction to the contract
const tx = await contract.myFunction(param1, param2);
await tx.wait(); // wait for the transaction to be mined
