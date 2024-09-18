import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { Web3 } from "web3";
import Project from "../abi/Project.json";

const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const ProjectItem = ({ project, stakeToProject, payForEnergy }) => {
  const [availableBalance, setAvailableBalance] = useState(0);

  const getInfo = async () => {
    const contractAddress = project.project;
    const contractABI = Project.abi;
    const contract = new web3.eth.Contract(contractABI, contractAddress);
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
      <div>totalBalance : {project.totalBalance} AEV</div>
      <div>availableBalance : {availableBalance}</div>
      <div>
        <Button onClick={() => stakeToProject(project.project)}>
          Stake to Project
        </Button>
        <Button onClick={() => payForEnergy(project.project)}>
          Pay for Energy
        </Button>
      </div>
    </Container>
  );
};

export default ProjectItem;
