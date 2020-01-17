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
router.get("/:id", validateProjectId, (req, res) => {
  projectDb
    .get(req.project.id)
    .then(project => res.status(200).json(project))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error_message: `Something happened when fetching project ${req.project.id}.`
      });
    });
});

// GET actions by project
router.get("/:id/actions", validateProjectId, (req, res) => {
  projectDb
    .getProjectActions(req.project.id)
    .then(actions => res.status(200).json(actions))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error_message: `Something happened when fetching actions for project ${req.project.id}.`
      });
    });
});

// POST submit a new project
router.post(
  "/",
  validateData("name"),
  validateData("description"),
  (req, res) => {
    projectDb
      .insert(req.body)
      .then(newProject => res.status(201).json(newProject))
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error_message: "Something happened when submitting a new project."
        });
      });
  }
);

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

function validateData(prop) {
  return function(req, res, next) {
    if (Object.entries(req.body).length === 0) {
      res
        .status(400)
        .json({ message: "Missing ALL data needed to submit a new item." });
    } else if (!req.body[prop]) {
      res.status(400).json({ message: `Missing required ${prop} field.` });
    } else {
      next();
    }
  };
}

module.exports = router;
