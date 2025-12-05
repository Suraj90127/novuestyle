const router = require("express").Router();
const customerAuthController = require("../../controllers/home/customerAuthController");
const { authMiddleware } = require("../../middlewares/authMiddleware");
router.post(
  "/customer/customer-register",
  customerAuthController.customer_register
);
router.post("/customer/customer-login", customerAuthController.customer_login);
router.post('/customer/verify-otp', customerAuthController.verify_otp); // Fixed path
router.post('/customer/resend-otp', customerAuthController.resend_otp); // Fixed path
router.get("/useringfo", authMiddleware, customerAuthController.getCurrentUser);

router.get("/customer/logout", customerAuthController.customer_logout);

router.post("/forgot-password", customerAuthController.sendOtp);
router.post(
  "/reset-password",
  customerAuthController.verifyOtpAndResetPassword
);

router.get('/customers', customerAuthController.get_all_customers);
// Delete customer permanently
router.delete('/customer/:customerId', customerAuthController.delete_customer_permanently);
router.post('/customers/bulk-delete', customerAuthController.bulk_delete_customers);
module.exports = router;

