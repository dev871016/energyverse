import { Container, TextField } from "@mui/material";

const SwapInput = ({ isBuyAEV, value, setValue }) => {
  return (
    <Container sx={{ display: "flex", flexDirection: "row", height: "45px" }}>
      <div
        style={{
          display: "flex",
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          borderStyle: "solid",
          borderColor: "#7E80E7",
          width: "40%",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
        }}
      >
        {isBuyAEV ? (
          <img src="img/USDC.svg" alt="chain" width={20} />
        ) : (
          <img src="img/AEV.svg" alt="chain" width={20} />
        )}
        {isBuyAEV ? <span>USDC</span> : "AEV"}
      </div>
      <TextField
        autoFocus
        required
        margin="dense"
        id="srcAmount"
        name="srcAmount"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        variant="standard"
        InputProps={{
          sx: {
            color: "white", // Set text color to white
            "&.MuiInputBase-root:hover:before": {
              borderBottom: "none", // Remove underline on hover
            },
            "&.MuiInputBase-root:before": {
              borderBottom: "none", // Remove default underline
            },
            "&.MuiInputBase-root:after": {
              borderBottom: "none", // Remove underline after focus
            },
          },
        }}
        sx={{
          paddingLeft: "10px",
          borderColor: "#7E80E7",
          borderStyle: "solid",
          borderLeft: "none",
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          borderWidth: "3px",
          margin: 0,
          display: "flex",
          justifyContent: "center",
        }}
      />
    </Container>
  );
};

export default SwapInput;
