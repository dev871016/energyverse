import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Web3 } from "web3";
import { styled } from "@mui/material/styles";
import {
  Alert,
  Box,
  Container,
  Snackbar,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Project from "../abi/Project.json";
import ProjectItem from "./ProjectItem";
import Loading from "../common/Loading";
import env from "../utils/env";

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
        width: "calc(100% - max(12%, 200px))",
        height: "100vh",
        backgroundColor: env.bgColor,
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
            <Container
              sx={{
                backgroundColor: "#0A224F",
                borderRadius: "30px",
                borderColor: "#3394C4",
                borderStyle: "solid",
                padding: "10px",
                paddingTop: "30px",
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
                    <StyledTableCell>Project</StyledTableCell>
                    <StyledTableCell>Reward to Withdraw</StyledTableCell>
                    <StyledTableCell>Withdraw Reward</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project, index) => (
                    <ProjectItem
                      key={index}
                      project={project}
                      wallet={wallet}
                      withdrawReward={withdrawReward}
                    />
                  ))}
                </TableBody>
              </Table>
            </Container>
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
