const formidable = require("formidable");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const DiscountModel = require("../../models/DiscountModel");

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

async function uploadImageToIMGBB(imagePath) {
    try {
        const formData = new FormData();
        formData.append("key", IMGBB_API_KEY);
        formData.append("image", fs.createReadStream(imagePath));

        const headers = formData.getHeaders();
        const response = await axios.post("https://api.imgbb.com/1/upload", formData, { headers });

        if (response.data?.data?.url) {
            return response.data.data.url;
        }
        return null;
    } catch (err) {
        console.error("IMGBB upload failed:", err.message);
        return null;
    }
}

class DiscountController {
    
    add_discount = async (req, res) => {
        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) return res.status(500).json({ error: err.message });

            const images = files.images
                ? Array.isArray(files.images) ? files.images : [files.images]
                : [];

            try {
                const allImageUrl = [];

                for (const img of images) {
                    const url = await uploadImageToIMGBB(img.filepath);
                    if (url) allImageUrl.push(url);
                }

                const discount = await DiscountModel.create({ images: allImageUrl });

                res.json({
                    success: true,
                    message: "Discount added successfully",
                    discount,
                });
            } catch (error) {
                console.error("Error uploading images:", error.message);
                res.status(500).json({ error: "Failed to upload images" });
            }
        });
    };

    get_discount = async (req, res) => {
        try {
            const data = await DiscountModel.find();
            res.json({ success: true, data, message: "Fetched data successfully" });
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    };

    update_discount = async (req, res) => {
        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const { id } = fields; 
            if (!id) return res.status(400).json({ error: "Discount ID required" });

            const images = files.images
                ? Array.isArray(files.images)
                    ? files.images
                    : [files.images]
                : [];

            try {
                let allImageUrl = [];

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

                const updatedDiscount = await DiscountModel.findByIdAndUpdate(
                    id,
                    { $set: { images: allImageUrl } }, 
                    { new: true }
                );

                if (!updatedDiscount) {
                    return res.status(404).json({ error: "Discount not found" });
                }

                res.json({
                    success: true,
                    message: "Discount updated successfully",
                    discount: updatedDiscount,
                });
            } catch (error) {
                console.error("Error updating discount:", error.message);
                res.status(500).json({ error: "Failed to update discount" });
            }
        });
    };


    delete_discount = async (req, res) => {
        try {
            const { id } = req.params;
            const data = await DiscountModel.findByIdAndDelete(id);

            if (!data) {
                return res.status(404).json({ error: "Discount not found" });
            }

            res.json({ success: true, data, message: "Deleted successfully" });
        } catch (error) {
            console.error("Error deleting data:", error.message);
            res.status(500).json({ error: "Failed to delete data" });
        }
    };
}

module.exports = new DiscountController();
