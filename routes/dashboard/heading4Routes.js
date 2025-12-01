const express = require("express");
const router = express.Router();
const headingsController = require("../../controllers/dashboard/heading4controller");

// Create a heading4
router.post("/save-heading4", headingsController.createHeading);

// Get all heading4
router.get("/get-heading4", headingsController.getHeadings);

// Get single heading4
router.get("/get-heading4/:id", headingsController.getHeadingById);

// Update heading4
router.put("/update-heading4/:id", headingsController.updateHeading);

// Delete heading4
router.delete("/delete-heading4/:id", headingsController.deleteHeading);

module.exports = router;
