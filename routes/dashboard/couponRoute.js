const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const couponController = require("../../controllers/dashboard/couponController");

router.post("/add-coupon", couponController.add_coupon);
router.get("/get-coupon", couponController.get_coupon);
router.delete("/delete-coupon/:id", couponController.coupon_delete);

module.exports = router;
