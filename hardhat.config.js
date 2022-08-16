require("@nomicfoundation/hardhat-toolbox");

const INFURA_PROJECT_ID = "09cd5b54200546ccae835b236290b5ff";

const ADDRESS_PRIVATE_KEY =
  "4c4218a031b50ba48a84f532062c75c0e80ce35b0d8093b978ee208b6d0b6c01";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${ADDRESS_PRIVATE_KEY}`],
    },
  },
};
