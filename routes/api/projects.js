const express = require("express");
const router = express.Router();

const Project = require("../../models/Project");

// @route    POST api/projects
// @desc     Create a projects
// @access   Private
router.post("/", async (req, res) => {
  try {
    const newProject = new Project({
      name: req.body.name,
      address: req.body.address,
      totalBalance: req.body.totalBalance,
      description: req.body.description,
      location: req.body.location,
    });

    const project = await newProject.save();

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/projects
// @desc     Get all projects
// @access   Private
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
