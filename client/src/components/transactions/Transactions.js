import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Loading from "../common/Loading";
import StyledTransactionsTable from "../common/StyledTransactionsTable";
import { shortenAddress, shortenHash } from "../utils/utils";
import env from "../utils/env";

const APIURL =
  "https://api.studio.thegraph.com/query/89356/subgraph1/version/latest";

const transactionsQuery = `
  query MyQuery {
    transfers(first: 11, orderDirection: desc, orderBy: blockNumber, skip: var1) {
      transactionHash
      value
      from
      to
      blockTimestamp
      blockNumber
    }
  }
`;

const titles = [
  "transactionHash",
  "blockNumber",
  "blockTimestamp",
  "from",
  "to",
  "value",
];

const titlesShown = [
  "Transaction Hash",
  "Block",
  "Age",
  "From",
  "To",
  "Amount",
];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [curPage, setCurPage] = useState(0);

  const getTransactions = async () => {
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    client
      .query({
        query: gql(transactionsQuery.replace("var1", String(10 * curPage))),
      })
      .then((data) => {
        setData(
          data.data.transfers.map((transaction) => {
            return {
              ...transaction,
              transactionHash: shortenHash(transaction.transactionHash),
              from: shortenAddress(transaction.from),
              to: shortenAddress(transaction.to),
              value: (transaction.value / 10 ** 16).toFixed(2) / 100,
              blockTimestamp: new Date(1000 * transaction.blockTimestamp)
                .toJSON()
                .substring(0, 19)
                .split("T")
                .join(" "),
            };
          })
        );
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  };

  const goToPreviousPage = () => {
    setIsLoading(true);
    setCurPage(curPage - 1);
  };

  const goToNextPage = () => {
    setIsLoading(true);
    setCurPage(curPage + 1);
  };

  const refreshData = () => {
    console.log(data.length);
    setTransactions(data.slice(0, 10));
  };

  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    refreshData();
    setIsLoading(false);
  }, [data]);

  useEffect(() => {
    getTransactions();
  }, [curPage]);

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
            gap: "10px",
            padding: "100px",
          }}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <StyledTransactionsTable
              titles={titles}
              titlesShown={titlesShown}
              contents={transactions}
              curPage={curPage}
              previousDisabled={isLoading || curPage <= 0}
              nextDisabled={isLoading || !(data.length > 10)}
              goToPreviousPage={goToPreviousPage}
              goToNextPage={goToNextPage}
            />
          )}
        </Container>
      }
    </Box>
  );
};

export default Transactions;
