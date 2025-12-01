import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { get_category } from "../store/reducers/homeReducer";
import { Link } from "react-router-dom";

const GifImages = () => {
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  return (
    <div className="w-full md:w-[90%] lg:w-[90%] mx-auto p-2 md:p-6">

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        loop={true}
        autoplay={{ delay: 3000 }}
        className="mb-5"
        breakpoints={{
          100: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
        }}
      >
        {Array.isArray(categorys) &&
          categorys.slice(0,2).map((item, index) => (
            <SwiperSlide key={index}>
              <Link to={`/category-data/${item.slug}`}>
                <div className="text-center">
                  <div className="h-auto w-auto overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="mx-auto w-full h-[12vh] md:h-[30vh] object-cover hover:scale-110 overflow-hidden transition duration-700"
                    />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default GifImages;
