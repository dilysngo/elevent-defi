import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
//  notistack
import { SnackbarProvider } from 'notistack';
//  core components
import { Notifier } from "features/common"
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import FooterLinks from 'components/Footer/FooterLinks.js';
import RewardModal from 'components/RewardModal/RewardModal';
//  @material-ui/core components
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
//  hooks
import { useConnectWallet, useDisconnectWallet } from './redux/hooks';
//  i18n
import i18next from 'i18next';
//  web3Modal
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
//  core pages
//  style for this page
import appStyle from "./jss/appStyle.js";

const useStyles = makeStyles(appStyle);

export default function App({ children }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { connectWallet, web3, address, networkId, connected, connectWalletPending } = useConnectWallet();
  const { disconnectWallet } = useDisconnectWallet();
  const [ web3Modal, setModal ] = useState(null)
  const [ rewardModal, setRewardModal] = React.useState(false);

  const openRewardModal = () => {
    setRewardModal(true);
  };
  
  const closeRewardModal = () => {
    setRewardModal(false);
  };

  useEffect(() => {
    const newModal = new Web3Modal({
      network: process.env.NETWORK ? process.env.NETWORK : "mainet",
      cacheProvider: true,
      providerOptions: {
        injected: {
          display: {
            name: "Injected",
            description: i18next.t('Home-BrowserWallet')
          },
        },
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.INFURA_ID
          }
        }
      }
    })
    setModal(newModal)
  }, [setModal])

  

  useEffect(() => {
    if (web3Modal && (web3Modal.cachedProvider || window.ethereum)) {
      connectWallet(web3Modal);
    }
  }, [web3Modal, connectWallet, window.ethereum])

  useEffect(() => {
    if (web3 && address && !connectWalletPending && networkId && Boolean(networkId !== Number(process.env.NETWORK_ID))) {
      alert(t('App-SnackBarText'))
    }
  }, [web3, address, networkId])

  return (
    <SnackbarProvider>
      <div className={classes.page}>
        <Header
          brand="Eleven.finance"
          links={
            <HeaderLinks
              dropdownHoverColor="dark"
              address={address}
              connected={connected}
              connectWallet={() => connectWallet(web3Modal)}
              disconnectWallet={() => disconnectWallet(web3, web3Modal)}
              openRewardModal={() => openRewardModal()}
            />
          }
          color="dark"
        />

        <RewardModal isOpen={rewardModal} closeRewardModal={closeRewardModal} />

        <div className={classes.container}>
            <div className={classes.children}>
              {Boolean(networkId === Number(process.env.NETWORK_ID)) && children}
              <Notifier />
            </div>
          <FooterLinks />
        </div>
      </div>
    </SnackbarProvider>
  );
}
