import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  FARM_FETCH_POOLS_STATS_BEGIN,
  FARM_FETCH_POOLS_STATS_SUCCESS,
  FARM_FETCH_POOLS_STATS_FAILURE,
} from './constants';

export function fetchPoolsStats() {
  return (dispatch, getState) => {
    dispatch({ type: FARM_FETCH_POOLS_STATS_BEGIN });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get('https://eleven.finance/api.json');

      doRequest.then(
        res => {
          dispatch({
            type: FARM_FETCH_POOLS_STATS_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        err => {
          dispatch({ type: FARM_FETCH_POOLS_STATS_FAILURE });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function useFetchPoolsStats() {
  // args: false value or array
  // if array, means args passed to the action creator
  const dispatch = useDispatch();

  const { pools, poolsStats, fetchPoolsStatsPending } = useSelector(
    state => ({
      pools: state.farm.pools,
      poolsStats: state.farm.poolsStats,
      fetchPoolsStatsPending: state.farm.fetchPoolsStatsPending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => dispatch(fetchPoolsStats()), [dispatch]);

  return {
    fetchPoolsStats: boundAction,
    pools,
    poolsStats,
    fetchPoolsStatsPending
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case FARM_FETCH_POOLS_STATS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchPoolsStatsPending: true
      };

    case FARM_FETCH_POOLS_STATS_SUCCESS:
      // The request is success
      return {
        ...state,
        poolsStats: action.data,
        fetchPoolsStatsPending: false
      };

    case FARM_FETCH_POOLS_STATS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchPoolsStatsPending: false
      };

    default:
      return state;
  }
}
