const express = require("express");
const validateData = require("../custom middleware/validateData");
const actionDb = require("../../data/helpers/actionModel");

const router = express.Router();

// GET all actions for the DB
router.get("/", (req, res) => {
  actionDb
    .get()
    .then(actions => res.status(200).json(actions))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error_message: "Something happened when fetching actions."
      });
    });
});

// get action by ID
router.get("/:id", validateActiontId, (req, res) => {
  actionDb
    .get(req.action.id)
    .then(action => res.status(200).json(action))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error_message: `Something happened when fetching action ID: ${req.action.id}.`
      });
    });
});

// PUT update an existing action

// DELETE remove an action

///////// CUSTOM MIDDLEWARE //////////
function validateActiontId(req, res, next) {
  actionDb
    .get(req.params.id)
    .then(action => {
      if (action) {
        req.action = action;
        next();
      } else {
        res.status(404).json({
          error_message: `Action ID: ${req.params.id} was not found.`
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error_message: "Something happened when validating action ID."
      });
    });
}

module.exports = router;
