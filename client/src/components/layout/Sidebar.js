import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DvrIcon from "@mui/icons-material/Dvr";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SendIcon from "@mui/icons-material/Send";
import TokenIcon from "@mui/icons-material/Token";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import { setWallet } from "../../actions/wallet";
import { shortenAddress } from "../utils/utils";
import env from "../utils/env";

const adminAddress = "0x467b69d4b71ccf5decc44b8e6c09eb0b2e247f58";

const buttonText = (address) => {
  if (!address) return "Connect Wallet";
  return shortenAddress(address);
};

const Sidebar = ({ setWallet, wallet: { wallet } }) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Use Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      console.log(accounts);

      if (accounts.length !== 0) {
        const account = accounts[0];
        setWallet(account);
        console.log("Found an authorized account ", account);
      } else {
        setWallet("");
        console.log("Could not find an authorized account");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendRequest = async () => {
    if (!wallet) {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
          params: [],
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsOpen(true);
    }
  };

  const disconnectWallet = async () => {
    await window.ethereum.request({
      method: "wallet_revokePermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    setIsOpen(false);
  };

  const moveToHome = () => {
    navigate("/");
  };

  const moveToProjects = () => {
    navigate("/projects");
  };

  const moveToVesting = () => {
    navigate("/vesting");
  };

  const moveToMyProjects = () => {
    navigate("/myprojects");
  };

  const moveToOwnProjects = () => {
    navigate("/ownprojects");
  };

  const moveToTransactions = () => {
    navigate("/transactions");
  };

  const moveToSwap = () => {
    navigate("/swap");
  };

  const handleWallet = () => {
    sendRequest();
  };

  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      checkIfWalletIsConnected();
    });
    checkIfWalletIsConnected();
  }, []);

  return (
    <Box
      sx={{
        width: "calc(max(12%, 200px))",
        height: "100vh",
        backgroundColor: env.sidebarColor,
        color: "white",
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <List>
          <ListItem
            sx={{
              justifyContent: "space-around",
              paddingTop: "25px",
              paddingBottom: "25px",
            }}
          >
            <img src="./img/logo.png" alt="logo" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={moveToHome}>
              <ListItemIcon>
                <HomeIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={moveToTransactions}>
              <ListItemIcon>
                <SendIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Transactions" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={moveToProjects}>
              <ListItemIcon>
                <DvrIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItemButton>
          </ListItem>
          {wallet && wallet === adminAddress ? (
            <ListItem disablePadding>
              <ListItemButton onClick={moveToVesting}>
                <ListItemIcon>
                  <TokenIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Vesting" />
              </ListItemButton>
            </ListItem>
          ) : null}
          {wallet && wallet !== adminAddress ? (
            <ListItem disablePadding>
              <ListItemButton onClick={moveToMyProjects}>
                <ListItemIcon>
                  <CreditScoreIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="My Projects" />
              </ListItemButton>
            </ListItem>
          ) : null}
          {wallet && wallet !== adminAddress ? (
            <ListItem disablePadding>
              <ListItemButton onClick={moveToOwnProjects}>
                <ListItemIcon>
                  <FolderSharedIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Providing Projects" />
              </ListItemButton>
            </ListItem>
          ) : null}
          <ListItem disablePadding>
            <ListItemButton onClick={moveToSwap}>
              <ListItemIcon>
                <SwapHorizIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Swap" />
            </ListItemButton>
          </ListItem>
        </List>
        <Container sx={{ padding: "30px", alignItems: "center" }}>
          <Button
            sx={{
              backgroundColor: "#1F79F3",
              color: "white",
              padding: "5px 12px",
            }}
            onClick={handleWallet}
            fullWidth
          >
            {buttonText(wallet)}
          </Button>
        </Container>
        <Dialog
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Disconnect wallet?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure to disconnect wallet?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={disconnectWallet}>
              OK
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

Sidebar.propTypes = {
  wallet: PropTypes.object.isRequired,
  setWallet: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  wallet: state.wallet,
});

export default connect(mapStateToProps, { setWallet })(Sidebar);
