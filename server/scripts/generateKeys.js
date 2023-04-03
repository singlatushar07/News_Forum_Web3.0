const { ethers } = require('ethers');

// Generate 5 private keys
for (let i = 0; i < 5; i++) {
  const privateKey = ethers.Wallet.createRandom().privateKey;
  console.log(`Private key ${i + 1}: ${privateKey}`);
}