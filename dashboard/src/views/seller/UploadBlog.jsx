import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsImages } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { get_category } from "../../store/Reducers/categoryReducer";
import Swal from "sweetalert2";

// import { MdOutlineVideoLibrary } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
import {
  add_blog,
  get_blogs,
  delete_blog,
  messageClear,
  errorMessage,
} from "../../store/Reducers/blogReducer";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
const UploadBlog = () => {
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { successMessage, errorMessage, loader, blogs } = useSelector(
    (state) => state.blog
  );

  useEffect(() => {
    dispatch(get_blogs());
  }, [dispatch]);

  // console.log("get_blogs", blogs);

  // useEffect(() => {}, [blogs]);

  useEffect(() => {
    dispatch(
      get_category({
        searchValue: "",
        parPage: "",
        page: "",
      })
    );
  }, [dispatch]);

  const [state, setState] = useState({
    name: "",
    price: "",
    brand: "",
    subtitle: "",
    benefits: [""],
    questions: [{ heading: "", description: "" }],
  });

  const inputHandle = (e, index, field, type) => {
    const { name, value } = e.target;
    if (type === "benefits") {
      const updatedBenefits = [...state.benefits];
      updatedBenefits[index] = value;
      setState({ ...state, benefits: updatedBenefits });
    } else if (type === "heading") {
      const updatedQuestions = [...state.questions];
      updatedQuestions[index][name] = value;
      setState({ ...state, questions: updatedQuestions });
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const addBenefitPoint = () => {
    setState((prevState) => ({
      ...prevState,
      benefits: [...prevState.benefits, ""],
    }));
  };

  const addQuestionAnswerPair = () => {
    setState((prevState) => ({
      ...prevState,
      questions: [...prevState.questions, { heading: "", description: "" }],
    }));
  };

  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allCategory.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllCategory(srcValue);
    } else {
      setAllCategory(categorys);
    }
  };

  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);
  // const [video, setVideo] = useState(null);
  // const [videoShow, setVideoShow] = useState(null);

  const inmageHandle = (e) => {
    const files = e.target.files;
    const length = files.length;

    if (length > 0) {
      setImages([...images, ...files]);
      let imageUrl = [];

      for (let i = 0; i < length; i++) {
        imageUrl.push({ url: URL.createObjectURL(files[i]) });
      }
      setImageShow([...imageShow, ...imageUrl]);
    }
  };

  const changeImage = (img, index) => {
    if (img) {
      let tempUrl = imageShow;
      let tempImages = images;

      tempImages[index] = img;
      tempUrl[index] = { url: URL.createObjectURL(img) };
      setImageShow([...tempUrl]);
      setImages([...tempImages]);
    }
  };

  const removeImage = (i) => {
    const filterImage = images.filter((img, index) => index !== i);
    const filterImageUrl = imageShow.filter((img, index) => index !== i);
    setImages(filterImage);
    setImageShow(filterImageUrl);
  };

  useEffect(() => {
    setAllCategory(categorys);
  }, [categorys]);

  const add = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append basic product details
    formData.append("name", state.name);
    formData.append("category", category);
    formData.append("shopName", "The VillageZone");
    formData.append("brand", state.brand);
    formData.append("subtitle", state.subtitle);

    // Append benefits
    state.benefits.forEach((benefit, index) => {
      formData.append(`benefits[${index}]`, benefit);
    });
    // Append questions and answers
    state.questions.forEach((qa, index) => {
      formData.append(`questions[${index}][heading]`, qa.heading);
      formData.append(`questions[${index}][description]`, qa.description);
    });
    // Append images
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    Swal.fire({
      title: "Submitting blog",
      text: "Are you sure you want to submit this blog?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Dispatch action to add blog
        dispatch(add_blog(formData))
          .unwrap()
          .then(() => {
            // Show success popup
            Swal.fire({
              title: "Success!",
              text: "Your blog has been added successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            // Show error popup
            Swal.fire({
              title: "Error!",
              text: "There was a problem submitting your blog.",
              icon: "error",
            });
          });
      }
    });
  };

  // console.log("benefit", state.benefits);

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
        brand: "",
        subtitle: "",
      });
      setImageShow([]);
      setImages([]);
      setCategory("");
    }
  }, [successMessage, errorMessage, dispatch]);
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion
        dispatch(delete_blog(id))
          .unwrap()
          .then(() => {
            dispatch(get_blogs()); // Fetch updated blogs after deletion

            Swal.fire({
              title: "Deleted!",
              text: "Your blog has been deleted.",
              icon: "success",
              timer: 2000, // Auto close after 2 seconds
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "There was a problem deleting the blog.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div className="px-2 lg:px-7 pt-5 ">
      <div className="w-full p-4  bg-[#283046] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-semibold">Add Blogs</h1>
          <Link
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2 "
            to="/seller/dashboard"
          >
            blog
          </Link>
        </div>
        <div>
          <form onSubmit={add}>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="name">Blog Title</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.name}
                  type="text"
                  placeholder="Enter Blog Title.."
                  name="name"
                  id="name"
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="brand">Blog Product Name</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.brand}
                  type="text"
                  placeholder="Blog product Name"
                  name="brand"
                  id="brand"
                />
              </div>
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="brand">Blog Sub Title</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.subtitle}
                  type="text"
                  placeholder="Sub title"
                  name="subtitle"
                  id="subtitle"
                />
              </div>
            </div>

            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1 relative">
                <label htmlFor="category">Category</label>
                <input
                  readOnly
                  onClick={() => setCateShow(!cateShow)}
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={category}
                  type="text"
                  placeholder="--select category--"
                  id="category"
                />
                <div
                  className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
                    cateShow ? "scale-100" : "scale-0"
                  }`}
                >
                  <div className="w-full px-4 py-2 fixed">
                    <input
                      value={searchValue}
                      onChange={categorySearch}
                      className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                      type="text"
                      placeholder="search"
                    />
                  </div>
                  <div className="pt-14"></div>
                  <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                    {allCategory.map((c, i) => (
                      <span
                        className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                          category === c.name && "bg-indigo-500"
                        }`}
                        onClick={() => {
                          setCateShow(false);
                          setCategory(c.name);
                          setSearchValue("");
                          setAllCategory(categorys);
                        }}
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="flex flex-col mb-3 w-full text-[#d0d2d6]">
              <label htmlFor="benefits">Description</label>
              {state.benefits &&
                state.benefits.map((be, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <textarea
                      rows={4}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] w-full"
                      onChange={(e) =>
                        inputHandle(e, index, "benefits", "benefits")
                      }
                      value={be.benefit}
                      type="text"
                      placeholder={`Description ${index + 1}`}
                      name={`benefits-${index}`}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => {
                          const updatedBenefits = [...state.instructions];
                          updatedBenefits.splice(index, 1);
                          setState({ ...state, benefits: updatedBenefits });
                        }}
                      >
                        <IoCloseSharp />
                      </button>
                    )}
                  </div>
                ))}
              <button
                type="button"
                className="bg-green-500 text-white rounded-sm px-4 py-2 mt-2"
                onClick={addBenefitPoint}
              >
                Add Description
              </button>
            </div>

            <div className="flex flex-col mb-3 w-full text-[#d0d2d6]">
              <label htmlFor="questions">Additional Blog Description</label>
              {state.questions &&
                state.questions.map((qa, index) => (
                  <div key={index} className="flex flex-col gap-2 mb-2">
                    <input
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] w-full"
                      onChange={(e) =>
                        inputHandle(e, index, "heading", "heading")
                      }
                      value={qa.heading}
                      type="text"
                      placeholder={`Heading ${index + 1}`}
                      name="heading"
                    />
                    <textarea
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] w-full"
                      onChange={(e) =>
                        inputHandle(e, index, "heading", "heading")
                      }
                      value={qa.description}
                      placeholder={`Description ${index + 1}`}
                      name="description"
                      rows="3"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        className="text-red-500 self-end"
                        onClick={() => {
                          const updatedQuestions = [...state.questions];
                          updatedQuestions.splice(index, 1);
                          setState({ ...state, questions: updatedQuestions });
                        }}
                      >
                        <IoCloseSharp />
                      </button>
                    )}
                  </div>
                ))}
              <button
                type="button"
                className="bg-green-500 text-white rounded-sm px-4 py-2 mt-2"
                onClick={addQuestionAnswerPair}
              >
                Add Additional Description With Heading
              </button>
            </div>

            <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-[#d0d2d6] mb-4">
              {imageShow.map((img, i) => (
                <div className="h-[180px] relative">
                  <label htmlFor={i}>
                    <img
                      className="w-full h-full rounded-sm"
                      src={img.url}
                      alt=""
                    />
                  </label>
                  <input
                    onChange={(e) => changeImage(e.target.files[0], i)}
                    type="file"
                    id={i}
                    className="hidden"
                  />
                  <span
                    onClick={() => removeImage(i)}
                    className="p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full"
                  >
                    <IoCloseSharp />
                  </span>
                </div>
              ))}
              <label
                className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-indigo-500 w-full text-[#d0d2d6]"
                htmlFor="image"
              >
                <span>
                  <BsImages />
                </span>
                <span>select image</span>
              </label>
              <input
                multiple
                onChange={inmageHandle}
                className="hidden"
                type="file"
                id="image"
              />
            </div>

            <div className="flex">
              <button
                disabled={loader ? true : false}
                className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                ) : (
                  "Upload Blog"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* show data */}

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="py-3 px-4">
                  No
                </th>
                <th scope="col" className="py-3 px-4">
                  Image
                </th>
                <th scope="col" className="py-3 px-4">
                  Name
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((d, i) => (
                <tr key={i}>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    {i + 1}
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <img
                      className="w-[45px] h-[45px]"
                      src={d.images[0]}
                      alt=""
                    />
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <span>{d?.name?.slice(0, 16)}...</span>
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <div className="flex justify-start items-center gap-4">
                      <Link className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50">
                        <FaEdit />
                      </Link>
                      <Link className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50">
                        <FaEye />
                      </Link>
                      <button
                        className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50"
                        onClick={() => handleDelete(d._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadBlog;
