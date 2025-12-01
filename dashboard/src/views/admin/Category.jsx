import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { GrClose } from "react-icons/gr";
import Pagination from "../Pagination";
import { BsImage } from "react-icons/bs";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import Search from "../components/Search";
import {
  categoryAdd,
  delete_category,
  edit_category,
  messageClear,
  get_category,
} from "../../store/Reducers/categoryReducer";
import { subCategoryAdd, subCategoryDelete, subCategoryEdit } from "../../store/Reducers/subCategoryReducer";

const Category = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, categorys, totalCategory } = useSelector(
    (state) => state.category
  );


  const { loader: subLoader } = useSelector((state) => state.subCategory || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);
  const [imageShow, setImage] = useState("");
  const [editId, setEditId] = useState(null);
  const [state, setState] = useState({ name: "", image: "" });

  // Subcategory state
  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [subCategorystate, setSubCategorystate] = useState({ sname: "" });
  const [subImageShow, setSubImageShow] = useState("");
  const [subImageFile, setSubImageFile] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [editSubId, setEditSubId] = useState(null);

  const imageHandle = (e) => {
    let files = e.target.files;
    if (files.length > 0) {
      setImage(URL.createObjectURL(files[0]));
      setState({ ...state, image: files[0] });
    }
  };

  const subImageHandle = (e) => {
    let files = e.target.files;
    if (files.length > 0) {
      setSubImageShow(URL.createObjectURL(files[0]));
      setSubImageFile(files[0]);
    }
  };

  const saveCategory = (e) => {
    e.preventDefault();
    if (!state.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", state.name);
    if (state.image) formData.append("image", state.image);

    if (editId) {
      dispatch(edit_category({ categoryId: editId, name: state.name, image: state.image }));
    } else {
      dispatch(categoryAdd({ name: state.name, image: state.image }));
    }
  };


  const removeCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(delete_category(id));
    }
  };


  const add_subcategory = (e) => {
    e.preventDefault();

    if (!subCategorystate.sname.trim()) {
      toast.error("Subcategory name is required");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category first");
      return;
    }

    const formData = new FormData();
    formData.append("categoryId", categoryId);
    formData.append("sname", subCategorystate.sname);
    if (subImageFile) formData.append("simage", subImageFile);

    if (editSubId) {
      dispatch(subCategoryEdit({ categoryId, subCategoryId: editSubId, formData })).then(
        (res) => {
          if (res?.payload?.subcategory) {
            setSubCategories((prev) =>
              prev.map((s) => (s._id === editSubId ? res.payload.subcategory : s))
            );
          }
          
            toast.success(res.payload.message);
        }
      );
    } else {
      dispatch(subCategoryAdd(formData)).then((res) => {
        toast.success(res.payload.message);
        if (res?.payload?.subcategory) {
          setSubCategories((prev) => [...prev, res.payload.subcategory]);
        }
      });
    }

    setSubCategorystate({ sname: "" });
    setSubImageShow("");
    setSubImageFile(null);
    setEditSubId(null);
  };



  const removeSubCategory = (subId) => {
    if (!categoryId) return;
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      dispatch(subCategoryDelete({ categoryId, subCategoryId: subId }));
      setSubCategories(subCategories.filter((s) => s._id !== subId));
    }
  };

  const editSubCategoryHandler = (sub) => {
    setSubCategorystate({ sname: sub.sname });
    setSubImageShow(sub.simage || "");
    setCategoryId(sub.categoryId || categoryId);
    setShowSubCategory(true);
    setEditSubId(sub._id); // mark this as edit
  };



  // Handle category select
  const handleCategorySelect = (c) => {
    setCateShow(false);
    setCategory(c.name);
    setSearchValue("");
    setCategoryId(c._id);
    setShowSubCategory(true);
    setSubCategories(Array.isArray(c.subCategory) ? c.subCategory : []);
  };

  // Handle messages
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({ name: "", image: "" });
      setImage("");
      setEditId(null);
      setSubCategorystate({ sname: "" });
      setSubImageShow("");
      setSubImageFile(null);
      setEditSubId(null);
    }
  }, [successMessage, errorMessage, dispatch]);

  // Fetch categories
  useEffect(() => {
    const obj = { parPage: parseInt(parPage), page: parseInt(currentPage), searchValue };
    dispatch(get_category(obj));
  }, [searchValue, currentPage, parPage, dispatch]);

  return (
    <div className="px-2 lg:px-7 pt-5 h-auto">
      {/* Mobile Header */}
      <div className="flex lg:hidden justify-between items-center mb-5 p-4 bg-[#283046] rounded-md">
        <h1 className="text-[#d0d2d6] font-semibold text-lg">Categories</h1>
        <button
          onClick={() => setShow(true)}
          className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 cursor-pointer text-white rounded-sm text-sm"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap w-full">
        {/* Category Table */}
        <div className="w-full lg:w-7/12">
          <div className="w-full p-4 bg-[#283046] rounded-md">
            <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-[#d0d2d6]">
                <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categorys?.map((d, i) => (
                    <tr key={d._id}>
                      <td className="py-1 px-4">{(currentPage - 1) * parPage + i + 1}</td>
                      <td className="py-1 px-4">
                        <img className="w-[45px] h-[45px] object-cover rounded" src={d.image} alt={d.name} />
                      </td>
                      <td className="py-1 px-4">{d.name}</td>
                      <td className="py-1 px-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setEditId(d._id);
                              setState({ name: d.name, image: "" });
                              setImage(d.image);
                              setShow(true); // open side panel
                            }}
                            className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => removeCategory(d._id)}
                            className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50"
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
            <div className="w-full flex justify-end mt-4">
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={totalCategory}
                parPage={parPage}
                showItem={4}
              />
            </div>
          </div>
        </div>

        {/* Add/Edit Category Form */}
        <div
          className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${show ? "right-0" : "-right-[340px]"
            } z-[9999] top-0 transition-all duration-500`}
        >
          <div className="w-full pl-5">
            <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-[#d0d2d6] font-semibold text-xl">
                  {editId ? "Edit Category" : "Add Category"}
                </h1>
                <div onClick={() => setShow(false)} className="block lg:hidden cursor-pointer">
                  <GrClose className="text-[#d0d2d6]" />
                </div>
              </div>
              <form onSubmit={saveCategory}>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="name">Category Name</label>
                  <input
                    value={state.name}
                    onChange={(e) => setState({ ...state, name: e.target.value })}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    id="name"
                    placeholder="Category name"
                    required
                  />
                </div>
                <div>
                  <label
                    className="flex justify-center items-center flex-col h-[200px] cursor-pointer border border-dashed hover:border-indigo-500 w-full border-[#d0d2d6]"
                    htmlFor="image"
                  >
                    {imageShow ? (
                      <img className="w-full h-full object-cover" src={imageShow} alt="Preview" />
                    ) : (
                      <>
                        <BsImage />
                        <span>Select Image</span>
                      </>
                    )}
                  </label>
                  <input
                    onChange={imageHandle}
                    className="hidden"
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                  />
                </div>
                <div className="mt-4">
                  <button
                    disabled={loader}
                    className="bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                  >
                    {loader ? (
                      <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                    ) : editId ? (
                      "Update Category"
                    ) : (
                      "Add Category"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Subcategory Selector & Table */}
        <div className="w-full lg:w-7/12 my-10">
          <div className="flex flex-col w-full gap-1 relative text-white">
            <label htmlFor="category">Category</label>
            <input
              readOnly
              onClick={() => {
                setCateShow(!cateShow);
                setShowSubCategory(false);
              }}
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
              value={category}
              type="text"
              placeholder="--select category--"
              id="category"
            />
            <div
              className={`absolute top-[101%] bg-slate-800 w-full transition-all ${cateShow ? "scale-100" : "scale-0"
                }`}
            >
              <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                {categorys?.map((c) => (
                  <span
                    key={c._id}
                    className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${category === c.name && "bg-indigo-500"
                      }`}
                    onClick={() => handleCategorySelect(c)}
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Subcategory Table */}
          {showSubCategory && subCategories.length > 0 && (
            <div className="w-full mt-2">
              <div className="w-full p-4 bg-[#283046] rounded-md">
                <h2 className="text-white font-semibold mb-3">Subcategories of {category}</h2>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left text-[#d0d2d6]">
                    <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">No</th>
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4">Subcategory Name</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subCategories?.map((sc, i) => (
                        <tr key={sc._id}>
                          <td>{i + 1}</td>
                          <td>
                            {sc.simage && (
                              <img src={sc.simage} alt={sc.sname} className="w-[45px] h-[45px]" />
                            )}
                          </td>
                          <td>{sc.sname}</td>
                          <td className="flex gap-2">
                            <button
                              onClick={() => editSubCategoryHandler(sc)}
                              className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => removeSubCategory(sc._id)}
                              className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Subcategory Form */}
        <div
          className={`w-[400px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed my-10 md-lg:hidden ${showSubCategory ? "right-0" : "-right-[600px]"
            } z-[9999] top-0 transition-all duration-500`}
        >
          <div className="w-full pl-5">
            <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-[#d0d2d6] font-semibold text-xl">
                  {editSubId ? "Edit Sub Category" : "Add Sub Category"}
                </h1>
                <div
                  onClick={() => setShowSubCategory(!showSubCategory)}
                  className="block lg:hidden cursor-pointer"
                >
                  <GrClose className="text-[#d0d2d6]" />
                </div>
              </div>
              <form onSubmit={add_subcategory}>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="sname">Sub Category name</label>
                  <input
                    value={subCategorystate.sname}
                    onChange={(e) =>
                      setSubCategorystate({ ...subCategorystate, sname: e.target.value })
                    }
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    id="sname"
                    placeholder="Sub category name"
                    required
                  />
                </div>

                <div>
                  <label
                    className="flex justify-center items-center flex-col h-[200px] cursor-pointer border border-dashed hover:border-indigo-500 w-full border-[#d0d2d6]"
                    htmlFor="subImage"
                  >
                    {subImageShow ? (
                      <img
                        className="w-full h-full object-cover"
                        src={subImageShow}
                        alt="Subcategory Preview"
                      />
                    ) : (
                      <>
                        <BsImage />
                        <span>Select Image</span>
                      </>
                    )}
                  </label>
                  <input
                    onChange={subImageHandle}
                    className="hidden"
                    type="file"
                    name="subImage"
                    id="subImage"
                    accept="image/*"
                  />
                </div>

                <div className="mt-4">
                  <button
                    disabled={subLoader}
                    className="bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                  >
                    {subLoader ? (
                      <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                    ) : editSubId ? (
                      "Update Sub Category"
                    ) : (
                      "Add Sub Category"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
