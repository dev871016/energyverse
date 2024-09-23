import React, { useState, useEffect } from "react";
import { Web3 } from "web3";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TokenVesting from "../abi/TokenVesting.json";
import ScheduleItem from "./ScheduleItem";

const rpc = "https://ethereum-sepolia.blockpi.network/v1/rpc/public";
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
  "&:first-child": {
    borderRadius: "30px 0px 0px 30px",
  },
  "&:last-child": {
    borderRadius: "0px 30px 30px 0px",
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

const VestingItem = ({ vesting, wallet, createVestingSchedule, release }) => {
  const [name, setName] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [vestingSchedulesCount, setVestingSchedulesCount] = useState(0);
  const getInfo = async () => {
    const contractAddress = vesting;
    const contractABI = TokenVesting.abi;
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    contract.methods
      .name()
      .call()
      .then((result) => setName(result))
      .catch((error) => console.log(error));
    const cnt = await contract.methods.getVestingSchedulesCount().call();
    setVestingSchedulesCount(Number(cnt));
    let temp = [];
    for (let i = 0; i < Number(cnt); i++) {
      const result = await contract.methods.getVestingIdAtIndex(i).call();
      temp = [...temp, result];
    }
    setSchedules(temp);
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#0A224F",
        borderRadius: "30px",
        borderColor: "#3394C4",
        borderStyle: "solid",
        padding: "20px",
        fontSize: 20,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div>Vesting Name : {name}</div>
      <div>Vesting Contract Address: {vesting}</div>
      {vestingSchedulesCount ? (
        <Box
          sx={{
            backgroundColor: "#0A224F",
            borderRadius: "30px",
            borderColor: "#3394C4",
            borderStyle: "solid",
            padding: "20px",
          }}
        >
          <Table
            sx={{
              minWidth: 700,
              color: "white",
            }}
            aria-label="customized table"
          >
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Schedule</StyledTableCell>
                <StyledTableCell>Beneficiary</StyledTableCell>
                <StyledTableCell>Start</StyledTableCell>
                <StyledTableCell>Duration</StyledTableCell>
                <StyledTableCell>Unit</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Releasable</StyledTableCell>
                <StyledTableCell>Release</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule, index) => (
                <ScheduleItem
                  key={index}
                  vesting={vesting}
                  scheduleId={schedule}
                  wallet={wallet}
                  release={release}
                />
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : null}
      <Box sx={{ right: "30px" }}>
        <Button
          sx={{
            backgroundColor: "#1F79F3",
            color: "white",
            padding: "5px 12px",
          }}
          onClick={() => createVestingSchedule(vesting)}
        >
          Create Schedule
        </Button>
      </Box>
    </Box>
  );
};

export default VestingItem;
