import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { getProjects } from "../../actions/project";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Projects = ({ getProjects, project: { projects } }) => {
  useEffect(() => {
    getProjects();
  }, [getProjects]);

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
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          padding: "100px",
        }}
      >
        {projects.map((project) => (
          <Container key={project._id} sx={{ display: "flex" }}>
            <Container
              sx={{
                width: "40%",
                height: "150px",
                borderRadius: "20px",
                borderWidth: "1px",
                borderColor: "white",
                borderStyle: "solid",
                padding: "20px",
                fontSize: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontWeight: 700 }}>{project.name}</div>
              <div style={{ display: "flex" }}>
                <span style={{ alignItems: "center", display: "flex" }}>
                  <LocationOnIcon />
                </span>
                <span>{project.location}</span>
              </div>
              <div>Total price : {project.totalBalance} AEV</div>
            </Container>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "25px" }}>Description</div>
                <div style={{ fontSize: "20px" }}>{project.description}</div>
              </div>
              <Button
                style={{
                  width: "100px",
                  height: "45px",
                  borderRadius: "20px",
                  borderWidth: "1px",
                  borderColor: "white",
                  borderStyle: "solid",
                }}
              >
                <div style={{ color: "white", fontSize: "20px" }}>Stake</div>
              </Button>
            </Container>
          </Container>
        ))}
      </Container>
    </Box>
  );
};

Projects.propTypes = {
  getProjects: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  project: state.project,
});

export default connect(mapStateToProps, { getProjects })(Projects);
