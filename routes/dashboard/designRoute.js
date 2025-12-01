const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const designController = require("../../controllers/dashboard/designController");

router.post("/design-add", authMiddleware, designController.add_design);
router.post(
  "/delete_design/:id",
  authMiddleware,
  designController.delete_design
);
router.get("/design-get", authMiddleware, designController.get_design);

module.exports = router;
