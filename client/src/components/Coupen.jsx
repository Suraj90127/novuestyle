import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { get_category, getDiscount } from "../store/reducers/homeReducer";
import { Link } from "react-router-dom";

const Coupen = () => {
  const dispatch = useDispatch();
  const { discount } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(getDiscount());
  }, [dispatch]);
  


  return (
    <div className="w-full md:w-[90%] lg:w-[90%] mx-auto  pt-2 md:p-6 md:hidden">

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={3}
        loop={true}
        autoplay={{ delay: 3000 }}
        className=""
        breakpoints={{
          100: { slidesPerView: 3 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 3 },
        }}
      >
        {discount?.slice(0,3)?.map((item, index) => (
            <SwiperSlide key={index}>
              <Link>
                <div className="text-center">
                  <div className="h-auto w-auto overflow-hidden">
                    <img
                      src={item?.images[0]}
                      alt={`coupen`}
                      className="mx-auto w-full h-[100px] md:h-[30vh] object-fill hover:scale-110 overflow-hidden transition duration-700"
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

export default Coupen;
