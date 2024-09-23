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
import ProjectFactory from "../abi/ProjectFactory.json";
import Project from "../abi/Project.json";
import AEV from "../abi/AEV.json";
import ProjectItem from "./ProjectItem";
import Loading from "../common/Loading";
import { shortenAddress } from "../utils/utils";
import env from "../utils/env";

const adminAddress = "0x467b69d4b71ccf5decc44b8e6c09eb0b2e247f58";
const ProjectFactoryContractAddress =
  "0xA08aC1f3F028655aa2d7B74730c172e0fbd3FcC0";
const AEVContractAddress = "0x0d227d43Db18361c5c67f5a217673baD86787E67";
const rpc = "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
const APIURL =
  "https://api.studio.thegraph.com/query/89356/subgraph2/version/latest";
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
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [totalBalance, setTotalBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
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

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleStakeDialogClose = () => {
    setIsStakeDialogOpen(false);
  };

  const handlePayDialogClose = () => {
    setIsPayDialogOpen(false);
  };

  const handleCreateDialogOK = async () => {
    const contractABI = ProjectFactory.abi;
    const web3Instance = new Web3(window.ethereum);
    const contract = new web3Instance.eth.Contract(
      contractABI,
      ProjectFactoryContractAddress
    );
    contract.methods
      .createProject(
        owner,
        name,
        location,
        description,
        10 ** 18 * totalBalance
      )
      .send({
        from: wallet,
      })
      .then((result) => {
        setIsSuccessAlertOpen(true);
      })
      .catch((error) => console.log(error));
    setIsCreateDialogOpen(false);
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

  const createProject = () => {
    if (wallet !== "") {
      setIsCreateDialogOpen(true);
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

  const distributeProfit = async (projectAddress) => {
    if (!wallet) return;
    const contractAddress = projectAddress;
    const contractABI = Project.abi;
    const web3Instance = new Web3(window.ethereum);
    const contract = new web3Instance.eth.Contract(
      contractABI,
      contractAddress
    );
    contract.methods
      .distributeProfit()
      .send({
        from: wallet,
      })
      .then((result) => {
        setIsSuccessAlertOpen(true);
      })
      .catch((error) => console.log(error));
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
        width: "calc(100% - max(12%, 200px))",
        backgroundColor: env.bgColor,
        height: "100vh",
        color: "white",
        boxSizing: "border-box",
        padding: "30px",
        overflow: "auto",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {wallet === adminAddress ? (
            <Container
              sx={{
                width: "90%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#1F79F3",
                  color: "white",
                  padding: "5px 12px",
                }}
                onClick={() => createProject()}
              >
                Create Project
              </Button>
            </Container>
          ) : null}
          {projects.map((project, index) => (
            <ProjectItem
              key={index}
              project={project}
              wallet={wallet}
              stakeToProject={stakeToProject}
              payForEnergy={payForEnergy}
              distributeProfit={distributeProfit}
            />
          ))}
        </Box>
      )}
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
      <Dialog open={isCreateDialogOpen} onClose={handleCreateDialogClose}>
        <DialogTitle>Create a new Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to create a new project?
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="owner"
            name="owner"
            label="Owner Address"
            type="string"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="name"
            name="name"
            label="Project Name"
            type="string"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="location"
            name="location"
            label="Location"
            type="string"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="string"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="totalBalance"
            name="totalBalance"
            label="Total Balance"
            type="number"
            value={totalBalance}
            onChange={(e) => setTotalBalance(e.target.value)}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogOK}>OK</Button>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isStakeDialogOpen} onClose={handleStakeDialogClose}>
        <DialogTitle>Stake to Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to stake to this project?
          </DialogContentText>
          <div>Current Project : {shortenAddress(currentProject)}</div>
          <div>Available Balance : {availableBalance / 10 ** 18} AEV</div>
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
          <div>Current Project : {shortenAddress(currentProject)}</div>
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
