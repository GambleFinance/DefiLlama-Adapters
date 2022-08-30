const sdk = require("@defillama/sdk");
const abi = require("./abi.json");
const calculateLpTokenPrice = require("./calculate-lp-token-price");
const getBorkPrice = require("./get-bork-price");
const getTokenPrice = require("./get-token-price");

const MASTERCHEF = "0xCca76dE974bE2FfC4B3C006B72D56C5Acb86cE0c";

async function tvl() {
  let amount = 0;

  const length = (
    await sdk.api.abi.call({
      abi: abi.poolLength,
      chain: "dogechain",
      target: MASTERCHEF,
      params: [],
    })
  ).output;

  const borkPrice = await getBorkPrice();

  for (let i = 0; i < length; i++) {
    const poolInfo = (
      await sdk.api.abi.call({
        abi: abi.poolInfo,
        chain: "dogechain",
        target: MASTERCHEF,
        params: [i],
      })
    ).output;

    const token = (
      await sdk.api.abi.call({
        abi: "erc20:symbol",
        chain: "dogechain",
        target: poolInfo.lpToken,
        params: [],
      })
    ).output;

    const balance = (
      await sdk.api.abi.call({
        abi: abi.lpTokenAmount,
        chain: "dogechain",
        target: MASTERCHEF,
        params: [i],
      })
    ).output;

    let price = 0;

    if (token === "BORK") {
      price = borkPrice;
    } else if (token === "Bork-LP") {
      price = await calculateLpTokenPrice(poolInfo.lpToken, borkPrice);
    } else {
      price = await getTokenPrice(token);
    }

    amount += (balance / 1e18) * price;
  }

  return amount;
}

module.exports = {
  fetch: tvl,
};
