const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");
const { responseReturn } = require("../../utiles/response");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const IMGBB_API_KEY =
  process.env.IMGBB_API_KEY || "8f804e55241112a00a3e62f1b5a6e5a9";

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

class productController {
  add_product = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return responseReturn(res, 500, { error: err.message });
      }

      try {
        let {
          name,
          category,
          description,
          storageinfo,
          subCategory,
          ingrediennts,
          stock,
          price,
          fabric,
          design,
          discount,
          shopName,
          brand,
          gender,
          benefits,
          size,
          color,
          imageColors, // 🆕 Colors mapped to each image
        } = fields;

        // 🖼️ Extract main images
        const images = files.images
          ? Array.isArray(files.images)
            ? files.images
            : [files.images]
          : [];

        // 🖼️ Extract key highlights images
        const keyHighlights = files.keyHighlights
          ? Array.isArray(files.keyHighlights)
            ? files.keyHighlights
            : [files.keyHighlights]
          : [];

        // 🧩 Convert arrays properly
        const sizeArray = size ? [].concat(size).map((s) => s.trim()) : [];
        const colorArray = color ? [].concat(color).map((c) => c.trim()) : [];
        const benefitsArray = benefits
          ? [].concat(benefits).map((b) => b.trim())
          : [];
        // const imageColorsArray = imageColors
        //   ? [].concat(imageColors).map((c) => c.trim())
        //   : [];

        let imageColorsArray = [];

        if (imageColors) {
          // If front-end sent a JSON string like '["red","blue"]', try to parse it
          if (typeof imageColors === "string") {
            const trimmed = imageColors.trim();
            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
              try {
                const parsed = JSON.parse(trimmed);
                imageColorsArray = Array.isArray(parsed)
                  ? parsed.map((c) => (c == null ? "" : String(c).trim()))
                  : [String(parsed).trim()];
              } catch (e) {
                // not JSON, treat it as comma separated or single value
                if (trimmed.includes(",")) {
                  imageColorsArray = trimmed.split(",").map((c) => c.trim());
                } else {
                  imageColorsArray = [trimmed];
                }
              }
            } else {
              // simple string (maybe comma separated)
              if (trimmed.includes(",")) {
                imageColorsArray = trimmed.split(",").map((c) => c.trim());
              } else {
                imageColorsArray = [trimmed];
              }
            }
          } else if (Array.isArray(imageColors)) {
            imageColorsArray = imageColors.map((c) =>
              c == null ? "" : String(c).trim()
            );
          } else {
            // some other type (object/number) — convert to string safely
            imageColorsArray = [String(imageColors).trim()];
          }
        }

        name = name.trim();
        const slug = name.split(" ").join("-");

        let allImageUrl = [];
        let allKeyHighlightsUrl = [];

        // 🔹 Upload product images and map color
        if (images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            const imagePath = images[i].filepath;

            const formData = new FormData();
            formData.append("key", IMGBB_API_KEY);
            formData.append("image", fs.createReadStream(imagePath));
            const headers = formData.getHeaders();

            const response = await axios.post(
              "https://api.imgbb.com/1/upload",
              formData,
              { headers }
            );

            if (response.data?.data?.url) {
              allImageUrl.push(response.data.data.url);
            }
          }
        }

        // 🔹 Upload key highlights images
        if (keyHighlights.length > 0) {
          for (let i = 0; i < keyHighlights.length; i++) {
            const imagePath = keyHighlights[i].filepath;
            const formData = new FormData();
            formData.append("key", IMGBB_API_KEY);
            formData.append("image", fs.createReadStream(imagePath));
            const headers = formData.getHeaders();

            const response = await axios.post(
              "https://api.imgbb.com/1/upload",
              formData,
              { headers }
            );

            if (response.data?.data?.url) {
              allKeyHighlightsUrl.push(response.data.data.url);
            }
          }
        }

        // 🧠 Combine each image URL with its selected color
        const mappedImageColorData = allImageUrl.map((url, index) => ({
          url,
          color: imageColorsArray[index] || "",
        }));

        // ✅ Create Product
        await productModel.create({
          sellerId: id,
          name,
          slug,
          shopName,
          subCategory,
          category: category.trim(),
          description: description.trim(),
          Shippingcharge: storageinfo,
          Shippingtime: ingrediennts,
          stock: parseInt(stock),
          price: parseInt(price),
          fabric: fabric.trim(),
          design: design.trim(),
          discount: parseInt(discount),
          gender: gender || "Unisex",
          brand: brand.trim(),
          images: mappedImageColorData, // 🆕 Each image with color info
          keyHighlights: allKeyHighlightsUrl,
          points: benefitsArray,
          size: sizeArray,
          color: colorArray,
        });

        responseReturn(res, 201, { message: "Product added successfully" });
      } catch (error) {
        console.error(
          "ImgBB Upload Error:",
          error.response?.data || error.message
        );
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  products_get = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    const { id } = req;

    const skipPage = parseInt(parPage) * (parseInt(page) - 1);

    try {
      if (searchValue) {
        const products = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .countDocuments();
        responseReturn(res, 200, { totalProduct, products });
      } else {
        const products = await productModel
          .find({ sellerId: id })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({ sellerId: id })
          .countDocuments();
        responseReturn(res, 200, { totalProduct, products });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  product_get = async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await productModel.findById(productId);
      responseReturn(res, 200, { product });
    } catch (error) {
      console.log(error.message);
    }
  };

  product_update = async (req, res) => {
    let {
      name,
      description,
      discount,
      price,
      brand,
      productId,
      stock,
      category,
    } = req.body;
    name = name.trim();
    const slug = name.split(" ").join("-");
    try {
      await productModel.findByIdAndUpdate(productId, {
        name,
        description,
        discount,
        price,
        brand,
        productId,
        stock,
        slug,
        category,
      });
      const product = await productModel.findById(productId);
      responseReturn(res, 200, { product, message: "product update success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
  product_image_update = async (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, field, files) => {
      const { productId, oldImage } = field;
      const { newImage } = files;

      if (err) {
        responseReturn(res, 404, { error: err.message });
      } else {
        try {
          cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true,
          });

          const formData = new FormData();
          formData.append("key", IMGBB_API_KEY);
          formData.append("image", fs.createReadStream(newImage.filepath));

          const headers = formData.getHeaders();
          const response = await axios.post(
            "https://api.imgbb.com/1/upload",
            formData,
            { headers }
          );

          if (response.data && response.data.data && response.data.data.url) {
            let { images } = await productModel.findById(productId);
            const index = images.findIndex((img) => img === oldImage);
            images[index] = response.data.data.url;

            await productModel.findByIdAndUpdate(productId, {
              images,
            });
            const product = await productModel.findById(productId);
            responseReturn(res, 200, {
              product,
              message: "product image update success",
            });
          } else {
            responseReturn(res, 404, { error: "image upload failed" });
          }
        } catch (error) {
          responseReturn(res, 404, { error: error.message });
        }
      }
    });
  };
  delete_product = async (req, res) => {
    const { id } = req.params; // Assume the product ID is passed as a URL parameter

    try {
      // Find the product by ID
      const product = await productModel.findById(id);

      if (!product) {
        return responseReturn(res, 404, { error: "Product not found" });
      }

      // Delete the product from the database
      await productModel.findByIdAndDelete(id);

      responseReturn(res, 200, { message: "Product deleted successfully" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
  update_section = async (req, res) => {
    const { id } = req.params; // Assume the product ID is passed as a URL parameter

    try {
      // Find the product by ID
      const product = await productModel.findById(id);

      if (!product) {
        return responseReturn(res, 404, { error: "Product not found" });
      }
      let section = product.section;

      // Delete the product from the database
      await productModel.findByIdAndUpdate(id, {
        section: section === 1 ? 0 : 1,
      });

      responseReturn(res, 200, {
        message: "Product section updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_product_subcategory = async (req, res) => {
    try {
      let { page = 1, limit = 20 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const { category, subCategory } = req.params;

      console.log("subCategory", subCategory);
      console.log("category", category);

      // const total = await productModel.countDocuments({
      //   category: { $regex: new RegExp(category, "i") },
      //   subCategory: { $regex: new RegExp(subCategory, "i") },
      // });
      // category present
      if (!category || !subCategory) {
        return 0; // or empty array
      }

      const total = await productModel.countDocuments({
        category: { $regex: `^${category}$`, $options: "i" },
        subCategory: { $regex: `^${subCategory}$`, $options: "i" },
      });
      // console.log("total", total);
      const data = await productModel
        .find({
          category: category,
          subCategory: subCategory,
        })
        .skip((page - 1) * limit)
        .limit(limit);

      // console.log("data", data);


      res.status(200).json({
        success: true,
        message: "Successfully fetched products by subcategory",
        data,
        totalProduct: total,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching products by subcategory",
        error: error.message,
      });
    }
  };
}

module.exports = new productController();
