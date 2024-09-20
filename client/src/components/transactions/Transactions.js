import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Loading from "../utils/Loading";

const APIURL =
  "https://api.studio.thegraph.com/query/89356/subgraph1/version/latest";

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
            gap: "10px",
            padding: "100px",
          }}
        >
          {isLoading ? (
            <Loading />
          ) : (
            transactions.map((transaction, index) => (
              <Container
                key={index}
                style={{
                  borderRadius: "20px",
                  borderWidth: "1px",
                  borderColor: "white",
                  borderStyle: "solid",
                  fontSize: "10px",
                }}
              >
                <span>from : {transaction.from}</span>
                <span>to : {transaction.to}</span>
                <span>amount : {transaction.value}</span>
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
