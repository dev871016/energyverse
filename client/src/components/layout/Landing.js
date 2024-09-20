import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Web3 } from "web3";
import { Box, Container } from "@mui/material";
import { AgCharts } from "ag-charts-react";
import Loading from "../utils/Loading";
import AEV from "../abi/AEV.json";

const AEVContractAddress = "0x0d227d43Db18361c5c67f5a217673baD86787E67";
const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const Landing = ({ wallet: { wallet } }) => {
  const [balance, setBalance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getInfo = async () => {
    if (!wallet) return;
    const contractAddress = AEVContractAddress;
    const contractABI = AEV.abi;
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    contract.methods
      .balanceOf(wallet)
      .call()
      .then((result) => {
        setBalance(Number(result) / 10 ** 18);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setIsLoading(true);
    getInfo();
    const intervalId = setInterval(getInfo, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [wallet]);

  return (
    <Box
      sx={{
        display: "inline-block",
        position: "absolute",
        width: "calc(100% - max(12%, 200px))",
        height: "100vh",
        backgroundColor: "#0A1223",
        color: "white",
        overflow: "auto",
      }}
    >
      <Container
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "30px",
          padding: "100px",
        }}
      >
        <AgCharts
          style={{ width: "80%", height: "600px" }}
          options={{
            data: [
              { asset: "Pre Sale", amount: 14.3 },
              { asset: "Public Sale", amount: 38.1 },
              { asset: "Team and Advisors", amount: 17.1 },
              { asset: "Development Fund", amount: 6.7 },
              { asset: "Staking Rewards", amount: 4.8 },
              { asset: "Airdrop", amount: 4.8 },
              { asset: "Marketing", amount: 14.3 },
            ],
            title: {
              text: "AEV Tokenomics",
            },
            series: [
              {
                type: "pie",
                angleKey: "amount",
                calloutLabelKey: "asset",
                sectorLabelKey: "amount",
                sectorLabel: {
                  color: "white",
                  fontWeight: "bold",
                  formatter: ({ value }) => `${value}%`,
                },
              },
            ],
          }}
        />
        <Container sx={{ width: "20%", textAlign: "center" }}>
          {isLoading ? <Loading /> : <div>balance : {balance}</div>}
        </Container>
      </Container>
    </Box>
  );
};

Landing.propTypes = {
  wallet: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  wallet: state.wallet,
});

export default connect(mapStateToProps)(Landing);
