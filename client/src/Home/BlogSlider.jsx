// components/BlogSlider.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import { get_blogs } from "../store/reducers/blogReducer";

const BlogSlider = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(get_blogs());
  }, [dispatch]);

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No blogs available
      </div>
    );
  }

  return (
    <div className="relative w-full md:w-[90%] mx-auto py-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-gray-800">
        Latest <span className="text-primary">Blog Posts</span>
      </h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={false}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop
        breakpoints={{
          480: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="blog-swiper"
      >
        {blogs.map((post, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-96 group rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
              <img
                src={post.images[0]}
                alt={post.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {post.name}
                  </h3>
                  {post.description && post.description[0] && (
                    <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                      {post.description[0]}
                    </p>
                  )}
                  <Link to={`/blogdetail/${post.slug}`}>
                    <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md text-sm uppercase tracking-wide font-semibold transition-all duration-300">
                      Read More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogSlider;
