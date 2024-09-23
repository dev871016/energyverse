import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Web3 } from "web3";
import { Alert, Box, Button, Container, Snackbar } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SwapInput from "../common/SwapInput";
import Router from "../abi/Router.json";
import USDC from "../abi/USDC.json";
import AEV from "../abi/AEV.json";
import env from "../utils/env";

const routerAddress = "0x86dcd3293C53Cf8EFd7303B57beb2a3F671dDE98";
const AEVContractAddress = "0x0d227d43Db18361c5c67f5a217673baD86787E67";
const USDCAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const Swap = ({ wallet: { wallet } }) => {
  const [isBuyAEV, setIsBuyAEV] = useState(true);
  const [isSrcChanged, setIsSrcChanged] = useState(true);
  const [srcDecimals, setSrcDecimals] = useState(6);
  const [dstDecimals, setDstDecimals] = useState(18);
  const [srcAmount, setSrcAmount] = useState("0");
  const [dstAmount, setDstAmount] = useState("0");
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

  const changeTokens = async () => {
    setIsBuyAEV(!isBuyAEV);
    setSrcDecimals(24 - srcDecimals);
    setDstDecimals(24 - dstDecimals);

    setIsSrcChanged(!isSrcChanged);
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

  const handleChangeSrcAmount = (value) => {
    if (!value) return;
    if (Number(value) <= 0 || Number.isNaN(Number(value))) return;
    const contractABI = Router.abi;
    const contract = new web3.eth.Contract(contractABI, routerAddress);
    contract.methods
      .getAmountsOut(
        10 ** srcDecimals * Number(value),
        isBuyAEV
          ? [USDCAddress, AEVContractAddress]
          : [AEVContractAddress, USDCAddress]
      )
      .call()
      .then((result) => {
        setDstAmount(
          (Number(result[1]) / 10 ** dstDecimals).toFixed(dstDecimals)
        );
      })
      .catch((error) => console.log(error));
    setIsSrcChanged(true);
    setSrcAmount(value);
  };

  const handleChangeDstAmount = (value) => {
    if (!value) return;
    if (Number(value) <= 0 || Number.isNaN(Number(value))) return;
    const contractABI = Router.abi;
    const contract = new web3.eth.Contract(contractABI, routerAddress);
    contract.methods
      .getAmountsIn(
        10 ** dstDecimals * Number(value),
        isBuyAEV
          ? [USDCAddress, AEVContractAddress]
          : [AEVContractAddress, USDCAddress]
      )
      .call()
      .then((result) => {
        setSrcAmount(
          (Number(result[0]) / 10 ** srcDecimals).toFixed(srcDecimals)
        );
      })
      .catch((error) => console.log(error));
    setIsSrcChanged(false);
    setDstAmount(value);
  };

  useEffect(() => {
    if (isSrcChanged) {
      handleChangeSrcAmount(dstAmount);
    } else {
      handleChangeDstAmount(srcAmount);
    }
  }, [isSrcChanged]);

  return (
    <Box
      sx={{
        width: "calc(100% - max(12%, 200px))",
        height: "100vh",
        backgroundColor: env.bgColor,
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
            width: "450px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            borderRadius: "10px",
            backgroundColor: "#0A224F",
            borderColor: "#3394C4",
            color: "white",
            fontSize: "16px",
            borderStyle: "solid",
            padding: "10px",
          }}
        >
          <Container sx={{ display: "flex", gap: "10px" }}>
            <img src="img/polygon.png" alt="chain"></img>
            <div style={{ fontSize: 20, fontWeight: "bold" }}>Swap</div>
          </Container>
          <SwapInput
            isBuyAEV={isBuyAEV}
            value={srcAmount}
            setValue={handleChangeSrcAmount}
          />
          <Container sx={{ textAlign: "center" }}>
            <Button onClick={() => changeTokens()}>
              <SwapVertIcon />
            </Button>
          </Container>
          <SwapInput
            isBuyAEV={!isBuyAEV}
            value={dstAmount}
            setValue={handleChangeDstAmount}
          />
          <Container
            sx={{
              display: "flex",
              flexDirection: "rows",
              justifyContent: "space-around",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#1F79F3",
                color: "white",
                padding: "5px 12px",
              }}
              onClick={() => approveToken()}
            >
              Approve
            </Button>
            <Button
              sx={{
                backgroundColor: "#1F79F3",
                color: "white",
                padding: "5px 12px",
              }}
              onClick={() => swapToken()}
            >
              Swap
            </Button>
          </Container>
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
