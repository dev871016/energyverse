import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { Web3 } from "web3";
import Project from "../abi/Project.json";

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
      style={{
        borderRadius: "20px",
        borderWidth: "1px",
        borderColor: "white",
        borderStyle: "solid",
        fontSize: "20px",
      }}
    >
      <div>project : {project.project}</div>
      <div>owner : {project.owner}</div>
      <div>name : {project.name}</div>
      <div>location : {project.location}</div>
      <div>description : {project.description}</div>
      <div>totalBalance : {project.totalBalance / 10 ** 18} AEV</div>
      <div>availableBalance : {availableBalance / 10 ** 18}</div>
      {wallet === adminAddress ? (
        <div>
          <div>profit : {profit}</div>
          <Button onClick={() => distributeProfit(project.project)}>
            Distribute Reward
          </Button>
        </div>
      ) : (
        <div>
          <Button onClick={() => stakeToProject(project.project)}>
            Stake to Project
          </Button>
          <Button onClick={() => payForEnergy(project.project)}>
            Pay for Energy
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ProjectItem;
