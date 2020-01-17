const express = require("express");
const validateData = require("../custom middleware/validateData");
const projectDb = require("../../data/helpers/projectModel");
const actionDb = require("../../data/helpers/actionModel");

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
        error_message: `Something happened when fetching project: ${req.project.id}.`
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
        error_message: `Something happened when fetching actions for project: ${req.project.id}.`
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
router.put(
  "/:id",
  validateProjectId,
  validateData("name"),
  validateData("description"),
  (req, res) => {
    console.log(req.project.id, req.body);
    projectDb
      .update(req.project.id, req.body)
      .then(updated => res.status(201).json(updated))
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error_message: `Something happened when updating project: ${req.project.id}.`
        });
      });
  }
);

// DELETE remove a project
router.delete("/:id", validateProjectId, (req, res) => {
  projectDb
    .remove(req.project.id)
    .then(records =>
      res.status(200).json({ records_deleted: records, deleted: req.project })
    )
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error_message: `Something happened when deleting project: ${req.project.id}.`
      });
    });
});

// POST submit a new action for a project
router.post(
  "/:id/actions",
  validateProjectId,
  validateData("description"),
  validateData("notes"),
  (req, res) => {
    actionDb
      .insert({ project_id: req.project.id, ...req.body })
      .then(newAction => res.status(201).json(newAction))
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error_message: `Something happened when adding an action for project: ${req.project.id}.`
        });
      });
  }
);

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
