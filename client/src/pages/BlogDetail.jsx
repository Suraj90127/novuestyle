import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import img1 from "../assets/home_banners_3._1_1950x.jpg";
import { Link, useParams } from "react-router-dom";
// import LatestJawlry from "../Home/LatestJewlry";
import MobileFooter from "../components/MobileFooter";
import { get_blog, get_blogs } from "../store/reducers/blogReducer";
import { get_category, get_products } from "../store/reducers/homeReducer";
import { useDispatch, useSelector } from "react-redux";

const BlogDetail = () => {
  const { blogs, blogData } = useSelector((state) => state.blog);
  const { products, categorys } = useSelector((state) => state.home);

  const dispatch = useDispatch();
  const { slug } = useParams();

  useEffect(() => {
    dispatch(get_blogs());
    dispatch(get_products());
    dispatch(get_category());
  }, [dispatch]);

  const singleBlog = blogs.find((blog) => blog.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-[#ecf1f2]">
      <Header />
      <div className="mt-[150px] md:mt-[180px]  ">
        {singleBlog?.images?.[0] ? (
          <img
            src={singleBlog.images[0]}
            alt="banner"
            className="w-full md:h-[70vh] object-cover overflow-hidden"
          />
        ) : (
          <p>No image available</p>
        )}

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
                <div className="max-w-4xl mx-auto md:px-4 py-8 text-left">
                  <h1 className="text-2xl md:text-4xl font-bold mb-6">
                    {singleBlog?.name}
                  </h1>

                  <p className="mb-4">{singleBlog?.description?.[0]}</p>
                  <p className="mb-4">{singleBlog?.description?.[1]}</p>
                  <p className="mb-6">{singleBlog?.description?.[2]}</p>

                  {/* Map over additionalDescription */}
                  {singleBlog?.additionalDescription.map((temp, index) => (
                    <section
                      key={index}
                      className="mx-auto px-4 py-8 flex flex-col items-left gap-3"
                    >
                      <h2 className="text-2xl font-bold mb-4">
                        {temp.heading}
                      </h2>

                      {/* Display only one image for the current index */}
                      {singleBlog?.images?.[index] && (
                        <div className="mb-4">
                          <img
                            src={singleBlog.images[index + 1]} // Access only the image at the current index
                            alt={`Image for ${temp.heading}`}
                            width={300}
                            height={300}
                            className="bg-primary"
                          />
                        </div>
                      )}

                      <p className="mb-4">{temp.description}</p>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <LatestJawlry /> */}

      <Footer />
      <div className="fixed bottom-0 w-full sm:block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default BlogDetail;
