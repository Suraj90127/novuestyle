const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const giftController = require("../../controllers/dashboard/giftController");

router.post("/gift-add", authMiddleware, giftController.add_gift);
router.get("/gifts-get", giftController.gifts_get);
router.get("/gift-get/:giftId", authMiddleware, giftController.gift_get);
router.post("/gift-update", authMiddleware, giftController.gift_update);
router.post(
  "/gift-image-update",
  authMiddleware,
  giftController.gift_image_update
);
router.delete(
  "/gift-delete/:id",
  //   authMiddleware,
  giftController.delete_gift
);

module.exports = router;
