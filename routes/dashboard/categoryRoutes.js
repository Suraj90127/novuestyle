const router = require("express").Router();
const categoryController = require("../../controllers/dashboard/categoryController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

router.post("/category-add", categoryController.add_category);
router.get("/category-get", authMiddleware, categoryController.get_category);
router.put("/category-edit/:categoryId", authMiddleware, categoryController.edit_category);
router.delete("/delete_category/:categoryId", authMiddleware, categoryController.delete_category);

router.post("/category/:categoryId/subcategory", categoryController.add_subcategory);
router.put(
    "/category/:categoryId/subcategory/:subCategoryId",
    
    categoryController.edit_subcategory
);
router.delete(
    "/category/:categoryId/subcategory/:subCategoryId",
    
    categoryController.delete_subcategory
);

module.exports = router;
