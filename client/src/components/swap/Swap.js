import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Web3 } from "web3";
import Project from "../abi/Project.json";
import Router from "../abi/Router.json";
import USDC from "../abi/USDC.json";
import AEV from "../abi/AEV.json";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
} from "@mui/material";

const routerAddress = "0x86dcd3293C53Cf8EFd7303B57beb2a3F671dDE98";
const adminAddress = "0x467b69d4b71ccf5decc44b8e6c09eb0b2e247f58";
const AEVContractAddress = "0x0d227d43Db18361c5c67f5a217673baD86787E67";
const USDCAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const Swap = ({ wallet: { wallet } }) => {
  const [isBuyAEV, setIsBuyAEV] = useState(true);
  const [srcDecimals, setSrcDecimals] = useState(6);
  const [dstDecimals, setDstDecimals] = useState(18);
  const [srcAmount, setSrcAmount] = useState(0);
  const [dstAmount, setDstAmount] = useState(0);
  const [isInfoAlertOpen, setIsInfoAlertOpen] = React.useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = React.useState(false);

  const handleInfoAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsInfoAlertOpen(false);
  };

  const handleSuccessAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSuccessAlertOpen(false);
  };

  const changeTokens = () => {
    setIsBuyAEV(!isBuyAEV);
    setSrcDecimals(24 - srcDecimals);
    setDstDecimals(24 - dstDecimals);
    const temp = srcAmount;
    setSrcAmount(dstAmount);
    setDstAmount(temp);
  };

  const approveToken = () => {
    if (wallet !== "") {
      const contractABI = isBuyAEV ? USDC.abi : AEV.abi;
      const contractAddress = isBuyAEV ? USDCAddress : AEVContractAddress;
      const web3Instance = new Web3(window.ethereum);
      const contract = new web3Instance.eth.Contract(
        contractABI,
        contractAddress
      );
      contract.methods
        .approve(routerAddress, 10 ** srcDecimals * Number(srcAmount))
        .send({
          from: wallet,
        })
        .then((result) => {
          setIsSuccessAlertOpen(true);
        })
        .catch((error) => console.log(error));
    } else {
      setIsInfoAlertOpen(true);
    }
  };

  const swapToken = () => {
    console.log(10 ** srcDecimals * Number(srcAmount));
    console.log(isBuyAEV);
    if (wallet !== "") {
      const contractABI = Router.abi;
      const contractAddress = routerAddress;
      const web3Instance = new Web3(window.ethereum);
      const contract = new web3Instance.eth.Contract(
        contractABI,
        contractAddress
      );
      contract.methods
        .swapExactTokensForTokens(
          10 ** srcDecimals * Number(srcAmount),
          0,
          isBuyAEV
            ? [USDCAddress, AEVContractAddress]
            : [AEVContractAddress, USDCAddress],
          wallet,
          300000000000000
        )
        .send({
          from: wallet,
        })
        .then((result) => {
          setIsSuccessAlertOpen(true);
        })
        .catch((error) => console.log(error));
    } else {
      setIsInfoAlertOpen(true);
    }
  };

  useEffect(() => {
    console.log(srcAmount);
    if (!srcAmount) return;
    if (Number(srcAmount) <= 0) return;
    const contractABI = Router.abi;
    const contract = new web3.eth.Contract(contractABI, routerAddress);
    contract.methods
      .getAmountsOut(
        10 ** srcDecimals * Number(srcAmount),
        isBuyAEV
          ? [USDCAddress, AEVContractAddress]
          : [AEVContractAddress, USDCAddress]
      )
      .call()
      .then((result) => {
        console.log(result[1]);
        setDstAmount(Number(result[1]) / 10 ** dstDecimals);
      })
      .catch((error) => console.log(error));
  }, [srcAmount]);

  return (
    <Box
      sx={{
        display: "inline-block",
        position: "absolute",
        width: "calc(100% - max(12%, 200px))",
        height: "100vh",
        backgroundColor: "#0A1223",
        color: "black",
        overflow: "auto",
      }}
    >
      <Container
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "30px",
          padding: "100px",
        }}
      >
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={isInfoAlertOpen}
          autoHideDuration={3000}
          onClose={handleInfoAlertClose}
        >
          <Alert
            onClose={handleInfoAlertClose}
            severity="info"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Please connect your wallet!
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={isSuccessAlertOpen}
          autoHideDuration={3000}
          onClose={handleSuccessAlertClose}
        >
          <Alert
            onClose={handleSuccessAlertClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Transaction success!
          </Alert>
        </Snackbar>
        <Container
          sx={{
            width: "300px",
            borderRadius: "10px",
            backgroundColor: "white",
          }}
        >
          <div>Swap Page</div>
          <TextField
            autoFocus
            required
            margin="dense"
            id="srcAmount"
            name="srcAmount"
            label={"Sell " + (isBuyAEV ? "USDC" : "AEV")}
            type="number"
            value={srcAmount}
            onChange={(e) => setSrcAmount(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="dstAmount"
            name="dstAmount"
            label={"Buy " + (isBuyAEV ? "AEV" : "USDC")}
            type="number"
            value={dstAmount}
            onChange={(e) => setDstAmount(e.target.value)}
            fullWidth
            variant="standard"
          />
          <Button onClick={() => changeTokens()}>Change</Button>
          <Button onClick={() => approveToken()}>Approve</Button>
          <Button onClick={() => swapToken()}>Swap</Button>
        </Container>
      </Container>
    </Box>
  );
};

Swap.propTypes = {
  wallet: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  wallet: state.wallet,
});

export default connect(mapStateToProps)(Swap);
