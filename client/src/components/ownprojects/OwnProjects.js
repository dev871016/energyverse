import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Web3 } from "web3";
import { Alert, Box, Container, Snackbar } from "@mui/material";
import Project from "../abi/Project.json";
import ProjectItem from "./ProjectItem";
import Loading from "../utils/Loading";

const APIURL =
  "https://api.studio.thegraph.com/query/89356/subgraph2/version/latest";
const projectsQuery = `
  query MyQuery {
    createProjects(where: {owner: "var1"}) {
      project
      name
      location
      description
      owner
      totalBalance
    }
  }
`;

const OwnProjects = ({ wallet: { wallet } }) => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const getProjects = async () => {
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    if (!wallet) return;

    client
      .query({
        query: gql(projectsQuery.replace("var1", wallet)),
      })
      .then((data) => {
        setProjects(data.data.createProjects);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  };

  const withdrawReward = async (projectAddress, reward) => {
    if (!wallet) return;
    if (reward <= 0) return;
    const contractAddress = projectAddress;
    const contractABI = Project.abi;
    const web3Instance = new Web3(window.ethereum);
    const contract = new web3Instance.eth.Contract(
      contractABI,
      contractAddress
    );
    contract.methods
      .withdraw()
      .send({
        from: wallet,
      })
      .then((result) => {
        setIsSuccessAlertOpen(true);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (!wallet) navigate("/");

    setIsLoading(true);
    getProjects();
    const intervalId = setInterval(getProjects, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [wallet]);

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
            <Loading />
          ) : (
            projects.map((project, index) => (
              <ProjectItem
                key={index}
                project={project}
                wallet={wallet}
                withdrawReward={withdrawReward}
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
    </Box>
  );
};

OwnProjects.propTypes = {
  wallet: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  wallet: state.wallet,
});

export default connect(mapStateToProps)(OwnProjects);
