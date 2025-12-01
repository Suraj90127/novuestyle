const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

// const authMiddleware = require("../middleware/authMiddleware");
const metaController = require("../controllers/metaController");

router.post("/meta/purchase", metaController.sendPurchaseEvent);

module.exports = router;
