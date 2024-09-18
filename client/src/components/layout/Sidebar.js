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
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { setWallet } from "../../actions/wallet";

const shortenAddress = (address) => {
  if (!address) return "Connect Wallet";
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 5,
    address.length
  )}`;
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

  const moveToMyProjects = () => {
    navigate("/myprojects");
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
        display: "inline-block",
        width: "calc(max(12%, 200px))",
        height: "100vh",
        backgroundColor: "#00378B",
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
          <ListItem>
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
                <SaveAltIcon sx={{ color: "white" }} />
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
          {wallet ? (
            <ListItem disablePadding>
              <ListItemButton onClick={moveToMyProjects}>
                <ListItemIcon>
                  <DvrIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="MyProjects" />
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
          <Button onClick={handleWallet} fullWidth>
            {shortenAddress(wallet)}
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
