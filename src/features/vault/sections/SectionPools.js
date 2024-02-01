/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from "bignumber.js";
import { byDecimals, calculateReallyNum, formatDecimals } from 'features/helpers/bignumber';
// @material-ui/core components
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CustomOutlinedInput from 'components/CustomOutlinedInput/CustomOutlinedInput';
import { primaryColor } from "assets/jss/material-kit-pro-react.js";
import SearchIcon from "@material-ui/icons/Search"
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  InputBase,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';

// core components
import Button from "components/CustomButtons/Button.js";
// sections for this section
// import SectionOpenedPool from "./SectionOpenedPool";
import { useSnackbar } from 'notistack';
//  hooks
import { useConnectWallet } from '../../home/redux/hooks';
import { useFetchBalances, useFetchPoolBalances, useFetchApproval, useFetchDeposit, useFetchWithdraw, useFetchContractApy } from '../redux/hooks';
import CustomSlider from 'components/CustomSlider/CustomSlider';

import sectionPoolsStyle from "../jss/sections/sectionPoolsStyle";
import { inputLimitPass, inputFinalVal, isEmpty } from 'features/helpers/utils';

import millify from 'millify';

import NumberFormat from 'react-number-format';

import _ from 'lodash';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: '14px',
    padding: '10px 26px 10px 12px',
  },
}))(InputBase);

const useStyles = makeStyles(sectionPoolsStyle);

