import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
} from "@mui/material";
import { Web3 } from "web3";
import Project from "../abi/Project.json";
import AEV from "../abi/AEV.json";
import ProjectItem from "./ProjectItem";

const AEVContractAddress = "0x1991A16B81E43E5aC96E9eFd6f05E60816B57c2a";
const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
const APIURL =
  "https://api.studio.thegraph.com/query/89145/project/version/latest";
const projectsQuery = `
  query MyQuery {
    createProjects(orderBy: blockNumber, first: 10) {
      project
      name
      location
      description
      owner
      totalBalance
    }
  }
`;

const Projects = ({ wallet: { wallet } }) => {
  const [amount, setAmount] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isStakeDialogOpen, setIsStakeDialogOpen] = React.useState(false);
  const [isPayDialogOpen, setIsPayDialogOpen] = React.useState(false);
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

  const handleStakeDialogClose = () => {
    setIsStakeDialogOpen(false);
  };

  const handlePayDialogClose = () => {
    setIsPayDialogOpen(false);
  };

  const handleStakeDialogOK = async () => {
    if (!amount) return;
    if (amount < 0) return;
    const contractABI = AEV.abi;
    const web3Instance = new Web3(window.ethereum);
    const contract = new web3Instance.eth.Contract(
      contractABI,
      AEVContractAddress
    );
    contract.methods
      .stakeToProject(currentProject, 10 ** 18 * amount)
      .send({
        from: wallet,
      })
      .then((result) => {
        setIsSuccessAlertOpen(true);
      })
      .catch((error) => console.log(error));
    setIsStakeDialogOpen(false);
  };

  const handlePayDialogOK = async () => {
    if (!amount) return;
    if (amount < 0) return;
    const contractABI = AEV.abi;
    const web3Instance = new Web3(window.ethereum);
    const contract = new web3Instance.eth.Contract(
      contractABI,
      AEVContractAddress
    );
    contract.methods
      .payEnergy(currentProject, 10 ** 18 * amount)
      .send({
        from: wallet,
      })
      .then((result) => {
        setIsSuccessAlertOpen(true);
      })
      .catch((error) => console.log(error));
    setIsPayDialogOpen(false);
  };

  const getProjects = async () => {
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    client
      .query({
        query: gql(projectsQuery),
      })
      .then((data) => {
        setProjects(data.data.createProjects);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  };

  const stakeToProject = async (projectAddress) => {
    if (wallet !== "") {
      setAmount(0);
      setCurrentProject(projectAddress);
      const contractAddress = projectAddress;
      const contractABI = Project.abi;
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const result = await contract.methods.balances(projectAddress).call();
      setAvailableBalance(Number(result));
      setIsStakeDialogOpen(true);
    } else {
      setIsInfoAlertOpen(true);
    }
  };

  const payForEnergy = async (projectAddress) => {
    if (wallet !== "") {
      setAmount(0);
      setCurrentProject(projectAddress);
      setIsPayDialogOpen(true);
    } else {
      setIsInfoAlertOpen(true);
    }
  };

  useEffect(() => {
    getProjects();
    const intervalId = setInterval(getProjects, 5000);

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
            <CircularProgress />
          ) : (
            projects.map((project, index) => (
              <ProjectItem
                key={index}
                project={project}
                stakeToProject={stakeToProject}
                payForEnergy={payForEnergy}
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
      <Dialog open={isStakeDialogOpen} onClose={handleStakeDialogClose}>
        <DialogTitle>Stake to Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to stake to this project?
          </DialogContentText>
          <div>currentProject : {currentProject}</div>
          <div>availableBalance : {availableBalance / 10 ** 18}</div>
          <TextField
            autoFocus
            required
            margin="dense"
            id="amount"
            name="amount"
            label="Amount to stake"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStakeDialogOK}>OK</Button>
          <Button onClick={handleStakeDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isPayDialogOpen} onClose={handlePayDialogClose}>
        <DialogTitle>Pay for Energy</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure to pay for energy?</DialogContentText>
          <div>currentProject : {currentProject}</div>
          <TextField
            autoFocus
            required
            margin="dense"
            id="amount"
            name="amount"
            label="Amount to pay"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePayDialogOK}>OK</Button>
          <Button onClick={handlePayDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

Projects.propTypes = {
  wallet: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  wallet: state.wallet,
});

export default connect(mapStateToProps)(Projects);
