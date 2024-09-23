import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Web3 } from "web3";
import { Box, Container } from "@mui/material";
import { AgCharts } from "ag-charts-react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import AEV from "../abi/AEV.json";
import env from "../utils/env";

const AEVContractAddress = "0x0d227d43Db18361c5c67f5a217673baD86787E67";
const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
const APIURL2 =
  "https://api.studio.thegraph.com/query/89356/subgraph2/version/latest";
const projectsQuery2 = `
  query MyQuery {
    createProjects {
      project
    }
  }
`;

const APIURL =
  "https://api.studio.thegraph.com/query/89356/subgraph1/version/latest";

const projectsQuery = `
  query MyQuery {
    stakeToProjects {
      amount
    }
  }
`;

const Landing = ({ wallet: { wallet } }) => {
  const [balance, setBalance] = useState("");
  const [totalSupply, setTotalSupply] = useState("0 AEV");
  const [projectsCount, setProjectsCount] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState("0 AEV");

  const getInfo = async () => {
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    client
      .query({
        query: gql(projectsQuery),
      })
      .then((data) => {
        console.log(data.data.stakeToProjects);
        setTotalInvestment(
          String(
            data.data.stakeToProjects.reduce((sum, item) => {
              return Number(item.amount) + sum;
            }, 0) /
              10 ** 18
          ) + " AEV"
        );
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });

    const client2 = new ApolloClient({
      uri: APIURL2,
      cache: new InMemoryCache(),
    });

    client2
      .query({
        query: gql(projectsQuery2),
      })
      .then((data) => {
        setProjectsCount(data.data.createProjects.length);
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });

    const contractAddress = AEVContractAddress;
    const contractABI = AEV.abi;
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    contract.methods
      .totalSupply()
      .call()
      .then((result) => {
        setTotalSupply(
          String((Number(result) / 10 ** 16).toFixed(2) / 100) + " AEV"
        );
      })
      .catch((error) => console.log(error));
    if (!wallet) {
      setBalance("0");
      return;
    }
    contract.methods
      .balanceOf(wallet)
      .call()
      .then((result) => {
        setBalance(
          String((Number(result) / 10 ** 16).toFixed(2) / 100) + " AEV"
        );
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getInfo();
  }, [wallet]);

  return (
    <Box
      sx={{
        width: "calc(100% - max(12%, 200px))",
        height: "100vh",
        backgroundColor: env.bgColor,
        color: "white",
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
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            height: "25%",
            padding: "0px",
            backgroundColor: "#0A224F",
            borderRadius: "20px",
            borderColor: "#3394C4",
            borderStyle: "solid",
          }}
        >
          <Box
            sx={{
              width: "20%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "30px",
            }}
          >
            <div style={{ fontSize: "24px" }}>Total Supply</div>
            <div style={{ fontSize: "30px", fontWeight: "bold" }}>
              {totalSupply}
            </div>
          </Box>
          <Box
            sx={{
              width: "20%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "30px",
            }}
          >
            <div style={{ fontSize: "24px" }}>Total Projects</div>
            <div style={{ fontSize: "30px", fontWeight: "bold" }}>
              {projectsCount}
            </div>
          </Box>
          <Box
            sx={{
              width: "20%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "30px",
            }}
          >
            <div style={{ fontSize: "24px" }}>Total Investment</div>
            <div style={{ fontSize: "30px", fontWeight: "bold" }}>
              {totalInvestment}
            </div>
          </Box>
          <Box
            sx={{
              width: "20%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "30px",
            }}
          >
            <div style={{ fontSize: "24px" }}>Your Balance</div>
            <div style={{ fontSize: "30px", fontWeight: "bold" }}>
              {balance}
            </div>
          </Box>
        </Container>
        <Container
          sx={{
            width: "100%",
            height: "45%",
            backgroundColor: "white",
            borderRadius: "20px",
            borderColor: "#3394C4",
            borderStyle: "solid",
            padding: "20px",
          }}
        >
          <AgCharts
            style={{ width: "100%", height: "100%", borderRadius: "30px" }}
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
                    fontSize: 15,
                    formatter: ({ value }) => `${value}%`,
                  },
                },
              ],
            }}
          />
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