export default function SectionPools() {
  const { t, i18n } = useTranslation();
  const { web3, address, networkId } = useConnectWallet();
  let { pools, fetchPoolBalances } = useFetchPoolBalances();
  const { tokens, fetchBalances } = useFetchBalances();
  const [openedCardList, setOpenCardList] = useState([0]);
  const classes = useStyles();

  const { fetchApproval, fetchApprovalPending } = useFetchApproval();
  const { fetchDeposit, fetchDepositEth, fetchDepositPending } = useFetchDeposit();
  const { fetchWithdraw, fetchWithdrawEth, fetchWithdrawPending } = useFetchWithdraw();
  const { fetchContractApy } = useFetchContractApy();

  const [depositedBalance, setDepositedBalance] = useState({});
  const [withdrawAmount, setWithdrawAmount] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortTerm, setSortTerm] = useState('default');
  const [onlyStakedPools, setOnlyStakedPools] = useState(false);
  const [onlyWithBalancePools, setOnlyWithBalancePools] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await fetch("https://eleven.finance/api.json");
    const json = await response.json();

    const normalizedData = pools.map((pool) => {
      let token = pool.token;
      let vault = json[token]["vault"];
      let tvl = json[token]["tvl"];
      pool["vault"] = vault;
      pool["tvl"] = tvl;
      pool['price'] = json[token]['price'];
      return pool;
    });

    normalizedData["totalvaluelocked"] = json["totalvaluelocked"]

    setData(normalizedData);
  }

  useEffect(() => {
    if (pools[0].vault !== undefined) {
      setSearchResults(pools);
    }

    const term = searchTerm.toLowerCase()
    let results = pools.filter(pool =>
      pool.token.toLowerCase().includes(term)
    );

    if (onlyStakedPools) {
      results = results.filter(pool => tokens[pool.earnedToken]?.tokenBalance > 0);
    }

    if (onlyWithBalancePools) {
      results = results.filter(pool => {
        return tokens[pool.token]?.tokenBalance > 0
          || tokens[pool.earnedToken]?.tokenBalance > 0;
      });
    }

    switch (sortTerm) {
      case "apy":
        results = _.orderBy(results, 'vault.apy', 'desc');
        break;
      case "apd":
        results = _.orderBy(results, 'vault.aprd', 'desc');
        break;
      case "tvl":
        results = _.orderBy(results, 'tvl', 'desc');
        break;
    }

    setSearchResults(results);
  }, [searchTerm, sortTerm, onlyStakedPools, onlyWithBalancePools, tokens])

  const changeDetailInputValue = (type, index, total, tokenDecimals, event) => {
    let value = event.target.value;
    if (!inputLimitPass(value, tokenDecimals)) {
      return;
    }
    let sliderNum = 0;
    let inputVal = Number(value.replace(',', ''));
    if (value) {
      sliderNum = byDecimals(inputVal / total, 0).toFormat(2) * 100;
    }
    switch (type) {
      case 'depositedBalance':
        setDepositedBalance({
          ...depositedBalance,
          [index]: inputFinalVal(value, total, tokenDecimals),
          [`slider-${index}`]: sliderNum,
        });
        break;
      case 'withdrawAmount':
        setWithdrawAmount({
          ...withdrawAmount,
          [index]: inputFinalVal(value, total, tokenDecimals),
          [`slider-${index}`]: sliderNum,
        });
        break;
      default:
        break;
    }
  }

  const handleDepositedBalance = (index, total, event, sliderNum) => {
    setDepositedBalance({
      ...depositedBalance,
      [index]: sliderNum == 0 ? '0' : calculateReallyNum(total, sliderNum),
      [`slider-${index}`]: sliderNum == 0 ? 0 : sliderNum,
    });
  }

  const handleWithdrawAmount = (index, total, event, sliderNum) => {
    setWithdrawAmount({
      ...withdrawAmount,
      [index]: sliderNum == 0 ? '0' : calculateReallyNum(total, sliderNum),
      [`slider-${index}`]: sliderNum == 0 ? 0 : sliderNum,
    });
  };

  const onApproval = (pool, index, event) => {
    event.stopPropagation();
    fetchApproval({
      address,
      web3,
      tokenAddress: pool.tokenAddress,
      contractAddress: pool.earnContractAddress,
      index
    }).then(
      () => enqueueSnackbar(`Approval success`, { variant: 'success' })
    ).catch(
      error => enqueueSnackbar(`Approval error: ${error}`, { variant: 'error' })
    )
  }

  const onDeposit = (pool, index, isAll, balanceSingle, event) => {
    event.stopPropagation();
    if (isAll) {
      setDepositedBalance({
        ...depositedBalance,
        [index]: String(forMat(balanceSingle)),
        [`slider-${index}`]: 100,
      })
    }
    let amountValue = depositedBalance[index] ? depositedBalance[index].replace(',', '') : depositedBalance[index];
    if (amountValue == undefined) {
      amountValue = '0';
    }
    if (!pool.tokenAddress) {// 如果是eth
      fetchDepositEth({
        address,
        web3,
        amount: new BigNumber(amountValue).multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals)).toString(10),
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Deposit success`, { variant: 'success' })
      ).catch(
        error => enqueueSnackbar(`Deposit error: ${error}`, { variant: 'error' })
      )
    } else {
      fetchDeposit({
        address,
        web3,
        isAll,
        amount: new BigNumber(amountValue).multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals)).toString(10),
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Deposit success`, { variant: 'success' })
      ).catch(
        error => enqueueSnackbar(`Deposit error: ${error}`, { variant: 'error' })
      )
    }
  }

  const onWithdraw = (pool, index, isAll, singleDepositedBalance, event) => {
    event.stopPropagation();
    if (isAll) {
      setWithdrawAmount({
        ...withdrawAmount,
        [index]: String(forMat(singleDepositedBalance)),
        [`slider-${index}`]: 100,
      })
    }
    let amountValue = withdrawAmount[index] ? withdrawAmount[index].replace(',', '') : withdrawAmount[index];
    if (amountValue == undefined) {
      amountValue = '0';
    }
    if (!pool.tokenAddress) {// 如果是eth
      fetchWithdrawEth({
        address,
        web3,
        isAll,
        amount: new BigNumber(amountValue).multipliedBy(new BigNumber(10).exponentiatedBy(pool.itokenDecimals)).toString(10),
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Withdraw success`, { variant: 'success' })
      ).catch(
        error => enqueueSnackbar(`Withdraw error: ${error}`, { variant: 'error' })
      )
    } else {
      fetchWithdraw({
        address,
        web3,
        isAll,
        amount: new BigNumber(amountValue).multipliedBy(new BigNumber(10).exponentiatedBy(pool.itokenDecimals)).toString(10),
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Withdraw success`, { variant: 'success' })
      ).catch(
        error => enqueueSnackbar(`Withdraw error: ${error}`, { variant: 'error' })
      )
    }
  }

  const openCard = id => {
    return setOpenCardList(
      openedCardList => {
        if (openedCardList.includes(id)) {
          return openedCardList.filter(item => item !== id)
        } else {
          return [...openedCardList, id]
        }
      }
    )
  }

  useEffect(() => {
    if (address && web3) {
      fetchBalances({ address, web3, tokens });
      fetchPoolBalances({ address, web3, pools });
      const id = setInterval(() => {
        fetchBalances({ address, web3, tokens });
        fetchPoolBalances({ address, web3, pools });
      }, 10000);
      return () => clearInterval(id);
    }
  }, [address, web3, fetchBalances, fetchPoolBalances]);

  const isMoreDepostLimit = (value, depostLimit) => {
    if (isEmpty(value) || depostLimit == 0 || value < depostLimit) {
      return false
    }
    return true;
  }

  useEffect(() => {
    fetchContractApy();
  }, [pools, fetchContractApy]);

  const forMat = number => {
    return new BigNumber(
      number
    ).multipliedBy(
      new BigNumber(1000000000000000)
    ).dividedToIntegerBy(
      new BigNumber(1)
    ).dividedBy(
      new BigNumber(1000000000000000)
    ).toNumber()
  }

  const isZh = Boolean((i18n.language == 'zh') || (i18n.language == 'zh-CN'));
  const units = ["", "K", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion"];

  const getApy = pool => {
    if (pool.vault === undefined) {
      return "";
    } else {
      const vaultApy = pool.vault.apy;
      try{
        return millify(vaultApy, { units, space: true });
      }catch{return Number.parseFloat(vaultApy).toExponential(2);}
    }
  }

  const getAprd = pool => {
    if (pool.vault === undefined) {
      return "";
    } else {
      const vaultAprd = pool.vault.aprd;
      try{
        return millify(vaultAprd, { units, space: true });
      }catch{return "--"}
    }
  }

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSort = event => {
    setSortTerm(event.target.value);
  }

  const handleOnlyStakedPools = event => {
    setOnlyStakedPools(event.target.checked);
  }

  const handleOnlyWithBalancePools = event => {
    setOnlyWithBalancePools(event.target.checked);
  }

  return (
    <Grid container style={{ paddingTop: '4px' }}>
      <Grid item xs={12}>
        <div className={classes.mainTitle}>{t('Vault-Main-Title')}</div>
        <h3 style={{color: 'white'}}>TVL: <NumberFormat value={data.totalvaluelocked} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} /></h3>
      </Grid>

      <Grid item container className={classes.filtersContainer} xs={12}>
        <Grid item md={6} className={classes.filtersLeft}>
          <FormControlLabel
            control={
              <Checkbox checked={onlyStakedPools}
                        onChange={handleOnlyStakedPools}
                        name="only_staked_pools" />
            }
            label="Deposited Only"
            className={classes.filtersCheckbox}
          />

          <FormControlLabel
            control={
              <Checkbox checked={onlyWithBalancePools}
                        onChange={handleOnlyWithBalancePools}
                        name="only_with_balance_pools" />
            }
            label="Hide Zero Balances"
            className={classes.filtersCheckbox}
          />
        </Grid>
        <Grid item md={6} className={classes.filtersRight}>
          <TextField
            onChange={handleSearchChange}
            className={classes.searchInput}
            placeholder="Search"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }} />

          <FormControl
            variant="outlined"
            className={classes.sortSelect}
          >
            <Select
              value={sortTerm}
              onChange={handleSort}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="apy">APY</MenuItem>
              <MenuItem value="tvl">TVL</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {Boolean(networkId === Number(process.env.NETWORK_ID)) && searchResults.map((pool, index) => {
        let balanceSingle = byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals);
        let singleDepositedBalance = byDecimals(tokens[pool.earnedToken].tokenBalance, pool.itokenDecimals);
        let depositedLpValue = singleDepositedBalance.times(pool.pricePerFullShare);
        return (
          <Grid item xs={12} container key={index} style={{ marginBottom: "24px" }} spacing={0}>
            <div style={{ width: "100%" }}>
              <Accordion
                expanded={Boolean(openedCardList.includes(index))}
                className={classes.accordion}
                TransitionProps={{ unmountOnExit: true }}
              >
                <AccordionSummary
                  className={classes.details}
                  style={{ justifyContent: "space-between" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    openCard(index)
                  }}
                >
                  <Grid container alignItems="center" justify="space-around" spacing={4} style={{ paddingTop: "16px", paddingBottom: "16px" }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Grid item container alignItems="center" xs={12} spacing={2}>
                        <Grid item>
                          <Avatar alt={pool.token} src={require(`../../../images/${pool.token}-logo.svg`)} />
                        </Grid>
                        <Grid item>
                          <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom>
                            {pool.token}
                            <Hidden smUp>
                              <i
                                style={{ color: primaryColor[0], marginLeft: '4px', visibility: Boolean(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl) ? "visible" : "hidden" }}
                                className={"yfiiicon yfii-help-circle"}
                                onClick={
                                  event => {
                                    event.stopPropagation();
                                    window.open(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl)
                                  }
                                }
                              />
                            </Hidden>
                          </Typography>
                          {typeof pool.tvl !== 'undefined' ? (
                            <Typography className={classes.poolTvl} variant="body2">TVL: <NumberFormat value={pool.tvl} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} /> </Typography>
                          ) : (
                            <Typography className={classes.poolTvl} variant="body2">--</Typography>
                          )}
                          <Typography className={classes.iconContainerSubTitle} variant="body2">{pool.uses}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={6} sm={4} md={8}>
                      <Grid item container justify="space-between">
                        <Hidden smDown>
                          <Grid item xs={5} container alignItems="center">
                            <Grid item style={{ width: "200px" }}>
                              <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{pool.token == 'OG-BNB LP' || pool.token == 'PSG-BNB LP' || pool.token == 'JUV-BNB LP' || pool.token == 'ASR-BNB LP' || pool.token == 'ATM-BNB LP' ? forMat(balanceSingle) : forMat(balanceSingle).toFixed(6)} {pool.token}</Typography>
                              <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-Balance')}</Typography></Grid>
                          </Grid>
                        </Hidden>
                        <Hidden mdDown>
                          <Grid item xs={4} container alignItems="center">
                            <Grid item style={{ width: "200px" }}>
                              <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{pool.token == 'OG-BNB LP' || pool.token == 'PSG-BNB LP' || pool.token == 'JUV-BNB LP' ? forMat(singleDepositedBalance) : forMat(singleDepositedBalance).toFixed(6)} {pool.earnedToken}</Typography>
                              <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-Deposited')}</Typography>
                            </Grid>
                          </Grid>
                        </Hidden>
                        <Grid item xs={12} md={3} container alignItems="center">
                          <Grid item>
                            <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>
                              <span>APY: {getApy(pool)} %</span>
                            </Typography>
                            <Typography className={classes.iconContainerSubTitle} variant="body2">
                              <span>APRD: {getAprd(pool)} %</span>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={6} sm={2} md={1}>
                      <Grid item container justify="flex-end" alignItems="center" spacing={2}>
                        <Hidden xsUp>
                          <Grid item>
                            <IconButton
                              classes={{
                                root: classes.iconContainerSecond
                              }}
                              style={{ visibility: Boolean(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl) ? "visible" : "hidden" }}
                              onClick={
                                event => {
                                  event.stopPropagation();
                                  window.open(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl)
                                }
                              }
                            >
                              <i className={"yfiiicon yfii-help-circle"} />
                            </IconButton>
                          </Grid>
                        </Hidden>
                        <Grid item>
                          <IconButton
                            className={classes.iconContainerPrimary}
                            onClick={(event) => {
                              event.stopPropagation();
                              openCard(index);
                            }}
                          >
                            {
                              openedCardList.includes(index) ? <i className={"yfiiicon yfii-arrow-up"} /> : <i className={"yfiiicon yfii-arrow-down"} />
                            }
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails style={{ justifyContent: "space-between" }}>
                  <Grid container style={{ width: "100%", marginLeft: 0, marginRight: 0 }}>
                    <Grid item xs={12} sm={6} className={classes.sliderDetailContainer}>
                      <div className={classes.poolBalanceBlock}>
                        <div>{t('Vault-Balance')}</div>
                        <div>
                          <div>
                            {formatDecimals(balanceSingle)}
                            {
                              pool.price
                              ? <span>
                                  &nbsp; (${balanceSingle.times(pool.price).toFixed(2)})
                                </span>
                              : ''
                            }
                          </div>
                          <div className={classes.poolBalanceDescription}>&nbsp;</div>
                        </div>
                      </div>
                      <FormControl fullWidth variant="outlined">
                        <CustomOutlinedInput
                          value={depositedBalance[index] != undefined ? depositedBalance[index] : '0'}
                          onChange={changeDetailInputValue.bind(this, 'depositedBalance', index, balanceSingle.toNumber(), pool.tokenDecimals)}
                        />
                      </FormControl>
                      <CustomSlider
                        classes={{
                          root: classes.depositedBalanceSliderRoot,
                          markLabel: classes.depositedBalanceSliderMarkLabel,
                        }}
                        aria-labelledby="continuous-slider"
                        value={depositedBalance['slider-' + index] ? depositedBalance['slider-' + index] : 0}
                        onChange={handleDepositedBalance.bind(this, index, balanceSingle.toNumber())}
                      />

                      <div>
                        {
                          pool.allowance === 0 ? (
                            <div className={classes.showDetailButtonCon}>
                              <Button
                                style={{
                                  width: '180px',
                                  margin: '12px 5px',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  backgroundColor: '#ff635a',
                                  color: '#ffffff',
                                  boxShadow: '0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)',
                                  fontWeight: "bold"
                                }}
                                round
                                color="primary"
                                onClick={onApproval.bind(this, pool, index)}
                                disabled={fetchApprovalPending[index]}
                              >
                                {fetchApprovalPending[index] ? `${t('Vault-ApproveING')}` : `${t('Vault-ApproveButton')}`}
                              </Button>
                            </div>
                          ) : (
                            <div className={classes.showDetailButtonCon}>
                              <Button
                                style={{
                                  width: '180px',
                                  margin: '12px 5px',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  backgroundColor: '#ff635a',
                                  color: '#ffffff',
                                  boxShadow: '0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)'
                                }}
                                round
                                onFocus={(event) => event.stopPropagation()}
                                disabled={
                                  fetchDepositPending[index] || (new BigNumber(depositedBalance[index]).toNumber() > balanceSingle.toNumber() || isMoreDepostLimit(new BigNumber(depositedBalance[index]).toNumber(), pool.depostLimit))
                                }
                                onClick={onDeposit.bind(this, pool, index, false, balanceSingle)}
                              >{t('Vault-DepositButton')}
                              </Button>
                              {Boolean(pool.tokenAddress) && <Button
                                style={{
                                  width: '180px',
                                  margin: '12px 5px',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  backgroundColor: '#ff635a',
                                  color: '#ffffff',
                                  boxShadow: '0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)'
                                }}
                                round
                                onFocus={(event) => event.stopPropagation()}
                                disabled={
                                  fetchDepositPending[index] || (new BigNumber(depositedBalance[index]).toNumber() > balanceSingle.toNumber() || isMoreDepostLimit(balanceSingle.toNumber(), pool.depostLimit))
                                }
                                onClick={onDeposit.bind(this, pool, index, true, balanceSingle)}
                              >{t('Vault-DepositButtonAll')}
                              </Button>}
                            </div>
                          )
                        }
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={6} className={classes.sliderDetailContainer}>
                      <div className={classes.poolBalanceBlock}>
                        <div>{t('Vault-ListDeposited')}</div>
                        <div className={classes.poolBalance}>
                          <div>
                            {formatDecimals(singleDepositedBalance)}
                            {
                              pool.price
                              ? <span>
                                  &nbsp; (${depositedLpValue.times(pool.price).toFixed(2)})
                                </span>
                              : ''
                            }
                          </div>
                          <div className={classes.poolBalanceDescription}>
                            {formatDecimals(depositedLpValue)} {pool.token}
                          </div>
                        </div>
                      </div>
                      <FormControl fullWidth variant="outlined">
                        <CustomOutlinedInput
                          value={withdrawAmount[index] != undefined ? withdrawAmount[index] : '0'}
                          onChange={changeDetailInputValue.bind(this, 'withdrawAmount', index, singleDepositedBalance.toNumber(), pool.itokenDecimals)}
                        />
                      </FormControl>
                      <CustomSlider
                        classes={{
                          root: classes.drawSliderRoot,
                          markLabel: classes.drawSliderMarkLabel,
                        }}
                        aria-labelledby="continuous-slider"
                        value={withdrawAmount['slider-' + index] ? withdrawAmount['slider-' + index] : 0}
                        onChange={handleWithdrawAmount.bind(this, index, singleDepositedBalance.toNumber())}
                      />
                      <div className={classes.showDetailButtonCon}>
                        <Button
                          style={{
                            width: '180px',
                            margin: '12px 5px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            backgroundColor: '#635AFF',
                            color: '#ffffff',
                            boxShadow: '0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)'
                          }}
                          round
                          type="button"
                          color="primary"
                          disabled={fetchWithdrawPending[index]}
                          onClick={onWithdraw.bind(this, pool, index, false, singleDepositedBalance)}
                        >
                          {fetchWithdrawPending[index] ? `${t('Vault-WithdrawING')}` : `${t('Vault-WithdrawButton')}`}
                        </Button>
                        <Button
                          style={{
                            width: '180px',
                            margin: '12px 5px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            backgroundColor: '#635AFF',
                            color: '#ffffff',
                            boxShadow: '0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)',
                          }}
                          round
                          type="button"
                          color="primary"
                          onClick={onWithdraw.bind(this, pool, index, true, singleDepositedBalance)}
                        >
                          {fetchWithdrawPending[index] ? `${t('Vault-WithdrawING')}` : `${t('Vault-WithdrawButtonAll')}`}
                        </Button>
                      </div>
                    </Grid>

                  </Grid>
                </AccordionDetails>
              </Accordion>
            </div>
          </Grid>
        )
      })}
    </Grid>
  )
}
