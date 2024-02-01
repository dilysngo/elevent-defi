import { earnContractABI, e11Abi } from "../configure";
import { enqueueSnackbar } from '../common/redux/actions';


export const withdraw = async ({web3, address,isAll, amount, contractAddress, dispatch}) => {
  // console.log(`=====================================withdraw begin=====================================`)
  // console.log(amount)
  const contract = contractAddress == "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991"? new web3.eth.Contract(e11Abi, contractAddress) : new web3.eth.Contract(earnContractABI, contractAddress);
  // console.log(`
  //   address:${address}\n
  //   contractAddress:${contractAddress}\n
  //   amount:${web3.utils.toWei(amount, "ether")}
  // `)
  const elevenVaultContract = new web3.eth.Contract(e11Abi, "0x3ed531bfb3fad41111f6dab567b33c4db897f991");
  const elevenVaultBalance = await elevenVaultContract.methods.balanceOf(address).call();
  // console.log(`=====================================withdraw=====================================`)
  const data = await _withdraw({web3, contract, isAll, amount, address, dispatch, contractAddress, elevenVaultBalance});
  // console.log(`=====================================withdraw success=====================================`)
  return data;
}

const _withdraw = ({web3, contract, address,isAll, amount, dispatch, contractAddress, elevenVaultBalance}) => {
  return new Promise((resolve, reject) => {
    // console.log(isAll)
    if (isAll && contractAddress != "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991") {
      contract.methods.withdrawAll().send({ from: address }).on('transactionHash', function(hash){
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


    if (isAll && contractAddress == "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991") {
      contract.methods.unstake(elevenVaultBalance).send({ from: address }).on('transactionHash', function(hash){
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



    if(!isAll && contractAddress != "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991") {
      contract.methods.withdraw(amount).send({ from: address }).on('transactionHash', function(hash){
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
    
    if(!isAll && contractAddress == "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991") {
      if(isNaN(amount)){
          alert("Too big amount for javascript to understand it. Deposit less than 1M each time or use depositall function");
      }
      contract.methods.unstake(amount).send({ from: address }).on('transactionHash', function(hash){
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
    


  })
}
