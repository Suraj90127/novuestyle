const router = require("express").Router();
const customerAuthController = require("../../controllers/home/customerAuthController");
const { authMiddleware } = require("../../middlewares/authMiddleware");
router.post(
  "/customer/customer-register",
  customerAuthController.customer_register
);
router.post("/customer/customer-login", customerAuthController.customer_login);
router.get("/customer/logout", customerAuthController.customer_logout);

router.post("/forgot-password", customerAuthController.sendOtp);
router.post(
  "/reset-password",
  customerAuthController.verifyOtpAndResetPassword
);
router.get("/useringfo", authMiddleware, customerAuthController.getCurrentUser);
module.exports = router;

