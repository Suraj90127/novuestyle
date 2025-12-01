const express = require("express");
const router = express.Router();
const headingsController = require("../../controllers/dashboard/heading5controller");

// Create a heading5
router.post("/save-heading5", headingsController.createHeading);

// Get all heading5
router.get("/get-heading5", headingsController.getHeadings);

// Get single heading5
router.get("/get-heading5/:id", headingsController.getHeadingById);

// Update heading5
router.put("/update-heading5/:id", headingsController.updateHeading);

// Delete heading5
router.delete("/delete-heading5/:id", headingsController.deleteHeading);

module.exports = router;
