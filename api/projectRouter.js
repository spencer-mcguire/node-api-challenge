const express = require("express");
const projectDb = require("../data/helpers/projectModel");

const router = express.Router();

// GET all projects
router.get("/", (req, res) => {
  projectDb
    .get()
    .then(projects => {
      if (projects) {
        res.status(200).json(projects);
      } else {
        res.status(404).json([]);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error_message: "Something happened when fetching projects."
      });
    });
});

// GET project by ID
router.get("/", (req, res) => {});

// GET actions by project
router.get("/", (req, res) => {});

// POST submit a new project

// PUT update a project

// DELETE remove a project

// POST submit a new action for a project

//////// CUSTOM MIDDLEWARE ////////

function validateProjectId(req, res, next) {
  projectDb
    .get(req.params.id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(404).json({
          error_message: `Project ID: ${req.params.id} was not found.`
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error_message: "Something happened when validating project ID."
      });
    });
}

module.exports = router;
