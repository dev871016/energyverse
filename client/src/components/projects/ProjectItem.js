import React, { useState, useEffect } from "react";
import { Box, Button, Container } from "@mui/material";
import { Web3 } from "web3";
import Project from "../abi/Project.json";
import { shortenAddress } from "../utils/utils";

const adminAddress = "0x467b69d4b71ccf5decc44b8e6c09eb0b2e247f58";
const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const ProjectItem = ({
  project,
  wallet,
  stakeToProject,
  payForEnergy,
  distributeProfit,
}) => {
  const [profit, setProfit] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);

  const getInfo = async () => {
    const contractAddress = project.project;
    const contractABI = Project.abi;
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    contract.methods
      .profit()
      .call()
      .then((result) => setProfit(Number(result)))
      .catch((error) => console.log(error));
    contract.methods
      .balances(project.project)
      .call()
      .then((result) => setAvailableBalance(Number(result)))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "20px",
      }}
    >
      <Box
        sx={{
          width: "30%",
          backgroundColor: "#0A224F",
          borderRadius: "20px",
          borderColor: "#3394C4",
          borderStyle: "solid",
          padding: "20px 40px",
        }}
      >
        <div style={{ fontSize: "25px" }}>{project.name}</div>
        <div>Address : {shortenAddress(project.project)}</div>
        <div>Energy Provider : {shortenAddress(project.owner)}</div>
        <div>Location : {project.location}</div>
        <div>
          Total tokens : {Number(project.totalBalance / 10 ** 18).toFixed(0)}{" "}
          AEV
        </div>
        <div>
          Available Investment :{" "}
          {Number(availableBalance / 10 ** 18).toFixed(0)} AEV
        </div>
        <div>Current Profit : {profit}</div>
      </Box>
      <Box
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "25px" }}>Description</div>
          <div>{project.description}</div>
        </div>
        {wallet === adminAddress ? (
          <div>
            <Button
              sx={{
                backgroundColor: "#1F79F3",
                color: "white",
                padding: "5px 12px",
              }}
              onClick={() => distributeProfit(project.project)}
            >
              Distribute Reward
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "30px" }}>
            <Button
              sx={{
                backgroundColor: "#1F79F3",
                color: "white",
                padding: "5px 12px",
              }}
              onClick={() => stakeToProject(project.project)}
            >
              Stake to Project
            </Button>
            <Button
              sx={{
                backgroundColor: "#1F79F3",
                color: "white",
                padding: "5px 12px",
              }}
              onClick={() => payForEnergy(project.project)}
            >
              Pay for Energy
            </Button>
          </div>
        )}
      </Box>
    </Container>
  );
};

export default ProjectItem;
