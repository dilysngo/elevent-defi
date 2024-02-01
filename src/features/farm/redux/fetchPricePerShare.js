import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import { byDecimals } from '../../helpers/bignumber';

import { e11Abi, vaultERC20 } from '../../configure';

import {
  FARM_FETCH_PRICE_PER_SHARE_BEGIN,
  FARM_FETCH_PRICE_PER_SHARE_SUCCESS,
  FARM_FETCH_PRICE_PER_SHARE_FAILURE,
} from './constants';

export function fetchPricePerShare(index) {

	return (dispatch, getState) => {
		dispatch({
			type: FARM_FETCH_PRICE_PER_SHARE_BEGIN,
			index
		});

		const promise = new Promise((resolve, reject) => {
			const { home, farm } = getState();
      const { web3 } = home;
      const { pools } = farm;
      const { name, token, tokenAddress } = pools[index];

      if (name == 'ELE-BNB LP') {
        const data = new BigNumber(1e18);

        dispatch({
          type: FARM_FETCH_PRICE_PER_SHARE_SUCCESS,
          data: data,
          index
        });
        resolve(1);
        return;
      }

      let promise;

      if (token == 'E11') {
        const contract = new web3.eth.Contract(e11Abi, tokenAddress);
			  promise = contract.methods.sharesPerToken().call()
          .then(data => {
            return new BigNumber(1e12).div(BigNumber(data)).times(1e18);
          })
      } else {
        const contract = new web3.eth.Contract(vaultERC20, tokenAddress);
			  promise = contract.methods.getPricePerFullShare().call()
      }

      promise.then(
        data => {
          dispatch({
            type: FARM_FETCH_PRICE_PER_SHARE_SUCCESS,
            data: new BigNumber(data),
            index
          });
          resolve(data);
        },
      ).catch(
        error => {
          dispatch({
            type: FARM_FETCH_PRICE_PER_SHARE_FAILURE,
            index
          });
          reject(error.message || error);
        }
      )
		});

		return promise;
	}

}

export function useFetchPricePerShare() {
  const dispatch = useDispatch();

  const { pricePerShare, fetchPricePerSharePending } = useSelector(
    state => ({
      pricePerShare: state.farm.pricePerShare,
      fetchPricePerSharePending: state.farm.fetchPricePerSharePending,
    })
  );

  const boundAction = useCallback(
    data => dispatch(fetchPricePerShare(data)),
    [dispatch],
  );

  return {
    pricePerShare,
    fetchPricePerShare: boundAction,
    fetchPricePerSharePending
  };
}

export function reducer(state, action) {
  const { pricePerShare, fetchPricePerSharePending } = state;
  switch (action.type) {
    case FARM_FETCH_PRICE_PER_SHARE_BEGIN:
      // Just after a request is sent
      fetchPricePerSharePending[action.index] = true;
      return {
        ...state,
        fetchPricePerSharePending,
      };

    case FARM_FETCH_PRICE_PER_SHARE_SUCCESS:
      // The request is success

      pricePerShare[action.index] = action.data;
      fetchPricePerSharePending[action.index] = false;

      return {
        ...state,
        pricePerShare,
        fetchPricePerSharePending,
      };

    case FARM_FETCH_PRICE_PER_SHARE_FAILURE:
      // The request is failed
      fetchPricePerSharePending[action.index] = false;
      return {
        ...state,
        fetchPricePerSharePending,
      };

    default:
      return state;
  }
}