const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { string } = require("hardhat/internal/core/params/argumentTypes");

// const provider = new ethers.providers.JsonRpcProvider();
const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
console.log(owner.address, addr1.address);