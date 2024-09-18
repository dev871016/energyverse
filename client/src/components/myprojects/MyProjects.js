import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Snackbar,
} from "@mui/material";
import { Web3 } from "web3";
import Project from "../abi/Project.json";
import ProjectItem from "./ProjectItem";

const APIURL = "https://api.studio.thegraph.com/query/89145/aev/version/latest";

const projectsQuery = `
  query MyQuery {
    stateToProjects(where: {staker: "var1"}) {
      project
    }
  }
`;

const MyProjects = ({ wallet: { wallet } }) => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

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
        const temp = data.data.stateToProjects.map((value) => value.project);
        setProjects(
          temp.filter((value, index) => temp.indexOf(value) === index)
        );
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
            <CircularProgress />
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

MyProjects.propTypes = {
  wallet: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  wallet: state.wallet,
});

export default connect(mapStateToProps)(MyProjects);
