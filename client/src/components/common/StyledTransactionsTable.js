import {
  Button,
  Container,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { styled } from "@mui/material/styles";

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

const StyledTransactionsTable = ({
  titles,
  titlesShown,
  contents,
  curPage,
  previousDisabled,
  nextDisabled,
  goToPreviousPage,
  goToNextPage,
}) => {
  return (
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
      <Container sx={{ height: 680 }}>
        <Table
          sx={{ minWidth: 700, color: "white" }}
          aria-label="customized table"
        >
          <TableHead>
            <StyledTableRow>
              {titlesShown.map((title, index) => (
                <StyledTableCell key={index}>{title}</StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {contents.map((content, index) => (
              <StyledTableRow key={index}>
                {titles.map((title, index) => (
                  <StyledTableCell key={index}>
                    {content[title]}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
      <Container
        sx={{ display: "flex", justifyContent: "center", gap: "20px" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          Page : {curPage + 1}
        </div>
        <Button onClick={goToPreviousPage} disabled={previousDisabled}>
          <ArrowBackIosNewIcon />
        </Button>
        <Button onClick={goToNextPage} disabled={nextDisabled}>
          <ArrowForwardIosIcon />
        </Button>
      </Container>
    </Container>
  );
};

export default StyledTransactionsTable;
