const express = require("express");
const router = express.Router();
const headingsController = require("../../controllers/dashboard/heading2controller");

router.post("/save-heading2", headingsController.createHeading);

router.get("/get-heading2", headingsController.getHeadings);

router.get("/get-heading2/:id", headingsController.getHeadingById);

router.put("/update-heading2/:id", headingsController.updateHeading);

router.delete("/delete-heading2/:id", headingsController.deleteHeading);

module.exports = router;
