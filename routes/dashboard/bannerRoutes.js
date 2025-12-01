const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadBanner = require("../../controllers/dashboard/uploadBanner");
const upload = multer({ dest: "uploads/" }); // Temporary storage location

router.post("/upload", upload.single("images"), uploadBanner.add_banner);
router.get("/get-banner", uploadBanner.get_banner);
router.delete("/banner-delete/:id", uploadBanner.banner_delete);

module.exports = router;
