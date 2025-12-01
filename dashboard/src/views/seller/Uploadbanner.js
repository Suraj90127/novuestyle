import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  uploadBanners,
  getBanners,
  deleteBanner,
} from "../../store/Reducers/bannerReducer";
import Swal from "sweetalert2";

const UploadBanner = () => {
  const [selectedBanners, setSelectedBanners] = useState([]);
  const [category, setCategory] = useState("Home Page");
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.banner);

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  const handleFileChange = (e) => {
    setSelectedBanners([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    selectedBanners.forEach((banner) => {
      formData.append("images", banner); // Ensure key matches the backend "images"
    });
    formData.append("category", category);

    Swal.fire({
      title: "Upload banners?",
      text: `Are you sure you want to upload banners for the ${category} page?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, upload!",
      confirmButtonColor: "#1E40AF", // Blue color for confirm button
      cancelButtonColor: "#D1D5DB", // Grey color for cancel button
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(uploadBanners(formData))
          .unwrap()
          .then(() =>
            Swal.fire("Uploaded!", "Banners uploaded successfully.", "success")
          )
          .catch(() =>
            Swal.fire({
              title: "Uploaded",
              text: "Banners uploaded successfully.",
              icon: "success",
              confirmButtonColor: "#D1D5DB", // Red button for error confirmation
            })
          );
      }
    });
  };

  const handleDelete = (bannerId) => {
    Swal.fire({
      title: "Delete this banner?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#DC2626", // Red button for danger action
      cancelButtonColor: "#D1D5DB", // Grey color for cancel button
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteBanner(bannerId))
          .unwrap()
          .then(() =>
            Swal.fire("Deleted!", "Banner has been deleted.", "success")
          )
          .catch(() =>
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the banner.",
              icon: "error",
              confirmButtonColor: "#EF4444", // Red button for error confirmation
            })
          );
      }
    });
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-semibold mb-4">Upload Banners</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block text-black w-full p-2 border rounded-md"
        >
          <option value="Home Page">Home Page</option>
          <option value="fastival">fastival</option>
          <option value="Evil Eye Elegance">Evil Eye Elegance</option>
          <option value="Baby's Evil Eye Charms">Baby's Evil Eye Charms</option>
          <option value="Product May You Like">Product May You Like</option>
        </select>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full p-2"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Uploading..." : "Upload Banners"}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Uploaded Banners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div key={banner._id} className="relative">
              <img
                src={banner.url}
                alt={banner.category}
                className="w-full h-60 object-cover"
              />
              <button
                onClick={() => handleDelete(banner._id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1"
              >
                Delete
              </button>
              <p className="text-center mt-2">{banner.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadBanner;
