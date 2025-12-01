const categoryModel = require("../../models/categoryModel");
const { responseReturn } = require("../../utiles/response");
const formidable = require("formidable");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const IMGBB_API_KEY = process.env.IMGBB_API_KEY || "8f804e55241112a00a3e62f1b5a6e5a9";

class categoryController {
  // ✅ Add Category (IMGBB)
  add_category = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) return responseReturn(res, 404, { error: "Something went wrong" });

      let { name } = fields;
      let { image } = files;

      if (!name || !image) return responseReturn(res, 400, { error: "Name and Image are required" });

      name = name.trim();
      const slug = name.split(" ").join("-");

      try {
        const imageBuffer = fs.readFileSync(image.filepath);
        const base64Image = imageBuffer.toString("base64");

        const formData = new FormData();
        formData.append("key", IMGBB_API_KEY);
        formData.append("image", base64Image);

        const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
          headers: formData.getHeaders(),
          timeout: 30000,
        });

        if (!response.data?.data?.url) return responseReturn(res, 500, { error: "Image upload failed" });

        const category = await categoryModel.create({
          name,
          slug,
          image: response.data.data.url,
        });

        return responseReturn(res, 201, { category, message: "Category added successfully" });
      } catch (error) {
        console.error("Upload error:", error?.response?.data || error.message);
        return responseReturn(res, 500, { error: "Internal server error" });
      }
    });
  };

  // ✅ Add Subcategory
  add_subcategory = async (req, res) => {
    const { categoryId } = req.params;
    if (!categoryId) return responseReturn(res, 400, { error: "categoryId is required" });

    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) return responseReturn(res, 404, { error: "Something went wrong" });

      let { sname } = fields;
      let { simage } = files;

      if (!sname || !simage) return responseReturn(res, 400, { error: "Subcategory name & image required" });

      const sslug = sname.trim().split(" ").join("-");

      try {
        const category = await categoryModel.findById(categoryId);
        if (!category) return responseReturn(res, 404, { error: "Category not found" });

        // Upload image
        const imageBuffer = fs.readFileSync(simage.filepath);
        const base64Image = imageBuffer.toString("base64");

        const formData = new FormData();
        formData.append("key", IMGBB_API_KEY);
        formData.append("image", base64Image);

        const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
          headers: formData.getHeaders(),
          timeout: 30000,
        });

        const simageUrl = response.data?.data?.url || "";

        category.subCategory.push({
          sname: sname.trim(),
          sslug,
          simage: simageUrl,
        });

        await category.save();

        return responseReturn(res, 201, { category, message: "Subcategory added successfully" });
      } catch (error) {
        console.error(error);
        return responseReturn(res, 500, { error: "Internal server error" });
      }
    });
  };

  // ✅ Edit Subcategory
  edit_subcategory = async (req, res) => {
    const { categoryId, subCategoryId } = req.params;
    if (!categoryId || !subCategoryId)
      return responseReturn(res, 400, { error: "categoryId and subCategoryId are required" });

    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) return responseReturn(res, 404, { error: "Something went wrong" });

      let { sname } = fields;
      let { simage } = files;

      try {
        const category = await categoryModel.findById(categoryId);
        if (!category) return responseReturn(res, 404, { error: "Category not found" });

        const subCategory = category.subCategory.id(subCategoryId);
        if (!subCategory) return responseReturn(res, 404, { error: "Subcategory not found" });

        if (sname) {
          subCategory.sname = sname.trim();
          subCategory.sslug = sname.trim().split(" ").join("-");
        }

        if (simage) {
          const imageBuffer = fs.readFileSync(simage.filepath);
          const base64Image = imageBuffer.toString("base64");

          const formData = new FormData();
          formData.append("key", IMGBB_API_KEY);
          formData.append("image", base64Image);

          const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
            headers: formData.getHeaders(),
            timeout: 30000,
          });

          if (response.data?.data?.url) subCategory.simage = response.data.data.url;
        }

        await category.save();
        return responseReturn(res, 200, { category, message: "Subcategory updated successfully" });
      } catch (error) {
        console.error(error);
        return responseReturn(res, 500, { error: "Internal server error" });
      }
    });
  };

  delete_subcategory = async (req, res) => {
    const { categoryId, subCategoryId } = req.params;
    if (!categoryId || !subCategoryId)
      return responseReturn(res, 400, { error: "categoryId and subCategoryId are required" });

    try {
      const category = await categoryModel.findById(categoryId);
      if (!category) return responseReturn(res, 404, { error: "Category not found" });

      // Remove subcategory using pull()
      category.subCategory.pull({ _id: subCategoryId });

      await category.save();

      return responseReturn(res, 200, { message: "Subcategory deleted successfully" });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { error: "Internal server error" });
    }
  };


  // ✅ Get Categories (with pagination & search)
  get_category = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    try {
      const skipPage = page && parPage ? parseInt(parPage) * (parseInt(page) - 1) : 0;

      let query = {};
      if (searchValue) query = { $text: { $search: searchValue } };

      const categorys = await categoryModel
        .find(query)
        .skip(skipPage)
        .limit(parPage ? parseInt(parPage) : 0)
        .sort({ createdAt: -1 });

      const totalCategory = await categoryModel.countDocuments(query);

      return responseReturn(res, 200, { totalCategory, categorys });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  // ✅ Edit Category
  edit_category = async (req, res) => {
    const { categoryId } = req.params;
    if (!categoryId) return responseReturn(res, 400, { error: "categoryId is required" });

    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) return responseReturn(res, 404, { error: "Something went wrong" });

      let { name } = fields;
      let { image } = files;

      try {
        const category = await categoryModel.findById(categoryId);
        if (!category) return responseReturn(res, 404, { error: "Category not found" });

        if (name) {
          category.name = name.trim();
          category.slug = name.trim().split(" ").join("-");
        }

        if (image) {
          const imageBuffer = fs.readFileSync(image.filepath);
          const base64Image = imageBuffer.toString("base64");

          const formData = new FormData();
          formData.append("key", IMGBB_API_KEY);
          formData.append("image", base64Image);

          const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
            headers: formData.getHeaders(),
            timeout: 30000,
          });

          if (response.data?.data?.url) category.image = response.data.data.url;
        }

        await category.save();
        return responseReturn(res, 200, { category, message: "Category updated successfully" });
      } catch (error) {
        console.error(error);
        return responseReturn(res, 500, { error: "Internal server error" });
      }
    });
  };

  // ✅ Delete Category
  delete_category = async (req, res) => {
    const { categoryId } = req.params;
    if (!categoryId) return responseReturn(res, 400, { error: "categoryId is required" });

    try {
      const category = await categoryModel.findByIdAndDelete(categoryId);
      if (!category) return responseReturn(res, 404, { error: "Category not found" });

      return responseReturn(res, 200, { message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { error: "Internal server error" });
    }
  };
}

module.exports = new categoryController();
