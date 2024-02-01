import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import async from 'async';

import { fetchBalance, fetchFarmStaked } from '../../web3';

import {
  FARM_FETCH_POOLS_BALANCES_BEGIN,
  FARM_FETCH_POOLS_BALANCES_SUCCESS,
  FARM_FETCH_POOLS_BALANCES_FAILURE
} from './constants';
import { byDecimals } from 'features/helpers/bignumber';

export function fetchPoolsBalances({ address, web3, pools }) {
  return dispatch => {
    dispatch({
      type: FARM_FETCH_POOLS_BALANCES_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      async.map(pools, (pool, callback) => {
        const { tokenAddress, tokenDecimals } = pool;

        async.parallel([
          // Get token balance
          (callbackInner) => {
            fetchBalance({
              web3,
              address,
              tokenAddress
            }).then(
              data => callbackInner(null, data)
            ).catch(
              error => {
                return callbackInner(error.message || error)
              }
            )
          },

          // Get staked amount
          (callbackInner) => {
            const { earnContractAbi, earnContractAddress, masterchefPid } = pool;
            fetchFarmStaked({
              web3,
              address,
              earnContractAddress,
              earnContractAbi,
              masterchefPid
            }).then(
              data => callbackInner(null, data)
            ).catch(
              error => {
                return callbackInner(error.message || error)
              }
            )
          }
        ], (error, data) => {
          pool.userTokenBalance = data[0] ? byDecimals(data[0], tokenDecimals) : null;
          pool.stakedAmount = data[1] ? byDecimals(data[1], tokenDecimals) : null;
          callback(null, pool)
        })
      }, (error, pools) => {
        if (error) {
          dispatch({
            type: FARM_FETCH_POOLS_BALANCES_FAILURE,
          })
          return reject(error.message || error)
        }

        dispatch({
          type: FARM_FETCH_POOLS_BALANCES_SUCCESS,
          data: pools,
        })
        resolve()
      });
    });

    return promise;
  };
}

export function useFetchPoolsBalances() {
  const dispatch = useDispatch();

  const { pools, fetchPoolsBalancesPending, fetchPoolsBalancesDone } = useSelector(
    state => ({
      pools: state.farm.pools,
      fetchPoolsBalancesDone: state.farm.fetchPoolsBalancesDone,
      fetchPoolsBalancesPending: state.farm.fetchPoolsBalancesPending,
    }),
    shallowEqual
  );

  const boundAction = useCallback(
    (data) => {
      return dispatch(fetchPoolsBalances(data));
    },
    [dispatch],
  );

  return {
    pools,
    fetchPoolsBalances: boundAction,
    fetchPoolsBalancesDone,
    fetchPoolsBalancesPending,
  };
}

export function reducer(state, action) {
	switch (action.type) {
		case FARM_FETCH_POOLS_BALANCES_BEGIN:
			return {
				...state,
				fetchPoolsBalancesPending: true,
			};

		case FARM_FETCH_POOLS_BALANCES_SUCCESS:
			return {
				...state,
				pools: action.data,
				fetchPoolsBalancesDone: true,
				fetchPoolsBalancesPending: false,
			};

		case FARM_FETCH_POOLS_BALANCES_FAILURE:
			return {
				...state,
				fetchPoolsBalancesPending: false,
			};

		default:
			return state;
	}
}
