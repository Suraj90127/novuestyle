import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { BsImages } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { get_category } from "../../store/Reducers/categoryReducer";
import { add_product, messageClear } from "../../store/Reducers/productReducer";
import { Editor } from "@tinymce/tinymce-react";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { successMessage, errorMessage, loader } = useSelector(
    (state) => state.product
  );

  const [colorImages, setColorImages] = useState([]); // each item = { file, url, color }

  // Product state
  const [state, setState] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    fabric: "",
    design: "",
    brand: "",
    stock: "",
    benefits: [""],
    size: [""],
    color: [],
    storageinfo: "",
    ingrediennts: "",
    gender: "",
  });

  // Color Dropdown State
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const allColors = [
    { name: "White", code: "#FFFFFF" },
    { name: "Black", code: "#000000" },
    { name: "Navy Blue", code: "#000080" },
    { name: "Gray", code: "#808080" },
    { name: "Melange", code: "#A0A0A0" },
    { name: "Bottle green", code: "#006A4E" },
    { name: "Royal Blue", code: "#4169E1" },
    { name: "Red", code: "#FF0000" },
    { name: "Maroon", code: "#800000" },
    { name: "Olive Green", code: "#808000" },
    { name: "Mustard Yellow", code: "#FFDB58" },
    { name: "Light baby pink", code: "#FFD1DC" },
    { name: "Lavender", code: "#B2A4D4" },
    { name: "Coral", code: "#FF7F50" },
    { name: "Mint Baby Blue", code: "#89CFF0" },
  ];
  const colorDropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target)
      ) {
        setColorDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputHandle = (e, index, field, type) => {
    const { name, value } = e.target;
    if (type === "benefits" || type === "size" || type === "color") {
      const updated = [...state[field]];
      updated[index] = value;
      setState({ ...state, [field]: updated });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const addBenefitPoint = () =>
    setState((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
  const addSize = () =>
    setState((prev) => ({ ...prev, size: [...prev.size, ""] }));
  const removeSize = (i) =>
    setState((prev) => ({
      ...prev,
      size: prev.size.filter((_, idx) => idx !== i),
    }));

  // Category/Subcategory state
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [cateShow, setCateShow] = useState(false);
  const [subCateShow, setSubCateShow] = useState(false);
  const [allCategory, setAllCategory] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [subCategorySearchValue, setSubCategorySearchValue] = useState("");

  useEffect(() => {
    dispatch(get_category({ searchValue: "", parPage: "", page: "" }));
  }, [dispatch]);

  useEffect(() => setAllCategory(categorys), [categorys]);

  const categorySearch = (e) => {
    const value = e.target.value;
    setCategorySearchValue(value);
    setAllCategory(
      value
        ? categorys.filter((c) =>
            c.name.toLowerCase().includes(value.toLowerCase())
          )
        : categorys
    );
  };

  const subCategorySearch = (e) => {
    const value = e.target.value;
    setSubCategorySearchValue(value);
    if (!value && category) {
      const selected = categorys.find((c) => c.name === category);
      setSubCategoryData(selected?.subCategory || []);
    } else {
      setSubCategoryData((prev) =>
        prev.filter((s) => s.sname.toLowerCase().includes(value.toLowerCase()))
      );
    }
  };

  // Images & Video
  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoShow, setVideoShow] = useState(null);
  const [keyHighlights, setKeyHighlights] = useState([]);
  const [keyHighlightsShow, setKeyHighlightsShow] = useState([]);

  // const imageHandle = (e) => {
  //   const files = Array.from(e.target.files);
  //   if (!files.length) return;
  //   setImages((prev) => [...prev, ...files]);
  //   setImageShow((prev) => [
  //     ...prev,
  //     ...files.map((f) => ({ url: URL.createObjectURL(f) })),
  //   ]);
  // };

  const imageHandle = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
      color: "", // initially no color selected
    }));

    setColorImages((prev) => [...prev, ...newImages]);
  };

  const changeImage = (file, index) => {
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    const newImageShow = [...imageShow];
    newImageShow[index] = { url: URL.createObjectURL(file) };
    setImages(newImages);
    setImageShow(newImageShow);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imageShow[index].url);
    setImages(images.filter((_, i) => i !== index));
    setImageShow(imageShow.filter((_, i) => i !== index));
  };

  const videoHandle = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo(file);
    setVideoShow({ url: URL.createObjectURL(file) });
  };

  const removeVideo = () => {
    if (videoShow) URL.revokeObjectURL(videoShow.url);
    setVideo(null);
    setVideoShow(null);
  };

  // 🆕 Key Highlights Image Handlers
  const keyHighlightsHandle = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setKeyHighlights((prev) => [...prev, ...files]);
    setKeyHighlightsShow((prev) => [
      ...prev,
      ...files.map((f) => ({ url: URL.createObjectURL(f) })),
    ]);
  };

  const changeKeyHighlightImage = (file, index) => {
    if (!file) return;
    const newImages = [...keyHighlights];
    newImages[index] = file;
    const newShow = [...keyHighlightsShow];
    newShow[index] = { url: URL.createObjectURL(file) };
    setKeyHighlights(newImages);
    setKeyHighlightsShow(newShow);
  };

  const removeKeyHighlightImage = (index) => {
    URL.revokeObjectURL(keyHighlightsShow[index].url);
    setKeyHighlights(keyHighlights.filter((_, i) => i !== index));
    setKeyHighlightsShow(keyHighlightsShow.filter((_, i) => i !== index));
  };

  // Submit form
  const add = (e) => {
    e.preventDefault();
    if (!category) return toast.error("Select a category");

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("price", state.price);
    formData.append("fabric", state.fabric);
    formData.append("design", state.design);
    formData.append("stock", state.stock);
    formData.append("category", category);
    formData.append("subCategory", subCategory || "");
    formData.append("discount", state.discount);
    formData.append("shopName", "Farid Fashion");
    formData.append("brand", state.brand);

    state.color.forEach((c, i) => formData.append(`color[${i}]`, c));
    state.size.forEach((s, i) => formData.append(`size[${i}]`, s));
    state.benefits.forEach((b, i) => formData.append(`benefits[${i}]`, b));
    state.ingrediennts && formData.append("ingrediennts", state.ingrediennts);
    state.storageinfo && formData.append("storageinfo", state.storageinfo);
    state.gender && formData.append("gender", state.gender);

    // images.forEach((img) => formData.append("images", img));

    colorImages.forEach((item, index) => {
      formData.append("images", item.file);
      formData.append(`imageColors[${index}]`, item.color);
    });

    keyHighlights.forEach((img) => formData.append("keyHighlights", img));
    if (video) formData.append("video", video);

    dispatch(add_product(formData));
  };

  // Handle success/error messages
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: "",
        description: "",
        discount: "",
        price: "",
        fabric: "",
        design: "",
        brand: "",
        stock: "",
        benefits: [""],
        size: [""],
        color: [],
        storageinfo: "",
        ingrediennts: "",
        gender: "",
      });
      setCategory("");
      setSubCategory("");
      setAllCategory(categorys);
      setSubCategoryData([]);
      setImages([]);
      setImageShow([]);
      setKeyHighlights([]);
      setKeyHighlightsShow([]);
      setVideo(null);
      setVideoShow(null);
      setColorImages([]);
    }
  }, [successMessage, errorMessage, dispatch, categorys]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-semibold">Add Product</h1>
          <Link
            className="bg-blue-500 hover:shadow-lg text-white rounded-sm px-7 py-2"
            to="/seller/dashboard/products"
          >
            Products
          </Link>
        </div>

        <form onSubmit={add}>
          {/* Name & Brand */}
          <div className="flex flex-col md:flex-row gap-4 mb-3 text-[#d0d2d6]">
            <input
              name="name"
              placeholder="Product Name"
              value={state.name}
              onChange={inputHandle}
              className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md outline-none text-[#d0d2d6]"
            />
            <input
              name="brand"
              placeholder="Brand"
              value={state.brand}
              onChange={inputHandle}
              className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md outline-none text-[#d0d2d6]"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="flex flex-col md:flex-row gap-4 mb-3 text-[#d0d2d6]">
            {/* Category dropdown */}
            <div className="relative w-full">
              <input
                readOnly
                value={category}
                onClick={() => setCateShow(!cateShow)}
                placeholder="--select category--"
                className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md w-full outline-none"
              />
              <div
                className={`absolute top-[101%] bg-slate-800 w-full transition-transform origin-top z-50 ${
                  cateShow ? "scale-100" : "scale-0"
                }`}
              >
                <input
                  value={categorySearchValue}
                  onChange={categorySearch}
                  placeholder="Search category"
                  className="px-3 py-1 w-full bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] outline-none"
                />
                <div className="max-h-[200px] overflow-y-auto">
                  {allCategory.map((c) => (
                    // console.log("c11111111111", c),
                    <span
                      key={c._id}
                      className={`px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer block ${
                        category === c.slug ? "bg-indigo-500" : ""
                      }`}
                      onClick={() => {
                        setCategory(c.slug);
                        setSubCategoryData(c.subCategory || []);
                        setCateShow(false);
                        setCategorySearchValue("");
                      }}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative w-full">
              <input
                readOnly
                value={subCategory}
                onClick={() => setSubCateShow(!subCateShow)}
                placeholder="--select subcategory--"
                className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md w-full outline-none"
              />
              <div
                className={`absolute top-[101%] bg-slate-800 w-full transition-transform origin-top ${
                  subCateShow ? "scale-100" : "scale-0"
                }`}
              >
                <input
                  value={subCategorySearchValue}
                  onChange={subCategorySearch}
                  placeholder="Search subcategory"
                  className="px-3 py-1 w-full bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] outline-none"
                />
                <div className="max-h-[200px] overflow-y-auto">
                  {subCategoryData.map((s) => (
                    <span
                      key={s.sname}
                      className={`px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer block ${
                        subCategory === s.sslug ? "bg-indigo-500" : ""
                      }`}
                      onClick={() => {
                        setSubCategory(s.sslug);
                        setSubCateShow(false);
                        setSubCategorySearchValue("");
                      }}
                    >
                      {s.sname}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <input
              type="number"
              min="0"
              placeholder="Stock"
              name="stock"
              value={state.stock}
              onChange={inputHandle}
              className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md outline-none text-[#d0d2d6]"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-3 text-[#d0d2d6]">
            <input
              type="number"
              placeholder="Price"
              name="price"
              value={state.price}
              onChange={inputHandle}
              className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md outline-none text-[#d0d2d6]"
            />
            <input
              type="number"
              min="0"
              placeholder="Discount %"
              name="discount"
              value={state.discount}
              onChange={inputHandle}
              className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md outline-none text-[#d0d2d6]"
            />
            <input
              type="text"
              placeholder="Fabric code"
              name="fabric"
              value={state.fabric}
              onChange={inputHandle}
              className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md outline-none text-[#d0d2d6]"
            />
            <input
              type="text"
              placeholder="Design code"
              name="design"
              value={state.design}
              onChange={inputHandle}
              className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md outline-none text-[#d0d2d6]"
            />
          </div>

          {/* Sizes */}
          <div className="mb-3">
            <h3 className="text-[#d0d2d6] mb-1">Sizes</h3>
            {state.size.map((s, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={s}
                  placeholder="Size"
                  onChange={(e) => inputHandle(e, i, "size", "size")}
                  className="px-3 py-1 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] outline-none"
                />
                {i > 0 && (
                  <span
                    onClick={() => removeSize(i)}
                    className="cursor-pointer text-red-500"
                  >
                    <IoCloseSharp />
                  </span>
                )}
              </div>
            ))}
            <button type="button" onClick={addSize} className="text-blue-400">
              + Add Size
            </button>
          </div>

          {/* Colors */}
          <div className="mb-3 relative" ref={colorDropdownRef}>
            <h3 className="text-[#d0d2d6] mb-1">Colors</h3>
            <div
              className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md cursor-pointer text-[#d0d2d6] flex flex-wrap gap-1"
              onClick={() => setColorDropdownOpen((prev) => !prev)}
            >
              {state.color.length > 0 ? (
                state.color.map((c, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: c.code }}
                  >
                    {c.name}
                    <IoCloseSharp
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setState((prev) => ({
                          ...prev,
                          color: prev.color.filter((col) => col !== c),
                        }));
                      }}
                    />
                  </span>
                ))
              ) : (
                <span className="text-[#d0d2d6]">Select Colors</span>
              )}
            </div>

            {colorDropdownOpen && (
              <div className="absolute z-10 bg-slate-800 border border-slate-700 mt-1 rounded-md w-full max-h-40 overflow-y-auto">
                {allColors.map((c, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 flex items-center gap-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        color: prev.color.name
                          ? prev.color
                          : [...prev.color, c],
                      }));
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={state.color.name}
                      readOnly
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-gray-200"
                      style={{ backgroundColor: c.code }}
                    ></span>
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="mb-3">
            <h3 className="text-[#d0d2d6] mb-1">Benefits</h3>
            {state.benefits.map((b, i) => (
              <input
                key={i}
                value={b}
                placeholder={`Benefit ${i + 1}`}
                onChange={(e) => inputHandle(e, i, "benefits", "benefits")}
                className="px-3 py-1 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] outline-none mb-1 w-full"
              />
            ))}
            <button
              type="button"
              onClick={addBenefitPoint}
              className="text-blue-400"
            >
              + Add Benefit
            </button>
          </div>

          {/* Description */}
          {/* <textarea
            rows={4}
            placeholder="Description"
            name="description"
            value={state.description}
            onChange={inputHandle}
            className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md outline-none text-[#d0d2d6] w-full mb-5"
          /> */}

          {/* Description (Rich Text Editor) */}
          <div className="mb-5">
            <label className="block text-[#d0d2d6] mb-2 font-medium">
              Description
            </label>
            <Editor
              apiKey="ko0h7nvd66dkxhwcw6ms93mw4whsbijomjc3u8y55s1o9k7l"
              value={state.description}
              onEditorChange={(newValue) =>
                inputHandle({
                  target: { name: "description", value: newValue },
                })
              }
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline | link | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | help",
                skin: "oxide-dark",
                content_css: "dark",
              }}
            />
          </div>

          {/* Image Upload */}
          {/* <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4">
            {imageShow.map((img, i) => (
              <div key={i} className="relative h-[180px]">
                <img
                  src={img.url}
                  alt="preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => changeImage(e.target.files[0], i)}
                  id={`img-${i}`}
                />
                <span
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-2 cursor-pointer rounded-full"
                >
                  <IoCloseSharp />
                </span>
              </div>
            ))}

            <label
              htmlFor="image"
              className="flex flex-col justify-center items-center cursor-pointer border border-dashed rounded-md h-[180px] text-[#d0d2d6]"
            >
              <BsImages size={25} />
              <span>Select Images</span>
            </label>
            <input
              type="file"
              multiple
              className="hidden"
              id="image"
              onChange={imageHandle}
            />
          </div> */}

          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4">
            {colorImages.map((img, i) => (
              <div
                key={i}
                className="relative h-[220px] bg-[#1e1e2d] p-2 rounded-md"
              >
                <img
                  src={img.url}
                  alt="preview"
                  className="w-full h-[150px] object-cover rounded-md"
                />

                {/* 🟢 Color Selector */}
                <select
                  value={img.color}
                  onChange={(e) => {
                    const newColorImages = [...colorImages];
                    newColorImages[i].color = e.target.value;
                    setColorImages(newColorImages);
                  }}
                  className="mt-2 w-full bg-[#283046] border border-slate-600 text-[#d0d2d6] rounded-md px-2 py-1 outline-none"
                >
                  <option value="">-- Select Color --</option>
                  {allColors.map((color, index) => (
                    <option key={index} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>

                {/* ❌ Remove Image */}
                <span
                  onClick={() => {
                    URL.revokeObjectURL(img.url);
                    setColorImages(
                      colorImages.filter((_, index) => index !== i)
                    );
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white p-2 cursor-pointer rounded-full"
                >
                  <IoCloseSharp />
                </span>
              </div>
            ))}

            <label
              htmlFor="image"
              className="flex flex-col justify-center items-center cursor-pointer border border-dashed rounded-md h-[220px] text-[#d0d2d6]"
            >
              <BsImages size={25} />
              <span>Select Images</span>
            </label>
            <input
              type="file"
              multiple
              className="hidden"
              id="image"
              onChange={imageHandle}
            />
          </div>

          {/* 🆕 Key Highlights Upload Section */}
          <div className="mb-4">
            <h3 className="text-[#d0d2d6] mb-2 font-medium">
              Key Highlights Upload
            </h3>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
              {keyHighlightsShow.map((img, i) => (
                <div key={i} className="relative h-[180px]">
                  <img
                    src={img.url}
                    alt="key highlight"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      changeKeyHighlightImage(e.target.files[0], i)
                    }
                    id={`key-highlight-${i}`}
                  />
                  <span
                    onClick={() => removeKeyHighlightImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-2 cursor-pointer rounded-full"
                  >
                    <IoCloseSharp />
                  </span>
                </div>
              ))}
              <label
                htmlFor="keyHighlights"
                className="flex flex-col justify-center items-center cursor-pointer border border-dashed rounded-md h-[180px] text-[#d0d2d6]"
              >
                <BsImages size={25} />
                <span>Select Key Highlight Images</span>
              </label>
              <input
                type="file"
                multiple
                className="hidden"
                id="keyHighlights"
                onChange={keyHighlightsHandle}
              />
            </div>
          </div>

          {/* Video Upload */}
          <div className="mb-4 text-[#d0d2d6]">
            <label>Product Video</label>
            <div className="flex flex-wrap gap-2 border border-slate-600 p-4 rounded-md">
              {videoShow ? (
                <div className="relative w-[300px] h-[180px]">
                  <video
                    src={videoShow.url}
                    controls
                    className="w-full h-full object-cover rounded-md"
                  />
                  <span
                    onClick={removeVideo}
                    className="absolute top-1 right-1 bg-red-500 text-white p-2 cursor-pointer rounded-full"
                  >
                    <IoCloseSharp />
                  </span>
                </div>
              ) : (
                <label
                  htmlFor="video"
                  className="flex flex-col justify-center items-center cursor-pointer border border-dashed rounded-md w-[300px] h-[180px]"
                >
                  <MdOutlineVideoLibrary size={25} />
                  <span>Select Video</span>
                </label>
              )}
              <input
                type="file"
                accept="video/*"
                id="video"
                className="hidden"
                onChange={videoHandle}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={loader}
            className="bg-blue-500 hover:shadow-lg text-white rounded-md px-7 py-2"
          >
            {loader ? (
              <PropagateLoader color="#fff" cssOverride={overrideStyle} />
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
