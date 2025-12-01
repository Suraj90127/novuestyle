const express = require("express");
const DiscountController = require("../../controllers/dashboard/DiscountController");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/add_discount" ,DiscountController.add_discount);

router.get("/get_discount" ,DiscountController.get_discount);

router.put("/update_discount" ,DiscountController.update_discount);

router.delete("/delete_discount/:id" ,DiscountController.delete_discount);

module.exports = router;
