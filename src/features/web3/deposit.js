import { earnContractABI, e11Abi, erc20ABI } from "../configure";
import { enqueueSnackbar } from '../common/redux/actions';


export const deposit = async ({web3, address, isAll, amount, contractAddress, dispatch}) => {
  // console.log(`=====================================deposit begin=====================================`)
  console.log(`
    address:${address}\n
    contractAddress:${contractAddress}\n
    amount:${amount}
  `)
  const contract = contractAddress == "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991"? new web3.eth.Contract(e11Abi, contractAddress) : new web3.eth.Contract(earnContractABI, contractAddress);
  const elevenContract = new web3.eth.Contract(erc20ABI, "0xAcD7B3D9c10e97d0efA418903C0c7669E702E4C0");
  const elevenBalance = await elevenContract.methods.balanceOf(address).call();
  const data = await _deposit({web3, contract,isAll, amount,  address, dispatch, contractAddress, elevenContract, elevenBalance});
  // console.log(`=====================================deposit success=====================================`)
  return data;
}

const _deposit = ({web3, contract, amount, isAll, address, dispatch, contractAddress, elevenContract, elevenBalance}) => {
  return new Promise((resolve, reject) => {
    // console.log(isAll)
    if(isAll && contractAddress != "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991") {
      contract.methods.depositAll().send({ from: address }).on('transactionHash', function(hash){
        console.log(hash)
        dispatch(enqueueSnackbar({
          message: hash,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success'
          },
          hash
        }));
      })
      .on('receipt', function(receipt){
        console.log(receipt);
        resolve()
      })
      .on('error', function(error) {
        console.log(error)
        reject(error)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    }

    if(isAll && contractAddress == "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991") {
      contract.methods.stake(elevenBalance).send({ from: address }).on('transactionHash', function(hash){
        console.log(hash)
        dispatch(enqueueSnackbar({
          message: hash,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success'
          },
          hash
        }));
      })
      .on('receipt', function(receipt){
        console.log(receipt);
        resolve()
      })
      .on('error', function(error) {
        console.log(error)
        reject(error)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    }


    if (!isAll && contractAddress != "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991") {
      contract.methods.deposit(amount).send({ from: address }).on('transactionHash', function(hash){
        console.log(hash)
        dispatch(enqueueSnackbar({
          message: hash,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success'
          },
          hash
        }));
      })
      .on('receipt', function(receipt){
        console.log(receipt);
        resolve()
      })
      .on('error', function(error) {
        console.log(error)
        reject(error)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    }



    if (!isAll && contractAddress == "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991") {
      if(isNaN(amount)){
          alert("Too big amount for javascript to understand it. Deposit less than 1M each time or use depositall function");
      }
      else{
      contract.methods.stake(amount).send({ from: address }).on('transactionHash', function(hash){
        console.log(hash)
        dispatch(enqueueSnackbar({
          message: hash,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success'
          },
          hash
        }));
      })
      .on('receipt', function(receipt){
        console.log(receipt);
        resolve()
      })
      .on('error', function(error) {
        console.log(error)
        reject(error)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    }}



  })
}
