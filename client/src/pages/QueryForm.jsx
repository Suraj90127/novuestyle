import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";
import { useDispatch } from 'react-redux';
import { design_add } from '../store/reducers/chatReducer';
import toast from 'react-hot-toast';


const QueryForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        image: null,
    });
const dispatch=useDispatch();

    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert image to base64 before saving
        if (formData.image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataToSave = {
                    ...formData,
                    image: reader.result,
                };
                // localStorage.setItem('formData', JSON.stringify(dataToSave));

                // console.log("ddd",formData)
let form=new FormData()
form.append("name",formData.name)
form.append("email",formData.email)
form.append("phone",formData.phone)
form.append("message",formData.message)
form.append("image",formData.image)

                dispatch(design_add(form))
          
                  toast.success("Form submitted");
            };
            reader.readAsDataURL(formData.image);
              setFormData({
                  name: '',
        email: '',
        phone: '',
        message: '',
        image: null, 
            })
        } else {
            // localStorage.setItem('formData', JSON.stringify(formData));
            toast.error('error ');
        }
    };
    useEffect(()=>{
window.scrollTo(0,0)
    },[])
    return (
        <div className="overflow-x-hidden">
            <Header />
            <div className="w-full mt-[72px] md:mt-[100px]">
                <div className="w-full md:w-[90%] lg:w-[93%] mx-auto px-2 md:px-4 py-8 mt-5">
                    <div className="mt-5">
                        <div className="max-w-xl mx-auto shadow-lg rounded-xl">
                            <h2 className="text-2xl font-bold py-4 text-white rounded-t bg-black text-center">Query Form</h2>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-10 p-6 bg-white">
                                <div>
                                    <label className="block font-medium">Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder='Enter your name'
                                        required
                                        className="w-full p-2 border rounded-md"
                                        type="text"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium">Email</label>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder='Enter your email'
                                        required
                                        className="w-full p-2 border rounded-md"
                                        type="email"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium">Phone Number</label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder='Enter your phone number'
                                        required
                                        className="w-full p-2 border rounded-md"
                                        type="tel"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium">Upload Image</label>
                                    <input
                                        name="image"
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                        type="file"
                                        accept="image/*"
                                    />
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-20 h-20 mt-2 object-cover rounded-full"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block font-medium">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder='message...'
                                        required
                                        className="w-full p-2 border rounded-md"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-all"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <div className="fixed bottom-0 w-full md:hidden z-50">
                <MobileFooter />
            </div>
        </div>
    )
}

export default QueryForm;