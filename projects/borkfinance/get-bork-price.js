const sdk = require("@defillama/sdk");
const borkLpAbi = require("./bork-lp-abi.json");
const ZBetLP = "0x5B3dec97cD5D84762788bBA29515eCb5342024dc";
const BORK_FINANCE = "0x052d5f0c3157719c44d9c3b8cce87584e0c985c4";

async function getBorkPrice() {
  const token0 = (
    await sdk.api.abi.call({
      abi: borkLpAbi.token0,
      chain: "dogechain",
      target: ZBetLP,
      params: [],
    })
  ).output;
  const reserves = (
    await sdk.api.abi.call({
      abi: borkLpAbi.getReserves,
      chain: "dogechain",
      target: ZBetLP,
      params: [],
    })
  ).output;

  const totalReserve = [Number(reserves[0]), Number(reserves[1])];

  let stablecoinreserve;
  let tokenReserve;
  if (BORK_FINANCE.toLowerCase() === token0.toLowerCase()) {
    stablecoinreserve = totalReserve[1] / 1e6;
    tokenReserve = totalReserve[0] / 1e18;
  } else {
    stablecoinreserve = totalReserve[0] / 1e6;
    tokenReserve = totalReserve[1] / 1e18;
  }
  let lpTokenPrice = stablecoinreserve / tokenReserve;

  return lpTokenPrice || 0;
}

module.exports = getBorkPrice;
