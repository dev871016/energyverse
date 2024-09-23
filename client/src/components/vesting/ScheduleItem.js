import React, { useState, useEffect } from "react";
import { Web3 } from "web3";
import { styled } from "@mui/material/styles";
import { Button, TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TokenVesting from "../abi/TokenVesting.json";
import { shortenAddress } from "../utils/utils";

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

const adminAddress = "0x467b69d4b71ccf5decc44b8e6c09eb0b2e247f58";
const rpc = "https://ethereum-sepolia.blockpi.network/v1/rpc/public";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const ScheduleItem = ({ vesting, scheduleId, wallet, release }) => {
  const [schedule, setSchedule] = useState("");
  const [releasableAmount, setReleasableAmount] = useState(0);
  const getInfo = async () => {
    const contractAddress = vesting;
    const contractABI = TokenVesting.abi;
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    contract.methods
      .getVestingSchedule(scheduleId)
      .call()
      .then((result) => {
        setSchedule(result);
      })
      .catch((error) => console.log(error));
    contract.methods
      .computeReleasableAmount(scheduleId)
      .call()
      .then((result) => {
        setReleasableAmount(Number(result));
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <StyledTableRow>
      <StyledTableCell>{shortenAddress(scheduleId)}</StyledTableCell>
      <StyledTableCell>
        {schedule.beneficiary ? shortenAddress(schedule.beneficiary) : ""}
      </StyledTableCell>
      <StyledTableCell>
        {schedule.cliff ? Number(schedule.cliff) : 0}
      </StyledTableCell>
      <StyledTableCell>
        {schedule.duration ? Number(schedule.duration) : 0}
      </StyledTableCell>
      <StyledTableCell>
        {schedule.slicePeriodSeconds ? Number(schedule.slicePeriodSeconds) : 0}
      </StyledTableCell>
      <StyledTableCell>
        {schedule.amountTotal ? Number(schedule.amountTotal) / 10 ** 18 : 0}
      </StyledTableCell>
      <StyledTableCell>
        {releasableAmount ? Number(releasableAmount / 10 ** 18).toFixed(0) : 0}
      </StyledTableCell>
      <StyledTableCell>
        {((wallet + "").toUpperCase() ===
          (schedule.beneficiary + "").toUpperCase() ||
          (wallet + "").toUpperCase() === adminAddress.toUpperCase()) && (
          <Button
            sx={{
              backgroundColor: "#1F79F3",
              color: "white",
              padding: "5px 12px",
            }}
            onClick={() => release(vesting, scheduleId, releasableAmount)}
          >
            Release
          </Button>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ScheduleItem;
