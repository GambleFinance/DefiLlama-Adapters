const abi = require("./abi.json");
const { addFundsInMasterChef } = require("../helper/masterchef");
const { transformBscAddress } = require("../helper/portedTokens");
const { getUniTVL,masterchefExports } = require('../helper/unknownTokens')

const coreAssets = ['0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101,0x765277EebeCA2e31912C9946eAe1021199B39C61,0x052d5f0c3157719c44d9c3b8cce87584e0c985c4']
const chain = 'dogechain'
const masterChef ='0xCca76dE974bE2FfC4B3C006B72D56C5Acb86cE0c'
const borkToken ='0x052d5f0c3157719c44d9c3b8cce87584e0c985c4'

async function bscTvl(timestamp, block, chainBlocks) {
  let balances = {};
  const transformAddress = await transformBscAddress();

  await addFundsInMasterChef(
    balances,
    masterChef,
    chainBlocks["dogechain"],
    "dogechain",
    transformAddress,
    abi.poolInfo,
  );
  return balances;
}

module.exports = {
  misrepresentedTokens: true,
  timetravel: true,
  methodology: 'TVL accounts for the liquidity on all AMM pools, using the TVL chart on https://mm.finance as the source. Staking accounts for the MMF locked in MasterChef (0x6bE34986Fdd1A91e4634eb6b9F8017439b7b5EDc)',
  dogechain: {
    staking: bscTvl,
    tvl: getUniTVL({
      chain,
      useDefaultCoreAssets: true,
      factory: '0x51e1043E6942bc3Ad1EA910749fb5029E05DbEdE',
    }),
  }
}