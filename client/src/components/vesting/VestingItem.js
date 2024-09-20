import React, { useState, useEffect } from "react";
import { Button, Container } from "@mui/material";
import { Web3 } from "web3";
import TokenVesting from "../abi/TokenVesting.json";
import ScheduleItem from "./ScheduleItem";

const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

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
    <Container
      style={{
        borderRadius: "20px",
        borderWidth: "1px",
        borderColor: "white",
        borderStyle: "solid",
        fontSize: "20px",
      }}
    >
      <div>vesting : {vesting}</div>
      <div>name : {name}</div>
      {schedules.map((schedule, index) => (
        <ScheduleItem
          key={index}
          vesting={vesting}
          scheduleId={schedule}
          wallet={wallet}
          release={release}
        />
      ))}
      <div>vestingSchedulesCount : {vestingSchedulesCount}</div>
      <Button onClick={() => createVestingSchedule(vesting)}>
        Create Schedule
      </Button>
    </Container>
  );
};

export default VestingItem;
