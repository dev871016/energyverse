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
import ProjectItem from "./ProjectItem";
import Loading from "../common/Loading";
import Project from "../abi/Project.json";
import env from "../utils/env";

const APIURL =
  "https://api.studio.thegraph.com/query/89356/subgraph1/version/latest";

const projectsQuery = `
  query MyQuery {
    stakeToProjects(where: {staker: "var1"}) {
      project
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
        const temp = data.data.stakeToProjects.map((value) => value.project);
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
        width: "calc(100% - max(12%, 200px))",
        backgroundColor: env.bgColor,
        height: "100vh",
        color: "white",
        boxSizing: "border-box",
        padding: "30px",
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
                  color: "white",
                }}
                aria-label="customized table"
              >
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Project</StyledTableCell>
                    <StyledTableCell>Staked Amount</StyledTableCell>
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
