import React, { useState, useEffect } from "react";
import { Web3 } from "web3";
import { Button, Container } from "@mui/material";
import TokenVesting from "../abi/TokenVesting.json";

const adminAddress = "0x467b69d4b71ccf5decc44b8e6c09eb0b2e247f58";
const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
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
    <Container
      style={{
        borderRadius: "20px",
        borderWidth: "1px",
        borderColor: "white",
        borderStyle: "solid",
        fontSize: "20px",
      }}
    >
      <div>scheduleId : {scheduleId}</div>
      <div>beneficiary : {schedule.beneficiary}</div>
      <div>cliff : {Number(schedule.cliff)}</div>
      <div>start : {Number(schedule.start)}</div>
      <div>duration : {Number(schedule.duration)}</div>
      <div>slicePeriodSeconds : {Number(schedule.slicePeriodSeconds)}</div>
      <div>amountTotal : {Number(schedule.amountTotal) / 10 ** 18}</div>
      <div>releasableAmount : {releasableAmount / 10 ** 18}</div>
      {((wallet + "").toUpperCase() ===
        (schedule.beneficiary + "").toUpperCase() ||
        (wallet + "").toUpperCase() === adminAddress.toUpperCase()) && (
        <Button onClick={() => release(vesting, scheduleId, releasableAmount)}>
          Release
        </Button>
      )}
    </Container>
  );
};

export default ScheduleItem;
