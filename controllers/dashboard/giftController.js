const formidable = require("formidable");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const giftModel = require("../../models/giftModel");
const { responseReturn } = require("../../utiles/response");

const IMGBB_API_KEY = process.env.IMGBB_API_KEY || "8f804e55241112a00a3e62f1b5a6e5a9";

class giftController {
  add_gift = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) return responseReturn(res, 500, { error: err.message });

      let {
        name,
        category,
        description,
        storageinfo,
        ingrediennts,
        stock,
        price,
        discount,
        shopName,
        brand,
        weight,
        unit,
        benefits,
      } = fields;

      name = name.trim();
      const slug = name.split(" ").join("-");
      const images = Array.isArray(files.images) ? files.images : [files.images];
      const videos = Array.isArray(files.video) ? files.video : files.video ? [files.video] : [];

      try {
        let allImageUrl = [];
        for (const img of images) {
          const formData = new FormData();
          formData.append("key", IMGBB_API_KEY);
          formData.append("image", fs.createReadStream(img.filepath));
          const uploadRes = await axios.post("https://api.imgbb.com/1/upload", formData, {
            headers: formData.getHeaders(),
          });
          allImageUrl.push(uploadRes.data.data.url);
        }

        let allVideoUrl = [];
        if (videos.length > 0) {
          console.log("⚠️ IMGBB does not support video uploads. Skipping video upload.");
        }

        await giftModel.create({
          sellerId: id,
          name,
          slug,
          shopName,
          category,
          description,
          Shippingcharge: storageinfo,
          Shippingtime: ingrediennts,
          stock: parseInt(stock),
          price: parseInt(price),
          discount: parseInt(discount),
          images: allImageUrl,
          videos: allVideoUrl,
          brand: brand.trim(),
          weight: parseInt(weight),
          unit: unit.trim(),
          points: benefits,
        });

        responseReturn(res, 201, { message: "Gift added successfully" });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  gifts_get = async (req, res) => {
    const { searchValue = "" } = req.query;
    try {
      const gifts = await giftModel.find({});
      responseReturn(res, 200, { gifts });
    } catch (error) {
      responseReturn(res, 500, { error: "Failed to fetch gifts" });
    }
  };

  gift_get = async (req, res) => {
    const { giftId } = req.params;
    try {
      const gift = await giftModel.findById(giftId);
      responseReturn(res, 200, { gift });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  gift_update = async (req, res) => {
    let { name, description, discount, price, brand, giftId, stock } = req.body;
    name = name.trim();
    const slug = name.split(" ").join("-");
    try {
      await giftModel.findByIdAndUpdate(giftId, {
        name,
        description,
        discount,
        price,
        brand,
        stock,
        slug,
      });
      const gift = await giftModel.findById(giftId);
      responseReturn(res, 200, { gift, message: "Gift updated successfully" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  gift_image_update = async (req, res) => {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      const { giftId, oldImage } = fields;
      const { newImage } = files;

      if (err) return responseReturn(res, 404, { error: err.message });

      try {
        const formData = new FormData();
        formData.append("key", IMGBB_API_KEY);
        formData.append("image", fs.createReadStream(newImage.filepath));

        const uploadRes = await axios.post("https://api.imgbb.com/1/upload", formData, {
          headers: formData.getHeaders(),
        });

        const imageUrl = uploadRes.data.data.url;
        let { images } = await giftModel.findById(giftId);
        const index = images.findIndex((img) => img === oldImage);
        images[index] = imageUrl;

        await giftModel.findByIdAndUpdate(giftId, { images });
        const gift = await giftModel.findById(giftId);

        responseReturn(res, 200, { gift, message: "Gift image updated successfully" });
      } catch (error) {
        responseReturn(res, 404, { error: error.message });
      }
    });
  };

  delete_gift = async (req, res) => {
    const { id } = req.params;

    try {
      const gift = await giftModel.findById(id);
      if (!gift) return responseReturn(res, 404, { error: "Gift not found" });

      // Cannot delete from IMGBB via API (only expiration during upload or manual deletion)

      await giftModel.findByIdAndDelete(id);
      responseReturn(res, 200, { message: "Gift deleted successfully" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new giftController();
