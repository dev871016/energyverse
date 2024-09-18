import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CircularProgress from "@mui/material/CircularProgress";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const APIURL = "https://api.studio.thegraph.com/query/89145/aev/version/latest";

const transactionsQuery = `
  query MyQuery {
    transfers(orderBy: blockNumber, first: 10) {
      transactionHash
      value
      from
      to
      blockTimestamp
      blockNumber
    }
  }
`;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTransactions = async () => {
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    client
      .query({
        query: gql(transactionsQuery),
      })
      .then((data) => {
        setTransactions(data.data.transfers);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  };

  useEffect(() => {
    getTransactions();
    setInterval(getTransactions, 5000);
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
            transactions.map((transaction, index) => (
              <Container
                key={index}
                style={{
                  borderRadius: "20px",
                  borderWidth: "1px",
                  borderColor: "white",
                  borderStyle: "solid",
                  fontSize: "20px",
                }}
              >
                <div>from : {transaction.from}</div>
                <div>to : {transaction.to}</div>
                <div>amount : {transaction.value}</div>
                <div>blockNumber : {transaction.blockNumber}</div>
                <div>transactionHash : {transaction.transactionHash}</div>
                <div>
                  blockTimestamp :{" "}
                  {new Date(
                    1000 * Number(transaction.blockTimestamp)
                  ).toGMTString()}
                </div>
              </Container>
            ))
          )}
        </Container>
      }
    </Box>
  );
};

export default Transactions;
