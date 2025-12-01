import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHeadings,
  createHeading,
  updateHeading,
  deleteHeading,
} from "../../store/Reducers/heading4Reducer";
import { get_category } from "../../store/Reducers/categoryReducer";

const Heading4Manager = () => {
  const dispatch = useDispatch();
  const { headings, loading, error } = useSelector((state) => state.heading4);
  const { categorys, loader } = useSelector((state) => state.category);

  const [headingInput, setHeadingInput] = useState("");
  const [categoryInput, setCategoryInput] = useState([]); // selected subcategories
  const [editId, setEditId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchHeadings());
    dispatch(get_category());
  }, [dispatch]);

  // Save or update heading
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!headingInput.trim()) {
      alert("Heading is required");
      return;
    }

    const data = { heading4: headingInput, categorys: categoryInput };

    if (editId) {
      dispatch(updateHeading({ id: editId, data }));
      setEditId(null);
    } else {
      dispatch(createHeading(data));
    }

    setHeadingInput("");
    setCategoryInput([]);
  };

  // Edit heading
  const handleEdit = (heading) => {
    setEditId(heading._id);
    setHeadingInput(heading.heading4);
    setCategoryInput(heading.categorys || []);
  };

  // Delete heading
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this heading?")) {
      dispatch(deleteHeading(id));
    }
  };

  // Toggle subcategory selection
  const toggleSubcategory = (sub) => {
    const exists = categoryInput.find((c) => c._id === sub._id);
    if (exists) {
      setCategoryInput(categoryInput.filter((c) => c._id !== sub._id));
    } else {
      setCategoryInput([...categoryInput, sub]);
    }
    setDropdownOpen(false); // close dropdown after select
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-lg text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">
        Heading4 Manager
      </h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Enter Heading4"
          value={headingInput}
          onChange={(e) => setHeadingInput(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Subcategory Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-left text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
          >
            {categoryInput.length > 0
              ? categoryInput.map((c) => c.sname).join(", ")
              : "Select Subcategories"}
            <span className="ml-2">&#9662;</span>
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md max-h-64 overflow-y-auto">
              {loader ? (
                <p className="p-3 text-gray-400">Loading...</p>
              ) : (
                categorys.map((cat) =>
                  cat.subCategory.map((sub) => {
                    const selected = categoryInput.some((c) => c._id === sub._id);
                    return (
                      <div
                        key={sub._id}
                        onClick={() => toggleSubcategory(sub)}
                        className={`flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-700 ${
                          selected ? "bg-gray-700" : ""
                        }`}
                      >
                        <img
                          src={sub.simage}
                          alt={sub.sname}
                          className="w-8 h-8 rounded-md object-cover border border-gray-600"
                        />
                        <div>
                          <p className="text-gray-100 font-medium">{sub.sname}</p>
                          <p className="text-gray-400 text-sm">{sub.sslug}</p>
                        </div>
                      </div>
                    );
                  })
                )
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${
            editId
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {editId ? "Update Heading" : "Add Heading"}
        </button>
      </form>

      {/* Loader & Error */}
      {(loading || loader) && <p className="text-gray-300">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto rounded-md shadow-md">
        <table className="min-w-full border-collapse text-gray-100">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left font-medium border-b border-gray-700">
                Heading4
              </th>
              <th className="p-3 text-left font-medium border-b border-gray-700">
                Subcategories
              </th>
              <th className="p-3 font-medium border-b border-gray-700 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {headings.map((h) => (
              <tr key={h._id} className="hover:bg-gray-800 transition-colors align-top">
                <td className="p-3">{h.heading4}</td>
                <td className="p-3">
                  {h.categorys?.length > 0 ? (
                    h.categorys.map((sub) => (
                      <div
                        key={sub._id}
                        className="flex items-center space-x-3 mb-2"
                      >
                        <img
                          src={sub.simage}
                          alt={sub.sname}
                          className="w-10 h-10 rounded-md object-cover border border-gray-700"
                        />
                        <div>
                          <p className="font-semibold text-gray-100">
                            {sub.sname}
                          </p>
                          <p className="text-sm text-gray-400">{sub.sslug}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No subcategories</p>
                  )}
                </td>
                <td className="p-3 space-x-2 flex justify-center">
                  <button
                    onClick={() => handleEdit(h)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-md text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(h._id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Heading4Manager;
