import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Web3 } from "web3";
import { styled } from "@mui/material/styles";
import { TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Project from "../abi/Project.json";
import { shortenAddress } from "../utils/utils";

const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0E2F67",
    color: theme.palette.common.white,
    fontSize: 21,
  },
  [`&.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    fontSize: 20,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
    <StyledTableRow>
      <StyledTableCell>{shortenAddress(project.project)}</StyledTableCell>
      <StyledTableCell>{reward / 10 ** 18}</StyledTableCell>
      <StyledTableCell sx={{ width: "180px" }}>
        <Button
          sx={{
            backgroundColor: "#1F79F3",
            color: "white",
            padding: "5px 12px",
          }}
          onClick={() => withdrawReward(project.project, reward)}
        >
          Withdraw Reward
        </Button>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ProjectItem;
