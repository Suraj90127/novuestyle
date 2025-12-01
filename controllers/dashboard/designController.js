const designModel = require("../../models/designModel");
const { responseReturn } = require("../../utiles/response");

const formidable = require("formidable");
const fs = require("fs");
const axios = require("axios");
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || "8f804e55241112a00a3e62f1b5a6e5a9";

class designController {
    add_design = async (req, res) => {
        const form = formidable({ multiples: false });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 400, { error: "Form parse error" });
            }

            try {
                let { name,email,phone,message } = fields;
                let { image } = files;

                if (!name || !image || !email|| !phone|| !message ) {
                    return responseReturn(res, 400, { error: "Missing All field" });
                }

                name = name.trim();
                const slug = name.split(" ").join("-");

                const imageBuffer = fs.readFileSync(image.filepath);
                const base64Image = imageBuffer.toString("base64");

                const formData = new URLSearchParams();
                formData.append("key", IMGBB_API_KEY);
                formData.append("image", base64Image);

                const response = await axios.post("https://api.imgbb.com/1/upload", formData.toString(), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    timeout: 30000,
                });

                if (response.data?.data?.url) {
                    const design = await designModel.create({
                        name,
                        slug,
                        image: response.data.data.url,
                        email,
                        phone,
                        message
                    });
                    return responseReturn(res, 201, {
                        design,
                        message: "Added successfully",
                    });
                } else {
                    return responseReturn(res, 500, { error: "Image upload failed" });
                }
            } catch (error) {
                console.error("Upload error:", error?.response?.data || error.message);
                return responseReturn(res, 500, { error: "Internal server error" });
            }
        });
    };

    delete_design = async (req, res) => {
        const { id } = req.params;
        try {
            // Find the design by ID
            const design = await designModel.findById(id);

            if (!design) {
                return responseReturn(res, 404, { error: "design not found" });
            }
            // Delete design from the database
            await designModel.findByIdAndDelete(id);
            // Send a success response
            responseReturn(res, 200, { message: "design deleted successfully" });
        } catch (error) {
            console.error("Error deleting design:", error);
            responseReturn(res, 500, { error: "Internal server error" });
        }
    };

    get_design = async (req, res) => {
        const { page, searchValue, parPage } = req.query;
        try {
            let skipPage = "";
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1);
            }
            if (searchValue && page && parPage) {
                const designs = await designModel
                    .find({
                        $text: { $search: searchValue },
                    })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({ createdAt: -1 });
                const totaldesign = await designModel
                    .find({
                        $text: { $search: searchValue },
                    })
                    .countDocuments();
                responseReturn(res, 200, { totaldesign, designs });
            } else if (searchValue === "" && page && parPage) {
                const designs = await designModel
                    .find({})
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({ createdAt: -1 });
                const totaldesign = await designModel.find({}).countDocuments();
                responseReturn(res, 200, { totaldesign, designs });
            } else {
                const designs = await designModel.find({}).sort({ createdAt: -1 });
                const totaldesign = await designModel.find({}).countDocuments();
                responseReturn(res, 200, { totaldesign, designs });
            }
        } catch (error) {
            console.log(error.message);
        }
    };
}

module.exports = new designController();
