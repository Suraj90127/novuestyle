const Heading3 = require("../../models/Heading3");

// Create a new heading3
exports.createHeading = async (req, res) => {
  try {
    const { heading3, categorys } = req.body; // match frontend
    if (!heading3) {
      return res.status(400).json({ message: "heading3 is required" });
    }

    // Ensure categorys is always an array
    const formattedCategory = Array.isArray(categorys) ? categorys : [categorys];

    const newHeading = new Heading3({
      heading3,
      categorys: formattedCategory, // match schema
    });

    await newHeading.save();
    res.status(201).json(newHeading);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all heading3
exports.getHeadings = async (req, res) => {
  try {
    const headings = await Heading3.find();
    res.status(200).json(headings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a single heading3 by ID
exports.getHeadingById = async (req, res) => {
  try {
    const heading = await Heading3.findById(req.params.id);
    if (!heading) {
      return res.status(404).json({ message: "Heading not found" });
    }
    res.status(200).json(heading);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update a heading3
exports.updateHeading = async (req, res) => {
  try {
    const { heading1, categorys } = req.body;
    const updatedData = {};

    if (heading1 !== undefined) updatedData.heading1 = heading1;

    // Always update categorys — even if empty
    if (Array.isArray(categorys)) {
      updatedData.categorys = categorys;
    } else if (categorys) {
      updatedData.categorys = [categorys];
    }

    const updatedHeading = await Heading3.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedHeading) {
      return res.status(404).json({ message: "Heading not found" });
    }

    res.status(200).json({
      success: true,
      message: "Heading updated successfully",
      data: updatedHeading,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a heading3
exports.deleteHeading = async (req, res) => {
  try {
    const deletedHeading = await Heading3.findByIdAndDelete(req.params.id);
    if (!deletedHeading) {
      return res.status(404).json({ message: "Heading not found" });
    }

    res.status(200).json({ message: "Heading deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
