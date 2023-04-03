require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
//   optimizer: {
//     enabled: true,
//     runs: 1
//   },
//   networks: {
//     hardhat: {
//       accounts: [
//         {
//           privateKey: "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
//           balance: "100000000000000000000000" // 100000 ETH
//         },
//         {
//           privateKey: "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
//           balance: "100000000000000000000000" // 500000 ETH
//         },
//         {
//           privateKey: "0xd2cfd99246aa9aee0341281016c1fe0ddbe56b482bd1f02718dd0dc7b1aa9372",
//           balance: "100000000000000000000000" // 100000 ETH
//         },
//         {
//           privateKey: "0x83505e586e88189a48e49f06e8c2733c3e19761df9a6252cddc5922cd4402bda",
//           balance: "100000000000000000000000" // 100000 ETH
//         },
//         {
//           privateKey: "0x3a2ddc35ce5fbb1acbd67237e55bba87ae38b69dc1d2726d6a27547fcbd26e59",
//           balance: "100000000000000000000000" // 100000 ETH
//         },
//         {
//           privateKey: "0xc681db4c157493fc8ff74d5529051f9b1552f15e6da5f5a96a6cd2e3ee2e8ac4",
//           balance: "100000000000000000000000" // 100000 ETH
//         }
//       ]
//     }
//   }
// };

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  networks: {
        hardhat: {
          accounts: [
            {
              privateKey: "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
              balance: "100000000000000000000000" // 100000 ETH
            },
            {
              privateKey: "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
              balance: "100000000000000000000000" // 500000 ETH
            },
            {
              privateKey: "0xd2cfd99246aa9aee0341281016c1fe0ddbe56b482bd1f02718dd0dc7b1aa9372",
              balance: "100000000000000000000000" // 100000 ETH
            },
            {
              privateKey: "0x83505e586e88189a48e49f06e8c2733c3e19761df9a6252cddc5922cd4402bda",
              balance: "100000000000000000000000" // 100000 ETH
            },
            {
              privateKey: "0x3a2ddc35ce5fbb1acbd67237e55bba87ae38b69dc1d2726d6a27547fcbd26e59",
              balance: "100000000000000000000000" // 100000 ETH
            },
            {
              privateKey: "0xc681db4c157493fc8ff74d5529051f9b1552f15e6da5f5a96a6cd2e3ee2e8ac4",
              balance: "100000000000000000000000" // 100000 ETH
            }
          ]
        }
      }
};
