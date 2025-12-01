const express = require("express");
const router = express.Router();
const headingsController = require("../../controllers/dashboard/heading1controller");

router.post("/save-heading", headingsController.createHeading);

router.get("/get-heading", headingsController.getHeadings);

router.get("/get-heading/:id", headingsController.getHeadingById);

router.put("/update-heading/:id", headingsController.updateHeading);

router.delete("/delete-heading/:id", headingsController.deleteHeading);

module.exports = router;
