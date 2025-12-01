import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiscounts, addDiscount, updateDiscount, deleteDiscount } from "../../store/Reducers/discountReducer";

const DiscountManager = () => {
  const dispatch = useDispatch();
  const { discounts, loading, error } = useSelector(state => state.discount);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchDiscounts());
  }, [dispatch]);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleAdd = () => {
    if (!selectedFiles.length) return alert("Select images first");
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append("images", file));
    dispatch(addDiscount(formData));
    setSelectedFiles([]);
  };

  const handleUpdate = (id) => {
    if (!selectedFiles.length) return alert("Select images first");
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append("images", file));
    dispatch(updateDiscount({ id, formData }));
    setSelectedFiles([]);
    setEditId(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteDiscount(id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Discount Manager</h2>

      <div className="flex items-center mb-4">
        <input 
          type="file" 
          multiple 
          onChange={handleFileChange} 
          className="border border-gray-300 p-2 rounded"
        />
        {editId ? (
          <button 
            onClick={() => handleUpdate(editId)} 
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Update Discount
          </button>
        ) : (
          <button 
            onClick={handleAdd} 
            className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add Discount
          </button>
        )}
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-4 mt-6">
        {discounts.map(d => (
          <div key={d._id} className="border border-gray-300 p-4 rounded shadow-sm">
            <div className="flex flex-wrap gap-2">
              {d.images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt="discount" 
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              {/* <button 
                onClick={() => setEditId(d._id)} 
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
              >
                Edit
              </button> */}
              <button 
                onClick={() => handleDelete(d._id)} 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountManager;
