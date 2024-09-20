import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Web3 } from "web3";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
} from "@mui/material";
import TokenVesting from "../abi/TokenVesting.json";
import AEV from "../abi/AEV.json";
import VestingItem from "./VestingItem";
import Loading from "../utils/Loading";

const adminAddress = "0x467b69d4b71ccf5decc44b8e6c09eb0b2e247f58";
const AEVContractAddress = "0x0d227d43Db18361c5c67f5a217673baD86787E67";
const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
const APIURL =
  "https://api.studio.thegraph.com/query/89356/subgraph1/version/latest";
const projectsQuery = `
  query MyQuery {
    createTokenVestings {
      tokenVesting
    }
  }
`;

const Vesting = ({ wallet: { wallet } }) => {
  const [name, setName] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [start, setStart] = useState(0);
  const [cliff, setCliff] = useState(0);
  const [duration, setDuration] = useState(0);
  const [slicePeriodSeconds, setSlicePeriodSeconds] = useState(0);
  const [amount, setAmount] = useState(0);
  const [vesting, setVesting] = useState([]);
  const [currentVesting, setCurrentVesting] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isCreateScheduleDialogOpen, setIsCreateScheduleDialogOpen] =
    React.useState(false);
  const [isInfoAlertOpen, setIsInfoAlertOpen] = React.useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = React.useState(false);

  const handleInfoAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsInfoAlertOpen(false);
  };

  const handleSuccessAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSuccessAlertOpen(false);
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCreateScheduleDialogClose = () => {
    setIsCreateScheduleDialogOpen(false);
  };

  const handleCreateDialogOK = async () => {
    const contractABI = AEV.abi;
    const web3Instance = new Web3(window.ethereum);
    const contract = new web3Instance.eth.Contract(
      contractABI,
      AEVContractAddress
    );
    contract.methods
      .createTokenVesting(name, 10 ** 18 * amount)
      .send({
        from: wallet,
      })
      .then((result) => {
        setIsSuccessAlertOpen(true);
      })
      .catch((error) => console.log(error));
    setIsCreateDialogOpen(false);
  };

  const handleCreateScheduleDialogOK = async () => {
    if (start <= 0 || !start) return;
    if (cliff <= 0 || !cliff) return;
    if (duration <= 0 || !duration) return;
    if (slicePeriodSeconds <= 0 || !slicePeriodSeconds) return;
    if (amount <= 0 || !amount) return;

    const contractABI = TokenVesting.abi;
    const web3Instance = new Web3(window.ethereum);
    const contract = new web3Instance.eth.Contract(contractABI, currentVesting);
    var blockInfo = await web3.eth.getBlock();
    console.log(blockInfo);
    contract.methods
      .createVestingSchedule(
        beneficiary,
        Number(start) + Number(blockInfo.timestamp),
        cliff,
        duration,
        slicePeriodSeconds,
        false,
        10 ** 18 * amount
      )
      .send({
        from: wallet,
      })
      .then((result) => {
        setIsSuccessAlertOpen(true);
      })
      .catch((error) => console.log(error));
    setIsCreateScheduleDialogOpen(false);
  };

  const release = async (vesting, releaseScheduleId, releaseAmount) => {
    if (!wallet) return;
    const contractABI = TokenVesting.abi;
    const web3Instance = new Web3(window.ethereum);
    const contract = new web3Instance.eth.Contract(contractABI, vesting);
    contract.methods
      .release(releaseScheduleId, releaseAmount)
      .send({
        from: wallet,
      })
      .then((result) => {
        setIsSuccessAlertOpen(true);
      })
      .catch((error) => console.log(error));
  };

  const getVesting = async () => {
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    client
      .query({
        query: gql(projectsQuery),
      })
      .then((data) => {
        setVesting(data.data.createTokenVestings);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  };

  const createVestingSchedule = async (vesting) => {
    if (wallet !== "") {
      setAmount(0);
      setCurrentVesting(vesting);
      setIsCreateScheduleDialogOpen(true);
    } else {
      setIsInfoAlertOpen(true);
    }
  };

  const createVesting = () => {
    if (wallet !== "") {
      setIsCreateDialogOpen(true);
    } else {
      setIsInfoAlertOpen(true);
    }
  };

  useEffect(() => {
    getVesting();
    const intervalId = setInterval(getVesting, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "inline-block",
        position: "absolute",
        width: "calc(100% - max(12%, 200px))",
        height: "100vh",
        backgroundColor: "#0A1223",
        color: "white",
        overflow: "auto",
      }}
    >
      {wallet === adminAddress ? (
        <Button onClick={() => createVesting()}>Create Vesting</Button>
      ) : null}
      {
        <Container
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
            padding: "100px",
          }}
        >
          {isLoading ? (
            <Loading />
          ) : (
            vesting.map((tokenVesting, index) => (
              <VestingItem
                key={index}
                vesting={tokenVesting.tokenVesting}
                wallet={wallet}
                createVestingSchedule={createVestingSchedule}
                release={release}
              />
            ))
          )}
        </Container>
      }
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isInfoAlertOpen}
        autoHideDuration={3000}
        onClose={handleInfoAlertClose}
      >
        <Alert
          onClose={handleInfoAlertClose}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Please connect your wallet!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isSuccessAlertOpen}
        autoHideDuration={3000}
        onClose={handleSuccessAlertClose}
      >
        <Alert
          onClose={handleSuccessAlertClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Transaction success!
        </Alert>
      </Snackbar>
      <Dialog
        open={isCreateScheduleDialogOpen}
        onClose={handleCreateScheduleDialogClose}
      >
        <DialogTitle>Create a new Vesting Schedule</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to create a new vesting schedule?
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="beneficiary"
            name="beneficiary"
            label="Beneficiary Address"
            type="string"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="start"
            name="start"
            label="Start"
            type="number"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="cliff"
            name="cliff"
            label="Cliff"
            type="number"
            value={cliff}
            onChange={(e) => setCliff(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="duration"
            name="duration"
            label="Duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="slicePeriodSeconds"
            name="slicePeriodSeconds"
            label="Slice Period Seconds"
            type="number"
            value={slicePeriodSeconds}
            onChange={(e) => setSlicePeriodSeconds(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="amount"
            name="amount"
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateScheduleDialogOK}>OK</Button>
          <Button onClick={handleCreateScheduleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isCreateDialogOpen} onClose={handleCreateDialogClose}>
        <DialogTitle>Create a new Vesting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to create a new vesting?
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Vesting Name"
            type="string"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="amount"
            name="amount"
            label="Vesting Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogOK}>OK</Button>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

Vesting.propTypes = {
  wallet: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  wallet: state.wallet,
});

export default connect(mapStateToProps)(Vesting);
