import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { Web3 } from "web3";
import Project from "../abi/Project.json";

const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const ProjectItem = ({ project, wallet, withdrawReward }) => {
  const [reward, setReward] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);

  const getInfo = async () => {
    const contractAddress = project.project;
    const contractABI = Project.abi;
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    contract.methods
      .rewards(wallet)
      .call()
      .then((result) => setReward(Number(result)))
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
      <div>reward : {reward / 10 ** 18}</div>
      <Button onClick={() => withdrawReward(project.project, reward)}>
        Withdraw Reward
      </Button>
    </Container>
  );
};

export default ProjectItem;
