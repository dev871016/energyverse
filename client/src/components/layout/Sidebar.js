import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import DvrIcon from "@mui/icons-material/Dvr";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { alignProperty } from "@mui/material/styles/cssUtils";
import { Button, Container } from "@mui/material";

const Sidebar = () => {
  const navigate = useNavigate();
  const moveToHome = () => {
    navigate("/");
  };
  const moveToProjects = () => {
    navigate("/projects");
  };
  const moveToSwap = () => {
    navigate("/swap");
  };

  return (
    <Box
      sx={{
        display: "inline-block",
        width: "calc(max(12%, 200px))",
        height: "100vh",
        backgroundColor: "#00378B",
        color: "white",
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <List>
          <ListItem>
            <img src="./img/logo.png" alt="logo" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={moveToHome}>
              <ListItemIcon>
                <HomeIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={moveToProjects}>
              <ListItemIcon>
                <DvrIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={moveToSwap}>
              <ListItemIcon>
                <SwapHorizIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Swap" />
            </ListItemButton>
          </ListItem>
        </List>
        <Container sx={{ padding: "30px", alignItems: "center" }}>
          <Button>Hello</Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Sidebar;
