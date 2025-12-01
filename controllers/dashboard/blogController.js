const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");
const blog = require("../../models/addblogModel"); // Assuming the blog model is in the models directory
const { responseReturn } = require("../../utiles/response"); // Assuming you have a response helper
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

class blogController {
  add_blog = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return responseReturn(res, 500, { error: err.message });
      }

      let { name, category, brand, subtitle, shopName, benefits, questions } =
        fields;
      // console.log("blog con", fields);

      name = name.trim();
      const slug = name.split(" ").join("-");
      const { images } = files; // Handling multiple images upload
      // console.log("Image files:", images);

      try {
        let allImageUrl = [];

        // Upload images
        if (images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            const imagePath = images[i].filepath;
            // console.log("Uploading Image:", imagePath);

            // Ensure we're using the correct `FormData` package
            const formData = new FormData();
            formData.append("key", IMGBB_API_KEY);
            formData.append("image", fs.createReadStream(imagePath));

            // Manually set headers
            const headers = formData.getHeaders();
            const response = await axios.post(
              "https://api.imgbb.com/1/upload",
              formData,
              { headers }
            );

            // console.log("ImgBB Response:", response.data);

            if (response.data && response.data.data && response.data.data.url) {
              allImageUrl.push(response.data.data.url);
            }
          }
        }
        // console.log("Uploaded image URL:", imageUrl);

        // Create blogs
        await blog.create({
          sellerId: id,
          name,
          slug,
          category,
          brand,
          subtitle,
          shopName,
          description: benefits ? benefits : [], // Handling benefits as array
          additionalDescription: questions,
          images: allImageUrl, // Store multiple image URLs
        });

        responseReturn(res, 201, { message: "blog added successfully" });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  get_blog = async (req, res) => {
    try {
      const blogData = await blog.find({});

      responseReturn(res, 200, { blogData });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  single_blog = async (req, res) => {
    const { slug } = req.params;
    try {
      const blogPage = await blog.findById({ blogId: _id });
      if (!blogPage) {
        return responseReturn(res, 404, { message: "Blog not found" });
      }
      responseReturn(res, 200, { blogPage });
    } catch (error) {
      console.log(error.message);
      responseReturn(res, 500, { message: "An error occurred" });
    }
  };

  delete_blog = async (req, res) => {
    const { id } = req.params;
    try {
      const blogData = await blog.findByIdAndDelete(id);
      if (!blogData) {
        return responseReturn(res, 404, { error: "blog not found" });
      }
      responseReturn(res, 200, { message: "blog deleted successfully" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new blogController();
