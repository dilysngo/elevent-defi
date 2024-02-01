import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import BigNumber from 'bignumber.js'
import { byDecimals, formatDecimals } from 'features/helpers/bignumber';
import {makeStyles} from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import farmPoolStyle from "../jss/sections/farmPoolsStyle";
import Button from "../../../components/CustomButtons/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import TextButton from '@material-ui/core/Button';

import {useConnectWallet} from '../../home/redux/hooks';
import {
  useCheckApproval,
  useFetchPoolsInfo,
  useFetchBalance,
  useFetchCurrentlyStaked,
  useFetchRewardsAvailable,
  useFetchApproval,
  useFetchStake,
  useFetchWithdraw,
  useFetchClaim,
  useFetchExit,
  useFetchPricePerShare,
  useFetchPoolsStats
} from '../redux/hooks';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Input} from "@material-ui/core";

const useStyles = makeStyles(farmPoolStyle);

export default function FarmPool(props) {
  const classes = useStyles();
  const {t, i18n} = useTranslation();
  const { web3, address, networkId } = useConnectWallet();
  const {allowance, checkApproval} = useCheckApproval();
  const {pools} = useFetchPoolsInfo();
  const {balance, fetchBalance} = useFetchBalance();
  const {currentlyStaked, fetchCurrentlyStaked} = useFetchCurrentlyStaked();
  const {rewardsAvailable, fetchRewardsAvailable} = useFetchRewardsAvailable();
  const {fetchApproval, fetchApprovalPending} = useFetchApproval();
  const {fetchStake, fetchStakePending} = useFetchStake();
  const {fetchWithdraw, fetchWithdrawPending} = useFetchWithdraw();
  const {fetchClaim, fetchClaimPending} = useFetchClaim();
  const {fetchExit, fetchExitPending} = useFetchExit();
  const {pricePerShare, fetchPricePerShare} = useFetchPricePerShare();
  const {poolsStats, fetchPoolsStats} = useFetchPoolsStats();

  const [index, setIndex] = useState(Number(props.match.params.index) - 1);
  const [showInput, setShowInput] = useState(false);
  const [isStake, setIsStake] = useState(true);
  // const [ pageSize,setPageSize ] = useState('');
  const [isNeedApproval, setIsNeedApproval] = useState(true);
  const [approvalAble, setApprovalAble] = useState(false);
  const [stakeAble, setStakeAble] = useState(true);
  const [withdrawAble, setWithdrawAble] = useState(true);
  const [claimAble, setClaimAble] = useState(true);
  const [exitAble, setExitAble] = useState(true);
  const [myBalance, setMyBalance] = useState(new BigNumber(balance[index]));
  const [myCurrentlyStaked, setMyCurrentlyStaked] = useState(new BigNumber(currentlyStaked[index]));
  const [myRewardsAvailable, setMyRewardsAvailable] = useState(new BigNumber(rewardsAvailable[index]));
  const [myHalfTime, setMyHalfTime] = useState(`0day 00:00:00`);
  const [inputVal, setInputVal] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [lpValue, setLpValue] = useState(null);
  const [lpPriceUsd, setLpPriceUsd] = useState(null);
  const [lpValueUsd, setLpValueUsd] = useState(null);

  // 弹窗
  const [dialogShow, setDialogShow] = useState(false);
  // 存入、解除质押 弹窗类型
  const [dialogType, setDialogType] = useState(1);

  useEffect(() => {
    setIndex(Number(props.match.params.index) - 1);
  }, [Number(props.match.params.index)]);

  useEffect(() => {
    setIsNeedApproval(Boolean(allowance[index] === 0));
    // setIsNeedApproval(false);
  }, [allowance[index], index]);

  useEffect(() => {
    setApprovalAble(!Boolean(fetchApprovalPending[index]));
  }, [fetchApprovalPending[index], index]);

  const onApproval = () => {
    fetchApproval(index);
  }

  useEffect(() => {
    setStakeAble(!Boolean(fetchStakePending[index]));
  }, [fetchStakePending[index], index]);

  const onDepositButton = () => {
    setDialogType(1);
    setDialogShow(true);
  }

  const onWithdrawalButton = () => {
    setDialogType(2);
    setDialogShow(true);
  }

  const onStake = () => {
    const amount = new BigNumber(inputVal).multipliedBy(new BigNumber(10).exponentiatedBy(pools[index].tokenDecimals)).toString(10);
    fetchStake(index, amount);
  }

  useEffect(() => {
    const isPending = Boolean(fetchWithdrawPending[index]);
    const currentlyStakedIs0 = currentlyStaked[index] === 0;
    setWithdrawAble(!Boolean(isPending || currentlyStakedIs0));
    // setWithdrawAble(true)
  }, [currentlyStaked[index], fetchWithdrawPending[index], index]);

  const onWithdraw = () => {
    const amount = new BigNumber(inputVal).multipliedBy(new BigNumber(10).exponentiatedBy(pools[index].tokenDecimals)).toString(10);
    fetchWithdraw(index, amount);
  }

  useEffect(() => {
    const isPending = Boolean(fetchClaimPending[index]);
    const rewardsAvailableIs0 = rewardsAvailable[index] === 0;
    setClaimAble(!Boolean(isPending || rewardsAvailableIs0));
  }, [rewardsAvailable[index], fetchClaimPending[index], index]);

  const onClaim = () => {
    fetchClaim(index);
  }

  const closeDialog = () => {
    setDialogShow(false);
    setInputVal('');
  }

  useEffect(() => {
    const isPending = Boolean(fetchExitPending[index]);
    const currentlyStakedIs0 = currentlyStaked[index] === 0;
    const rewardsAvailableIs0 = rewardsAvailable[index] === 0;
    const currentlyStakedAndRewardsAvailableIs0 = Boolean(currentlyStakedIs0 && rewardsAvailableIs0);
    setExitAble(!Boolean(isPending || currentlyStakedAndRewardsAvailableIs0));
  }, [currentlyStaked[index], rewardsAvailable[index], fetchExitPending[index], index, new Date()]);

  const onExit = () => {
    fetchExit(index);
  }

  useEffect(() => {
    const amount = byDecimals(balance[index], pools[index].tokenDecimals);
    setMyBalance(amount);
  }, [balance[index], index]);

  useEffect(() => {
    const amount = byDecimals(currentlyStaked[index], pools[index].tokenDecimals);
    setMyCurrentlyStaked(amount);
  }, [currentlyStaked[index], index]);

  useEffect(() => {
    const amount = byDecimals(rewardsAvailable[index], pools[index].earnedTokenDecimals);
    setMyRewardsAvailable(amount);
  }, [rewardsAvailable[index], index]);

  useEffect(() => {
    const price = byDecimals(pricePerShare[index], pools[index].tokenDecimals);
    if (price.eq(0)) {
      return;
    }

    const balanceAmount = byDecimals(balance[index], pools[index].tokenDecimals);
    const stakedAmount = byDecimals(currentlyStaked[index], pools[index].tokenDecimals);

    const lpValue = price.times(balanceAmount.plus(stakedAmount));
    setLpValue(lpValue);
  }, [pricePerShare[index], currentlyStaked[index], balance[index], index]);

  useEffect(() => {
    if (poolsStats && name && poolsStats[name]) {
      const poolStats = poolsStats[name];
      if (poolStats.price) {
        setLpPriceUsd(new BigNumber(poolStats.price));
      }
    }
  }, [poolsStats]);

  useEffect(() => {
    if (lpValue && lpPriceUsd) {
      setLpValueUsd(lpPriceUsd.times(lpValue));
    }
  }, [lpValue, lpPriceUsd]);

  useEffect(() => {
    if (address) {
      checkApproval(index);
      fetchBalance(index);
      fetchCurrentlyStaked(index);
      fetchRewardsAvailable(index);
      fetchPricePerShare(index);
      fetchPoolsStats(index);

      const id = setInterval(() => {
        checkApproval(index);
        fetchBalance(index);
        fetchCurrentlyStaked(index);
        fetchRewardsAvailable(index);
        fetchPricePerShare(index);
      }, 3000);
      return () => clearInterval(id);
    }
  }, [address, index]);


  useEffect(() => {
    setIsStake(dialogType === 1)
  }, [dialogType])

  const {name, token, startTimestamp, earnTime, earnedToken, earnedTokenUrl, tokenDescription} = pools[index];
  const isLP = name.toLowerCase().indexOf('lp') > -1;
  const lpTokens = isLP ? token.split('/') : [];
  const offsetImageStyle = {marginLeft: "-25%", zIndex: 0, background: '#ffffff'};
  const [timeEnd, setTimeEnd] = useState(startTimestamp + earnTime - parseInt(String((new Date()).getTime() / 1000)));
  // 是否挖矿结束
  const canStake = timeEnd > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeEnd > 0) {
        setTimeEnd((timeEnd) => timeEnd - 1);
      } else {
        clearTimeout(timer);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    }
  }, [timeEnd]);


  const changeInputVal = (event) => {
    let value = event.target.value;
    const changeIsNumber = /^[0-9]+\.?[0-9]*$/;
    if (!value) return setInputVal(value);
    if (changeIsNumber.test(value)) {
      value = value.replace(/(^[0-9]+)(\.?[0-9]*$)/, (word, p1, p2) => {
        return Number(p1).toString() + p2;
      });
      if (new BigNumber(Number(value)).comparedTo(isStake ? myBalance : myCurrentlyStaked) === 1) return setInputVal((isStake ? myBalance.toString() : myCurrentlyStaked.toString()));
      setInputVal(value)
    }
  }

  const dateCount = (time) => {
    const day = Math.floor(time / (60 * 60 * 24)).toString().padStart(2, '0');
    const hours = Math.floor((time / (60 * 60)) % 24).toString().padStart(2, '0');
    const minutes = Math.floor((time / 60) % 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return day + t('Public-Day') + hours + t('Public-Hour') + +minutes + t('Public-Minute') + seconds + t('Public-Seconds');
  }

  return (
    <Grid container>
      <Grid item container xs={12} className={classes.farmWrapper}>
        {/* Farm Details */}
        <Grid item container xs={12} md={8} className={classes.farmDetails}>
          <Grid item container xs={12} className={classes.farmTitleBlock}>
            <img className={classes.farmLogo} src={require(`../../../images/${name}-logo.svg`)}/>
            <div>
              <div className={classes.farmTitle}>
                {`Farm / ${pools[index].tokenDescription}`}
              </div>
              <div className={classes.farmLpValue}>
                Total Value:&nbsp;
                {
                  name && lpValue
                  ? <span>
                      {formatDecimals(lpValue)}&nbsp;
                      <span className={classes.farmLpValueToken}>{name}</span>

                      {
                        lpValueUsd
                        ? <span className={classes.farmLpValueUsd}>
                            &nbsp;(${lpValueUsd.toFixed(2)})
                          </span>
                        : ''
                      }
                    </span>
                  : <CircularProgress
                      className={classes.farmLpValueLoader}
                      size={20}
                      thickness={6} />
                }
              </div>
            </div>
          </Grid>
          <Grid item container justify="space-around" xs={12} className={classes.farmControls}>

            {/* Wallet Balance */}
            <Grid item xs={12} sm={6} lg={4}>
              <div className={classes.farmBalance}>{formatDecimals(myBalance)}</div>
              <div className={classes.farmBalanceDescription}>{t('Farm-Balance')} {tokenDescription}</div>

              {
                ! isNeedApproval
                ? <Button className={classes.buttonPrimary}
                          disabled={ ! canStake}
                          onClick={onDepositButton}>
                    {t('Farm-Stake')} {tokenDescription}
                  </Button>
                : <Button className={classes.buttonPrimary}
                          disabled={ ! Boolean(approvalAble)}
                          onClick={onApproval}>
                    {t('Farm-Approval')} {tokenDescription}
                  </Button>
              }
            </Grid>

            {/* Deposited Balance */}
            <Grid item xs={12} sm={6} lg={4}>
              <div className={classes.farmBalance}>{formatDecimals(myCurrentlyStaked)}</div>
              <div className={classes.farmBalanceDescription}>{t('Farm-Deposited')} {tokenDescription}</div>

              <Button className={classes.buttonPrimary}
                      disabled={!Boolean(withdrawAble)}
                      onClick={onWithdrawalButton}>
                {t('Farm-Withdraw')} {tokenDescription}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Farm Earnings */}
        <Grid item xs={12} md={4} className={classes.farmEarnings}>
          <div className={classes.farmEarnedLogo}>
            <img src={require(`../../../images/${earnedToken}-logo.png`)}/>
          </div>

          <div className={classes.farmBalance}>{formatDecimals(myRewardsAvailable)}</div>
          <div className={classes.farmBalanceDescription}>{t('Farm-Earned')} {earnedToken}</div>

          <Button className={classes.buttonPrimary}
                  onClick={onClaim}
          >
            {t('Farm-Reward')}
          </Button>
        </Grid>
      </Grid>

      {/* Deposit / Withdrawal Popup */}
      <Dialog fullWidth={true}
              disableBackdropClick={true}
              open={dialogShow}
              onClose={closeDialog}
              classes={{
                paper: classes.dialogRoot
              }}
              aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {t(isStake ? 'Farm-Stake' : 'Farm-UnApproval')} {tokenDescription} Tokens
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{fontSize: 15, color: "#ffffff"}}>
            {
              t(isStake ? 'Farm-Available-Balance' : 'Farm-Pledged') + "：" + (isStake ? myBalance.toString() : myCurrentlyStaked.toString())
            }
            <a className={classes.dialogHref}
               onClick={() => {
                 setInputVal(isStake ? myBalance.toString() : myCurrentlyStaked.toString());
               }}>
              {t(isStake ? 'Farm-All-Stake' : 'Farm-All-UnApproval')}
            </a>
          </DialogContentText>
          <Input placeholder={t(isStake ? 'Farm-Stake-Amount' : 'Farm-UnApproval-Amount')}
                 value={inputVal}
                 fullWidth={true}
                 classes={{root: classes.dialogInput}}
                 onChange={changeInputVal}
          />
        </DialogContent>
        <DialogActions style={{height: 50}}>
          <TextButton className={classes.dialogAction}
                      style={{color: "#F03278"}}
                      disabled={!Boolean(isStake ? stakeAble : withdrawAble)}
                      onClick={isStake ? onStake : onWithdraw}>
            {t('Farm-Dialog-Confirm')}
          </TextButton>
          <TextButton className={classes.dialogAction}
                      style={{color: "#000000"}}
                      onClick={closeDialog}>
            {t('Farm-Dialog-Cancel')}
          </TextButton>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
