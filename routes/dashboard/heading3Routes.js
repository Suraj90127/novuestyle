const express = require("express");
const router = express.Router();
const headingsController = require("../../controllers/dashboard/heading3controller");

// Create a heading3
router.post("/save-heading3", headingsController.createHeading);

// Get all heading3
router.get("/get-heading3", headingsController.getHeadings);

// Get single heading3
router.get("/get-heading3/:id", headingsController.getHeadingById);

// Update heading3
router.put("/update-heading3/:id", headingsController.updateHeading);

// Delete heading3
router.delete("/delete-heading3/:id", headingsController.deleteHeading);

module.exports = router;
