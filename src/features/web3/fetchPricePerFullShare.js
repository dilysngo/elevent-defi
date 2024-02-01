import { byDecimals } from 'features/helpers/bignumber';

export const fetchPricePerFullShare = async ({address, contract, earnAddress}) => {
  // console.log(`=====================================fetchDepositedBalance begin=====================================`)
  // console.log(`
  //   address:${address}\n
  //   contractAddress:${contractAddress}\n
  // `)
  const pricePerFullShare = earnAddress != "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991" ? await contract.methods.getPricePerFullShare().call({ from: address }) :  await contract.methods.tokensPerShare().call({ from: address }) * 1e6;

  // console.log(`=====================================fetchDepositedBalance success=====================================`)

  return byDecimals(pricePerFullShare, 18).toNumber();
}
