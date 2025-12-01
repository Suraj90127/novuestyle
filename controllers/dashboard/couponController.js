const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");
const coupon = require("../../models/couponModel"); // Assuming the blog model is in the models directory
const { responseReturn } = require("../../utiles/response"); // Assuming you have a response helper

// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret,
//   secure: true,
// });

class couponController {
  add_coupon = async (req, res) => {
    let { name, price, discount, userlimit } = req.body;
    console.log("object", name, price, discount, userlimit);

    name = name.trim();
    const slug = name.split(" ").join("-");

    try {
      // Create coupon
      await coupon.create({
        name,
        slug,
        price,
        discount,
        userlimit,
      });

      responseReturn(res, 201, { message: "coupon added successfully" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
    // });
  };

  get_coupon = async (req, res) => {
    try {
      const couponData = await coupon.find({});

      responseReturn(res, 200, { couponData });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  coupon_delete = async (req, res) => {
    const { id } = req.params;
    try {
      const couponData = await coupon.findByIdAndDelete(id);
      if (!couponData) {
        return responseReturn(res, 404, { error: "coupon not found" });
      }
      responseReturn(res, 200, { message: "coupon deleted successfully" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new couponController();
