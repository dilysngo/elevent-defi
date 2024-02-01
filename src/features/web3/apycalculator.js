import { erc20ABI } from "../configure";
import BigNumber from "bignumber.js";
import masterchefAbi from "./masterchefabi.json";

export const fetchBalance = async ({web3, address, pid, contractAddress, lpAddress }) => {
  // console.log(`=====================================fetchBalance begin=====================================`)
  /*if (!tokenAddress) {
    const ethBalance = await web3.eth.getBalance(address)
    return ethBalance;
  } TODO different APYs*/
  const cakelp = "0xa527a61703d82139f8a06bc30097cc9caa2df5a6";
  const contract = new web3.eth.Contract(masterchefABI, contractAddress);
  const wbnbContract = new web3.eth.Contract(erc20ABI, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");
  const cakeContract = new web3.eth.Contract(erc20ABI, "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82");

  const cakeInCakeLp = await cakeContract.methods.balanceOf(cakelp).call();
  const wbnbInCakeLp = await wbnbContract.methods.balanceOf(cakelp).call();
  const cakeperbnb = cakeInCakeLp/wbnbContract;
  // console.log(`
  //   address:${address}\n
  //   tokenAddress:${tokenAddress}\n
  // `)
  // 0xdAC17F958D2ee523a2206206994597C13D831ec7 地址为usdt
  const bonusMultiplier = await contract.methods.BONUS_MULTIPLIER().call();
  const totalAllocPoints = await contract.methods.totalAllocPoint().call();
  const pidAllocPoints = await contract.methods.poolInfo(pid).call()["allocPoint"];
  const cakePerBlock = 4e19;
  const cakesPerBlockPair = cakePerBlock *pidAllocPoints / totalAllocPoint * bonusMultiplier;
  const cakesPerBlockPairDay = cakesPerBlockPair * 28800;
  const bnbInPair = await wbnbContract.methods.balanceOf(lpAddress).call() * 2;
  if (bnbInPair == 0){
    return 0;
  }

  const cakeValueLocked = bnbInPair * cakeperbnb;

  const apy = ((1+(cakesPerBlockPairDay/cakeValueLocked))^365)/100;

  // console.log(balance)
  // console.log(`=====================================fetchBalance success=====================================`)
  return apy;
  //return new BigNumber(balance).toNumber();
}