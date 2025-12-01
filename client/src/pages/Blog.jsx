import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import img1 from "../assets/banner/banner1.jpg";
import { Link } from "react-router-dom";
import MobileFooter from "../components/MobileFooter";
import { useDispatch, useSelector } from "react-redux";
import { get_blogs } from "../store/reducers/blogReducer";
import { get_category, get_products } from "../store/reducers/homeReducer";

const Blog = () => {
  const { blogs } = useSelector((state) => state.blog);
  const { products, categorys } = useSelector((state) => state.home);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_blogs());
    dispatch(get_products());
    dispatch(get_category());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-[#ecf1f2]">
      <Header />
      <div className="mt-[150px] md:mt-[180px]">
        <div>
          <img src={img1} alt="banner" className="w-full h-auto" />
        </div>

        <div>
          <div className="md:container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Sidebar */}
              <div className="w-full md:w-[25%]">
                {/* Search Bar */}
                <div className="mb-8">
                  <h2 className="text-lg font-[500] underline mb-4">Search</h2>
                  <div className="flex w-full">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-none"
                    />
                    <button className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-black focus:outline-none focus:ring-0">
                      Search
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h2 className="text-lg font-[500] underline mb-4">
                    Categories
                  </h2>
                  {categorys.slice(1, 6).map((category, index) => (
                    <ul key={index} className="space-y-2">
                      <Link to={`/category-data/${category.slug}`}>
                        <li className="text-gray-500 hover:text-primary">
                          {category.name}
                        </li>
                      </Link>
                    </ul>
                  ))}
                </div>

                {/* Recently Viewed Products */}
                <div className="mb-8">
                  <h2 className="text-lg font-[500] underline mb-4">
                    Recently Viewed Products
                  </h2>
                  <div className="space-y-4">
                    {products.slice(2, 6).map((product, index) => (
                      <div key={index}>
                        <Link
                          to={`/product/details/${product.slug}`}
                          className="flex items-center space-x-4 "
                        >
                          <img
                            src={product.images[0].url}
                            alt="Product"
                            width={50}
                            height={50}
                            className="rounded object-cover h-10 w-10"
                          />
                          <div>
                            <h3 className="font-semibold hover:text-primary">
                              {product.name.split(" ").slice(0, 4).join(" ")}...
                            </h3>
                            <p className="text-sm text-gray-600">
                              ₹{product.price}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Blog Posts */}
                <div>
                  <h2 className="text-lg font-[500] underline mb-4">
                    Recent Blog Posts
                  </h2>
                  {blogs.map((blog, index) => (
                    <ul key={index} className="space-y-4 flex flex-col gap-4">
                      <Link to={`/blogdetail/${blog.slug}`}>
                        <li className="text-gray-500 hover:text-primary">
                          {blog.name.split(" ").slice(0, 6).join(" ")}...{" "}
                        </li>
                      </Link>
                    </ul>
                  ))}
                </div>
              </div>

              {/* Right Content Area */}
              <div className="w-full md:w-[75%] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogs.map((post, index) => (
                    <div key={index} className=" bg-white overflow-hidden ">
                      <div className="relative h-40 overflow-hidden  w-full">
                        <div className="absolute w-full h-full left-1/2  transform -translate-x-1/2 bg-opacity-50 bg-black  flex items-center justify-center">
                          <h3 className="text-white text-xl font-bold text-center px-4">
                            {post.name}
                          </h3>
                        </div>
                        <img
                          src={post.images[0]}
                          alt="Blog post"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        {post.description.slice(0, 1).map((desc, index) => (
                          <p key={index} className="text-gray-600 mb-4">
                            {desc}
                          </p>
                        ))}
                        <Link to={`/blogdetail/${post.slug}`}>
                          <button className=" text-primary hover:bg-primary hover:text-white transition-all px-4 py-1 border border-primary ">
                            Read More
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default Blog;
