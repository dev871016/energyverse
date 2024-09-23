import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "start",
  justifyContent: "center",
  flexWrap: "nowrap",
  width: "100wh",
  height: "100vh",
  maxWidth: "100wh",
  margin: 0,
  padding: 0,
}));

export default StyledBox;
