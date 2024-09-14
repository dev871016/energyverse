import React from "react";
import Box from "@mui/material/Box";

const Landing = () => {
  return (
    <Box
      sx={{
        display: "inline-block",
        position: "absolute",
        width: "calc(100% - max(12%, 200px))",
        height: "100vh",
        backgroundColor: "#0A1223",
        color: "white",
      }}
    >
      <h1>This is Landing Page</h1>
    </Box>
  );
};

export default Landing;
