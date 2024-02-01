import { useCallback } from 'react';
import BigNumber from "bignumber.js";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  FARM_FETCH_REWARDS_AVAILABLE_BEGIN,
  FARM_FETCH_REWARDS_AVAILABLE_SUCCESS,
  FARM_FETCH_REWARDS_AVAILABLE_FAILURE,
} from './constants';

export function fetchRewardsAvailable(index) {
  return (dispatch, getState) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: FARM_FETCH_REWARDS_AVAILABLE_BEGIN,
      index
    });
    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const { home, farm } = getState();
      const { address, web3 } = home;
      const { pools } = farm;
      const { earnContractAbi, earnContractAddress, masterchefPid } = pools[index];
      const contract = new web3.eth.Contract(earnContractAbi, earnContractAddress);
      contract.methods.pendingEleven(masterchefPid, address).call({ from: address }).then(
        data => {
          dispatch({
            type: FARM_FETCH_REWARDS_AVAILABLE_SUCCESS,
            data: new BigNumber(data).toNumber(),
            index
          });
          resolve(data);
        },
      ).catch(
        // Use rejectHandler as the second argument so that render errors won't be caught.
        error => {
          dispatch({
            type: FARM_FETCH_REWARDS_AVAILABLE_FAILURE,
            index
          });
          reject(error.message || error);
        }
      )
    });
    return promise;
  }
}


export function useFetchRewardsAvailable() {
  // args: false value or array
  // if array, means args passed to the action creator
  const dispatch = useDispatch();

  const { rewardsAvailable, fetchRewardsAvailablePending } = useSelector(
    state => ({
      rewardsAvailable: state.farm.rewardsAvailable,
      fetchRewardsAvailablePending: state.farm.fetchRewardsAvailablePending,
    })
  );

  const boundAction = useCallback(
    data => dispatch(fetchRewardsAvailable(data)),
    [dispatch],
  );

  return {
    rewardsAvailable,
    fetchRewardsAvailable: boundAction,
    fetchRewardsAvailablePending
  };
}

export function reducer(state, action) {
  const { rewardsAvailable, fetchRewardsAvailablePending } = state;
  switch (action.type) {
    case FARM_FETCH_REWARDS_AVAILABLE_BEGIN:
      // Just after a request is sent
      fetchRewardsAvailablePending[action.index] = true;
      return {
        ...state,
        fetchRewardsAvailablePending,
      };

    case FARM_FETCH_REWARDS_AVAILABLE_SUCCESS:
      // The request is success

      rewardsAvailable[action.index] = action.data;
      fetchRewardsAvailablePending[action.index] = false;
      return {
        ...state,
        rewardsAvailable,
        fetchRewardsAvailablePending,
      };

    case FARM_FETCH_REWARDS_AVAILABLE_FAILURE:
      // The request is failed
      fetchRewardsAvailablePending[action.index] = false;
      return {
        ...state,
        fetchRewardsAvailablePending,
      };

    default:
      return state;
  }
}
